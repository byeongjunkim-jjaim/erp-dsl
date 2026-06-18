'use client';
// Drawer 유기체 — Modal의 슬라이드오버 형제. edge(좌/우/상/하)에서 들어오는 패널.
//  · "맥락을 떠나지 않고 옆에서 처리"하는 흐름용(상세 편집·필터 패널). Modal=중앙 집중, Drawer=가장자리.
//  · Modal과 동일한 3영역 계약(헤더 고정 / 본문 스크롤 / 푸터 고정) — 헤더·푸터는 우리 Group으로 직접 조립.
//    (정렬 보장이 서드파티 내부가 아니라 우리 프리미티브에서. Modal과 같은 사유.)
//  · Mantine Drawer 격리 래핑(헌법 7). 닫힌 props: position·size·actions. className/style 비노출.
import { Drawer as D } from '@mantine/core';
import type { ReactNode } from 'react';
import { Group } from './Group';
import { Title } from './Title';
import { Icon } from './Icon';
import type { Action } from './_cells';
import { renderAction } from './_cells';

type Props = {
  opened: boolean;
  onClose: () => void;
  title: string;
  actions?: Action[];
  position?: 'left' | 'right' | 'top' | 'bottom';  // 기본 right(상세 편집 표준)
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
  children: ReactNode;
};

const isPrimaryEnd = (v?: string) => v === 'primary' || v === 'danger';

export function Drawer({
  opened, onClose, title, actions, position = 'right', size = 'md', closeOnOverlayClick = true, children,
}: Props) {
  const ordered = actions
    ? [...actions].sort((a, b) => Number(isPrimaryEnd(a.variant)) - Number(isPrimaryEnd(b.variant)))
    : [];

  return (
    <D
      opened={opened}
      onClose={onClose}
      position={position}
      size={size}
      closeOnClickOutside={closeOnOverlayClick}
      withCloseButton={false}  /* 기본 헤더 끔 — 우리가 직접 조립 */
      padding={0}              /* 본문 패딩 끔 — 패딩 주인을 우리 3영역으로 이관 */
    >
      {/* 3영역 flex 세로 — Drawer는 풀하이트라 height:100%로 채우고 본문만 스크롤. */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 헤더(고정) */}
        <div style={{ flex: 'none', padding: 'var(--mantine-spacing-md)', borderBottom: `var(--border-width) solid var(--border-default)` }}>
          <Group justify="between" align="center">
            <Title variant="heading">{title}</Title>
            <span role="button" aria-label="닫기" onClick={onClose} style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <Icon name="x" color="secondary" />
            </span>
          </Group>
        </div>

        {/* 본문(스크롤) */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--mantine-spacing-md)' }}>
          {children}
        </div>

        {/* 푸터(고정) — actions 있을 때만 */}
        {ordered.length > 0 && (
          <div style={{ flex: 'none', padding: 'var(--mantine-spacing-md)', borderTop: `var(--border-width) solid var(--border-default)` }}>
            <Group justify="end" gap="xs">
              {ordered.map((a, i) => renderAction(a, i))}
            </Group>
          </div>
        )}
      </div>
    </D>
  );
}
