'use client';
// AppShell 유기체 — ERP 공통 셸 레이아웃 규격(모든 페이지 상속).
// 구조: 좌측 넷바(고정) + 우상단 바(고정) + 콘텐츠(우측 전체, bg.tertiary).
//  · 넷바: 로고(위, 넉넉한 여백) · 메뉴(중, 그룹). 로고는 넷바 최상단 유지(a형).
//  · 상단바: 좌측 비움(브레드크럼/검색 없음 — 넷바가 항상 전체 경로 제공). 우측 밀착으로 [알림][프로필 카드] 순.
//  · 프로필 카드는 셸이 형식 고정(좌 avatar / 중 이름·직책 / 우 더보기), 데이터만 주입. 더보기 팝업은 보류.
//  · 알림: bell 버튼 + 안 읽음 점. 목록 드롭다운은 보류(rule of three) — onClick만.
import { AppShell as M, Burger, NavLink, Group as MGroup, Stack as MStack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';
import { Divider } from './Divider';
import { Avatar } from './Avatar';
import { IconButton } from './IconButton';
import { Popover } from './Popover';
import { Stack } from './Stack';
import { renderAction, type Action } from './_cells';

type MenuItem = { label: string; icon: IconName; path: string; group?: string };
// 프로필 더보기: menu(Action[]) 주면 Popover로 메뉴, 없으면 onMenuClick 폴백(경쟁 경로 아님).
type Profile = { name: string; role?: string; email?: string; avatarSrc?: string; onMenuClick?: () => void; menu?: Action[] };
// 알림: content 주면 Popover로 목록, 없으면 onClick 폴백.
type Notification = { hasUnread?: boolean; onClick?: () => void; content?: ReactNode };
type Props = {
  logo: ReactNode;
  logoMark?: ReactNode;
  onLogoClick?: () => void;
  menuItems: MenuItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  profile?: Profile;
  notification?: Notification;
  children: ReactNode;
};

// 셸 치수(px). 잠정값 — 화면 검증 후 조정.
//  HEADER_HEIGHT  : 우상단 바 높이.
//  LOGO_BAND      : 넷바 최상단 로고 밴드 높이. 헤더보다 *크게* 잡아 로고가 상단바보다 우위.
//  LOGO_HEIGHT    : 로고 자체(슬롯 자식 img/svg) 높이. 밴드 안에서 세로 중앙. 텍스트 로고는
//                   글자 크기를 슬롯 내용(호출측)이 정하므로 이 값의 영향을 받지 않는다(appshell.css는 img/svg만 맞춤).
const HEADER_HEIGHT = 72;
const LOGO_BAND = 96;
const LOGO_HEIGHT = 40;

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
  logo, logoMark, onLogoClick, menuItems, activePath, onNavigate, profile, notification, children,
}: Props) {
  const [opened, { toggle, close }] = useDisclosure();
  const [notifOpen, notifH] = useDisclosure();
  const [menuOpen, menuH] = useDisclosure();
  const groups = groupItems(menuItems);
  const handleNav = (path: string) => { onNavigate(path); close(); };

  return (
    <M
      layout="alt"
      header={{ height: HEADER_HEIGHT }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="lg"
    >
      {/* 상단바(고정) — 좌측 비움, 우측 밀착 [알림][프로필]. 아래로 은은한 그림자(sm).
          layout=alt: 넷바가 좌측 full-height라 넷바를 위(z=2)로 올려 우측 그림자가 상단바
          구간에서도 끊기지 않게 한다(헤더 z=1). */}
      <M.Header
        style={{ boxShadow: '0 1px 2px rgba(11, 26, 53, 0.08)', borderBottom: 'none', zIndex: 1 }}
      >
        <MGroup h="100%" px="lg" align="center" wrap="nowrap">
          {/* 모바일 햄버거(좌) — 데스크탑에선 숨김. 우측 클러스터는 marginLeft auto로 항상 우측 밀착. */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
                  <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <Text variant="body-strong">{profile.name}</Text>
                    {profile.role && <Text variant="caption" color="secondary">{profile.role}</Text>}
                  </span>
                  <Icon name="chevron-down" size="sm" color="secondary" />
                </>
              );
              // menu 있으면 Popover(신원 헤더 + 구분선 + 액션), 없으면 onMenuClick 폴백(배타 경로).
              return profile.menu && profile.menu.length > 0 ? (
                <Popover opened={menuOpen} onChange={(o) => (o ? menuH.open() : menuH.close())}
                  position="bottom" width="sm"
                  content={
                    <Stack gap="xs">
                      <MGroup gap="sm" align="center" wrap="nowrap">
                        <Avatar src={profile.avatarSrc} size="md">{profile.name.slice(0, 1)}</Avatar>
                        <MStack gap={2}>
                          <Text variant="body-strong">{profile.name}</Text>
                          {(profile.email || profile.role) && (
                            <Text variant="caption" color="secondary">{profile.email ?? profile.role}</Text>
                          )}
                        </MStack>
                      </MGroup>
                      <Divider />
                      {profile.menu.map((a, i) => renderAction(
                        { ...a, onClick: () => { menuH.close(); a.onClick(); } }, i,
                      ))}
                    </Stack>
                  }>
                  <span className="erp-profile-trigger">{inner}</span>
                </Popover>
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

      {/* 넷바(고정) — 우측 그림자로 "떠 있는 패널"(sm, navy 토큰색). 로고(위) + 메뉴(중). */}
      <M.Navbar p="md" style={{ boxShadow: '2px 0 8px rgba(11, 26, 53, 0.08)', borderRight: 'none', zIndex: 2 }}>
        {/* 로고 — a형: 넷바 최상단. layout=alt라 넷바가 좌측 전체(상단 끝까지)를 차지하고,
            로고 밴드는 헤더보다 큰 고정 높이(LOGO_BAND)로 잡아 상단바보다 우위에 둔다.
            밴드 하단 구분선으로 "메뉴와 분리된 정체성 블록"임을 드러낸다. */}
        <M.Section
          style={{
            height: LOGO_BAND,
            display: 'flex',
            alignItems: 'center',
            paddingBottom: 'var(--mantine-spacing-md)',
            marginBottom: 'var(--mantine-spacing-md)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          {/* 슬롯 래퍼: 고정 높이로 어떤 로고든 같은 크기로 통일. 자식 img/svg는 appshell.css(.erp-logo-slot)가
              height:100%로 맞춤 — 슬롯 자식은 인라인 style로 못 닿아 자손 셀렉터(className)가 필요하다. */}
          <span
            className="erp-logo-slot"
            style={{
              height: LOGO_HEIGHT,
              display: 'inline-flex',
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
                    active={activePath === it.path} onClick={() => handleNav(it.path)} />
                ))}
              </MStack>
            ))}
          </MStack>
        </M.Section>
      </M.Navbar>

      <M.Main style={{ background: 'var(--bg-tertiary)', minHeight: '100vh' }}>
        {children}
      </M.Main>
    </M>
  );
}
