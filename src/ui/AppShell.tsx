'use client';
// AppShell 유기체 — ERP 공통 셸 레이아웃 규격(모든 페이지 상속). 상단바 없음(A안).
// 넷바: 로고(넉넉한 상하 여백, 위)·메뉴(중, 그룹)·프로필 카드(아래). 콘텐츠는 우측 전체(bg.tertiary).
//  · 프로필 카드는 셸이 *형식을 고정*하고 데이터만 주입(avatar+이름+직책+더보기). 더보기 팝업은 보류.
//  · logo/logoMark = 넷바 펼침/접힘 상태. 모바일은 드로어 + 햄버거.
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
type Props = {
  logo: ReactNode;
  logoMark?: ReactNode;
  onLogoClick?: () => void;
  menuItems: MenuItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  profile?: Profile;
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
  logo, logoMark, onLogoClick, menuItems, activePath, onNavigate, profile, children,
}: Props) {
  const [opened, { toggle, close }] = useDisclosure();
  const groups = groupItems(menuItems);
  const handleNav = (path: string) => { onNavigate(path); close(); };

  return (
    // 콘텐츠 패딩 = lg (헤더 위 여백). ListPage Stack gap=lg와 같은 토큰 → 위·아래 리듬 통일.
    <M navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }} padding="lg">
      {/* 우측 그림자 = 넷바도 "떠 있는 패널". 방향만 우향, 색은 그림자 토큰과 같은 navy 계열(11,26,53).
          강도는 sm(은은) — 카드(md)보다 약하게 둬 위계 유지. */}
      <M.Navbar p="md" style={{ boxShadow: '2px 0 8px rgba(11, 26, 53, 0.08)', borderRight: 'none', zIndex: 1 }}>
        {/* 로고 — 메뉴보다 넉넉한 상하 여백(아래 xl). SVG/풀 로고는 주입. */}
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

        {/* 프로필 카드 — 셸이 형식 고정(좌 avatar / 중 이름·직책 / 우 더보기). 데이터만 주입. */}
        {profile && (
          <M.Section style={{ paddingTop: 'var(--mantine-spacing-md)' }}>
            <Card variant="outlined" padding="sm">
              <MGroup justify="space-between" align="center" wrap="nowrap">
                <MGroup gap="sm" align="center" wrap="nowrap">
                  <Avatar src={profile.avatarSrc} size="md">{profile.name.slice(0, 1)}</Avatar>
                  <MStack gap={2}>
                    <Text variant="body-strong">{profile.name}</Text>
                    {profile.role && <Text variant="caption" color="secondary">{profile.role}</Text>}
                  </MStack>
                </MGroup>
                <IconButton icon="dots" label="프로필 메뉴" variant="ghost" onClick={profile.onMenuClick} />
              </MGroup>
            </Card>
          </M.Section>
        )}
      </M.Navbar>

      <M.Main style={{ background: 'var(--bg-tertiary)', minHeight: '100vh' }}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" mb="md" />
        {children}
      </M.Main>
    </M>
  );
}
