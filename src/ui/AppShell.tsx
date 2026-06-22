'use client';
// AppShell 유기체 — ERP 공통 셸 레이아웃 규격(모든 페이지 상속). 셸 크롬만 소유.
//  · 경계: AppShell은 children만 받는다 — PageHeader는 페이지 템플릿(ListPage/DetailPage/HierarchyExplorer)이 소유,
//    셸은 비소유. "AppShell + PageHeader가 모든 화면 고정"의 책임 분담선.
// 구조(데스크탑): 좌측 넷바(고정) + 우상단 바(고정) + 콘텐츠(우측 전체, bg.tertiary).
//  · 넷바: 로고(위, 넉넉한 여백) · 메뉴(중, 그룹). 로고는 넷바 최상단 유지(a형).
//  · 상단바: 좌측 비움(브레드크럼/검색 없음 — 넷바가 항상 전체 경로 제공). 우측 밀착으로 [알림][프로필] 순.
//  · 프로필: 셸이 형식 고정(좌 avatar / 중 이름·직책 / 우 caret). menu(Action[]) 주면 Popover 메뉴, 없으면 onMenuClick 폴백(배타 경로).
//  · 알림: bell 버튼 + 안 읽음 점. content 주면 Popover 목록, 없으면 onClick 폴백(배타 경로).
// 구조(모바일, 좁은 화면) — 넷바(서랍) 대신 모바일 앱처럼 재구성:
//  · 상단바: 좌측에 로고(데스크탑은 넷바가 소유 → 모바일에선 헤더로) + 우측 [알림][프로필].
//    프로필은 모바일에선 *아바타-only*(이름·직책·caret은 visibleFrom=sm로 데스크탑만 — 좁은 헤더 줄바꿈 방지. 탭→메뉴 헤더에 이름 노출).
//  · 하단 탭 내비: 메뉴 항목을 아이콘+라벨 탭으로. 같은 menuItems/activePath/onNavigate 재사용(새 prop 0).
//  · 네이티브 앱 스크롤(appshell.css 모바일 미디어쿼리): 헤더·하단탭 고정, 본문만 내부 스크롤(짧으면 0·길면 그만큼,
//    끝에서 바운스 없이 멈춤). 페이지(body) 스크롤은 잠가 고무줄 바운스·잉여 스크롤 제거. 데스크탑은 문서 스크롤 그대로.
//  · 셸 골격(M.Header/Navbar/Main/Footer 슬롯·바 정렬·safe-area)은 우리 콘텐츠 프리미티브가 노출 안 한
//    탈출구라 격리 구역 내 raw Mantine/CSS(헌법 7) — Modal raw flex·Calendar raw grid와 같은 명시 예외 범주.
//    단 슬롯 *안의 콘텐츠*(탭 타일·메뉴 행)는 우리 Stack/Group/Icon/Text로 조립한다(도그푸드).
import { AppShell as M, NavLink, Box, Group as MGroup, Stack as MStack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';
import { CountBadge } from './CountBadge';
import { Avatar } from './Avatar';
import { IconButton } from './IconButton';
import { Popover } from './Popover';
import { Menu } from './Menu';
import { Stack } from './Stack';
import { Group } from './Group';
import { type Action } from './_cells';

type MenuItem = { label: string; icon: IconName; path: string; group?: string; count?: number };
// 프로필 더보기: menu(Action[]) 주면 Popover로 메뉴, 없으면 onMenuClick 폴백(경쟁 경로 아님).
type Profile = { name: string; role?: string; email?: string; avatarSrc?: string; onMenuClick?: () => void; menu?: Action[] };
// 알림: content 주면 Popover로 목록, 없으면 onClick 폴백.
type Notification = { hasUnread?: boolean; onClick?: () => void; content?: ReactNode };
type Props = {
  logo: ReactNode;
  onLogoClick?: () => void;
  menuItems: MenuItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  profile?: Profile;
  notification?: Notification;
  children: ReactNode;
};

// 셸 치수(px) — 시중 표준 참조로 확정.
//  HEADER_HEIGHT    : 우상단 바 높이 64 (Material 데스크톱 toolbar 표준 56~64). 데스크탑·모바일 공통.
//                     넷바 폭 260(표준 240~300)·알림/프로필 아이콘 md=36(36×36 표준)은 아래 navbar/IconButton에서.
//  LOGO_BAND        : 넷바 최상단 정체성 블록 높이 88 — 헤더(64)보다 크게 잡아 로고를 상단바보다 우위에 둔다(의도적 비표준).
//  LOGO_SLOT_HEIGHT : 데스크탑 로고 박스 높이 56(밴드를 거의 채움). 로고는 이 박스에 종횡비대로 최대 적합 —
//                     가변 로고(가로/세로/정사각/원형)가 폭·높이 중 닿는 쪽으로 채우고 절대 찌그러지지 않는다.
//                     단일 높이 캡 아님. 텍스트 로고는 호출측 글자 크기(영향 없음).
const HEADER_HEIGHT = 64;
const LOGO_BAND = 88;
const LOGO_SLOT_HEIGHT = 56;

// 모바일 재구성 치수 — breakpoint 'sm'(=768px)을 우리 의도된 데스크탑↔모바일 분기점으로 고정한다.
//  넷바 collapse·footer collapse·헤더 로고 노출이 모두 이 한 점을 공유(Mantine 기본 sm을 우리 분기로 채택, 무주석 누수 방지).
//  MOBILE_LOGO_HEIGHT : 모바일 상단바 좌측 로고 박스 높이 40 — 헤더(64) 안에 수직 패딩과 함께 들어오는 최대치.
//                       데스크탑 넷바 밴드(88/로고56)와 별개 맥락(정체성 블록 vs 헤더 유틸리티). 잠정 — 화면 검증서 8px 스냅.
//  BOTTOM_NAV_HEIGHT  : 하단 탭바 콘텐츠 높이 56 (Material bottom nav 표준; 아이콘+라벨, 탭당 ≥48 터치타깃). 잠정 — 8px 스냅.
//                       footer 총높이 = 56 + env(safe-area-inset-bottom)(아이폰 홈 인디케이터) —
//                       공간 장부의 잠정 동적 단위(명시 예외, Modal 85vh와 동류). Mantine이 같은 값으로 Main 하단을 오프셋해 정합 유지.
//  MAX_TABS           : 하단 탭 최대 5(모바일 관습). 초과 시 앞 4 + '더보기'(나머지는 Popover 목록). 옵션 쌓기 금지(§11-3).
const MOBILE_LOGO_HEIGHT = 40;
const BOTTOM_NAV_HEIGHT = 56;
const MAX_TABS = 5;

function groupItems(items: MenuItem[]): Array<{ group?: string; items: MenuItem[] }> {
  const out: Array<{ group?: string; items: MenuItem[] }> = [];
  for (const it of items) {
    const last = out[out.length - 1];
    if (last && last.group === it.group) last.items.push(it);
    else out.push({ group: it.group, items: [it] });
  }
  return out;
}

export function AppShell({
  logo, onLogoClick, menuItems, activePath, onNavigate, profile, notification, children,
}: Props) {
  const [notifOpen, notifH] = useDisclosure();
  const [moreOpen, moreH] = useDisclosure();
  // 하단 탭 footer는 collapsed가 단일 boolean(navbar의 {mobile,desktop}와 다름)이라 분기를 JS로 계산.
  //  '48em' = breakpoint sm(우리 데스크탑↔모바일 분기, 위 상수 주석). 초기값 true(desktop 가정) → SSR/첫 렌더 안정,
  //  마운트 후 실제 뷰포트 반영(하이드레이션 불일치 없음).
  const isDesktop = useMediaQuery('(min-width: 48em)', true);
  const groups = groupItems(menuItems);

  // 하단 탭 분배: 5개 이하면 전부, 초과면 앞 4개 + '더보기'(나머지는 Popover 목록).
  const overflow = menuItems.length > MAX_TABS;
  const tabItems = overflow ? menuItems.slice(0, MAX_TABS - 1) : menuItems;
  const moreItems = overflow ? menuItems.slice(MAX_TABS - 1) : [];
  const moreActive = moreItems.some((it) => it.path === activePath);

  // 탭 타일(아이콘 위 라벨) — 우리 Stack/Icon/Text로 조립. 활성은 색 역할(primary) vs secondary로 구분.
  //  (브랜드 틴트 활성은 Text가 닫힌 텍스트 역할만 노출해 불가 — 필요 시 브랜드 텍스트 역할 신설은 별도 큐레이션.)
  const tile = (icon: IconName, label: string, active: boolean, count?: number) => (
    <Stack gap="xxs" align="center">
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <Icon name={icon} size="sm" color={active ? 'primary' : 'secondary'} />
        {count != null && count > 0 && (
          <span style={{ position: 'absolute', top: -7, left: '100%', marginLeft: -8 }}><CountBadge count={count} /></span>
        )}
      </span>
      <Text variant="caption" color={active ? 'primary' : 'secondary'}>{label}</Text>
    </Stack>
  );

  return (
    <M
      layout="alt"
      header={{ height: HEADER_HEIGHT }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: true } }}
      footer={{ height: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`, collapsed: isDesktop }}
      padding="lg"
    >
      {/* 상단바(고정) — 모바일 좌측 로고 + 우측 밀착 [알림][프로필]. 아래로 은은한 그림자(sm).
          layout=alt: 넷바가 좌측 full-height라 넷바를 위(z=2)로 올려 우측 그림자가 상단바
          구간에서도 끊기지 않게 한다(헤더 z=1). */}
      <M.Header
        style={{ boxShadow: '0 1px 2px rgba(11, 26, 53, 0.08)', borderBottom: 'none', zIndex: 1 }}
      >
        <MGroup h="100%" px="lg" align="center" wrap="nowrap">
          {/* 모바일 로고(좌) — 데스크탑에선 넷바가 소유하므로 hiddenFrom='sm'로 감춘다.
              같은 .erp-logo-slot contain 규칙 재사용(찌그러짐 0). 우측 클러스터는 marginLeft auto로 항상 우측 밀착. */}
          <Box
            hiddenFrom="sm"
            className="erp-logo-slot"
            onClick={onLogoClick}
            style={{
              height: MOBILE_LOGO_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              cursor: onLogoClick ? 'pointer' : 'default',
            }}
          >
            {logo}
          </Box>
          <MGroup gap="sm" align="center" wrap="nowrap" style={{ marginLeft: 'auto' }}>
            {notification && (() => {
              const bell = (
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <IconButton icon="bell" label="알림" variant="ghost"
                    onClick={notification.content ? undefined : notification.onClick} />
                  {notification.hasUnread && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute', top: 6, right: 6, width: 8, height: 8,
                        borderRadius: 'var(--mantine-radius-full)',
                        background: 'var(--mantine-color-danger-6)',
                        border: '2px solid var(--bg-primary)',
                      }}
                    />
                  )}
                </span>
              );
              // content 있으면 Popover로 목록, 없으면 bell 단독(onClick 폴백).
              return notification.content ? (
                <Popover opened={notifOpen} onChange={(o) => (o ? notifH.open() : notifH.close())}
                  position="bottom" width="md" content={notification.content}>
                  {bell}
                </Popover>
              ) : bell;
            })()}
            {profile && (() => {
              // 단일 트리거: 아바타 + 이름/직책 + caret 전체가 클릭 대상(테두리 카드·별도 dots 제거).
              const inner = (
                <>
                  <Avatar src={profile.avatarSrc} size="md">{profile.name.slice(0, 1)}</Avatar>
                  {/* 이름·직책·caret = 데스크탑만(visibleFrom sm). 모바일은 아바타-only(좁은 헤더에서 이름 줄바꿈 방지).
                      모바일은 아바타 탭 → 메뉴 헤더에 이름·이메일이 이미 노출되어 정보 손실 0. */}
                  <Box visibleFrom="sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--mantine-spacing-sm)' }}>
                    <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                      <Text variant="body-strong">{profile.name}</Text>
                      {profile.role && <Text variant="caption" color="secondary">{profile.role}</Text>}
                    </span>
                    <Icon name="chevron-down" size="sm" color="secondary" />
                  </Box>
                </>
              );
              // menu 있으면 Menu 분자(신원 헤더 슬롯 + 액션), 없으면 onMenuClick 폴백(배타 경로).
              return profile.menu && profile.menu.length > 0 ? (
                <Menu
                  trigger={<span className="erp-profile-trigger">{inner}</span>}
                  items={profile.menu}
                  header={
                    <MGroup gap="sm" align="center" wrap="nowrap">
                      <Avatar src={profile.avatarSrc} size="md">{profile.name.slice(0, 1)}</Avatar>
                      <MStack gap={2}>
                        <Text variant="body-strong">{profile.name}</Text>
                        {(profile.email || profile.role) && (
                          <Text variant="caption" color="secondary">{profile.email ?? profile.role}</Text>
                        )}
                      </MStack>
                    </MGroup>
                  }
                />
              ) : (
                <span className="erp-profile-trigger" role="button" tabIndex={0}
                  onClick={profile.onMenuClick}
                  onKeyDown={profile.onMenuClick ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); profile.onMenuClick!(); }
                  } : undefined}>
                  {inner}
                </span>
              );
            })()}
          </MGroup>
        </MGroup>
      </M.Header>

      {/* 넷바(데스크탑 고정) — 우측 그림자로 "떠 있는 패널"(sm, navy 토큰색). 로고(위) + 메뉴(중).
          모바일에선 collapsed.mobile로 완전 숨김(하단 탭이 대체). */}
      <M.Navbar p="md" style={{ boxShadow: '2px 0 8px rgba(11, 26, 53, 0.08)', borderRight: 'none', zIndex: 2 }}>
        {/* 로고 — a형: 넷바 최상단. 밴드 높이 = 헤더(LOGO_BAND)라 하단 구분선이 상단바 바닥과 한 줄로 정렬되고,
            그 구분선이 "메뉴와 분리된 정체성 블록"을 드러낸다. */}
        <M.Section
          style={{
            height: LOGO_BAND,
            display: 'flex',
            alignItems: 'center',
            marginBottom: 'var(--mantine-spacing-md)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          {/* 슬롯 = 로고 박스(폭 전체 × LOGO_SLOT_HEIGHT). 자식 img/svg는 appshell.css가 object-fit:contain으로
              종횡비대로 박스를 최대 채움(좌측 정렬) — 어떤 로고 형태든 공기 없이. 슬롯 자식은 인라인 style로 못 닿아 className 필요. */}
          <span
            className="erp-logo-slot"
            style={{
              height: LOGO_SLOT_HEIGHT,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              cursor: onLogoClick ? 'pointer' : 'default',
            }}
            onClick={onLogoClick}
          >
            {logo}
          </span>
        </M.Section>

        {/* 메뉴 — 가운데 grow */}
        <M.Section grow>
          <MStack gap="md">
            {groups.map((g, gi) => (
              <MStack gap={4} key={gi}>
                {g.group && <Text variant="caption" color="secondary">{g.group}</Text>}
                {g.items.map((it) => (
                  <NavLink key={it.path} label={it.label}
                    leftSection={<Icon name={it.icon} size="sm" />}
                    rightSection={it.count != null && it.count > 0 ? <CountBadge count={it.count} /> : undefined}
                    active={activePath === it.path} onClick={() => onNavigate(it.path)} />
                ))}
              </MStack>
            ))}
          </MStack>
        </M.Section>
      </M.Navbar>

      {/* 데스크탑: minHeight 100vh로 문서 스크롤(기존). 모바일: appshell.css가 본문만 내부 스크롤(고정 헤더·하단탭 사이) — 바운스·잉여 스크롤 제거. */}
      <M.Main className="erp-appshell-main" style={{ background: 'var(--bg-tertiary)', minHeight: '100vh' }}>
        {children}
      </M.Main>

      {/* 하단 탭 내비(모바일 고정) — collapsed.desktop로 데스크탑 숨김. 골격은 footer 슬롯(raw, 명시 예외),
          타일·행 콘텐츠는 우리 Stack/Group/Icon/Text로 조립(도그푸드). */}
      <M.Footer className="erp-appshell-footer">
        <nav className="erp-bottomnav" aria-label="주 메뉴">
          {tabItems.map((it) => {
            const active = activePath === it.path;
            return (
              <button key={it.path} type="button" className="erp-tab" data-active={active}
                aria-current={active ? 'page' : undefined} onClick={() => onNavigate(it.path)}>
                {tile(it.icon, it.label, active, it.count)}
              </button>
            );
          })}
          {overflow && (
            <Popover opened={moreOpen} onChange={(o) => (o ? moreH.open() : moreH.close())}
              position="top" width="sm"
              content={
                <Stack gap="xxs">
                  {moreItems.map((it) => {
                    const active = activePath === it.path;
                    return (
                      <button key={it.path} type="button" className="erp-more-row" data-active={active}
                        onClick={() => { onNavigate(it.path); moreH.close(); }}>
                        <Group gap="sm" align="center">
                          <Icon name={it.icon} size="sm" color={active ? 'primary' : 'secondary'} />
                          <Text variant="body" color={active ? 'primary' : 'secondary'}>{it.label}</Text>
                          {it.count != null && it.count > 0 && <CountBadge count={it.count} />}
                        </Group>
                      </button>
                    );
                  })}
                </Stack>
              }>
              {/* 트리거는 Popover의 클릭 대상(span)에 맡긴다 — 중첩 button 방지. */}
              <span className="erp-tab" data-active={moreActive}>
                {tile('menu', '더보기', moreActive)}
              </span>
            </Popover>
          )}
        </nav>
      </M.Footer>
    </M>
  );
}
