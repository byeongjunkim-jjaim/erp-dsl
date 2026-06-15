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
import { Card } from './Card';
import { Avatar } from './Avatar';
import { IconButton } from './IconButton';

type MenuItem = { label: string; icon: IconName; path: string; group?: string };
type Profile = { name: string; role?: string; avatarSrc?: string; onMenuClick?: () => void };
type Notification = { hasUnread?: boolean; onClick?: () => void };
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
  const groups = groupItems(menuItems);
  const handleNav = (path: string) => { onNavigate(path); close(); };

  return (
    <M
      header={{ height: 72 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="lg"
    >
      {/* 상단바(고정) — 좌측 비움, 우측 밀착 [알림][프로필]. 아래로 은은한 그림자(sm). */}
      <M.Header
        style={{ boxShadow: '0 1px 2px rgba(11, 26, 53, 0.08)', borderBottom: 'none', zIndex: 2 }}
      >
        <MGroup h="100%" px="lg" align="center" wrap="nowrap">
          {/* 모바일 햄버거(좌) — 데스크탑에선 숨김. 우측 클러스터는 marginLeft auto로 항상 우측 밀착. */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <MGroup gap="sm" align="center" wrap="nowrap" style={{ marginLeft: 'auto' }}>
            {notification && (
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <IconButton icon="bell" label="알림" variant="ghost" onClick={notification.onClick} />
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
            )}
            {profile && (
              <Card variant="outlined" padding="sm">
                <MGroup gap="sm" align="center" wrap="nowrap">
                  <Avatar src={profile.avatarSrc} size="md">{profile.name.slice(0, 1)}</Avatar>
                  <MStack gap={2}>
                    <Text variant="body-strong">{profile.name}</Text>
                    {profile.role && <Text variant="caption" color="secondary">{profile.role}</Text>}
                  </MStack>
                  <IconButton icon="dots" label="프로필 메뉴" variant="ghost" onClick={profile.onMenuClick} />
                </MGroup>
              </Card>
            )}
          </MGroup>
        </MGroup>
      </M.Header>

      {/* 넷바(고정) — 우측 그림자로 "떠 있는 패널"(sm, navy 토큰색). 로고(위) + 메뉴(중). */}
      <M.Navbar p="md" style={{ boxShadow: '2px 0 8px rgba(11, 26, 53, 0.08)', borderRight: 'none', zIndex: 1 }}>
        {/* 로고 — a형: 넷바 최상단. 메뉴보다 넉넉한 하단 여백(xl). */}
        <M.Section style={{ paddingTop: 'var(--mantine-spacing-sm)', paddingBottom: 'var(--mantine-spacing-xl)' }}>
          <span style={{ cursor: onLogoClick ? 'pointer' : 'default', display: 'inline-flex' }} onClick={onLogoClick}>
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
