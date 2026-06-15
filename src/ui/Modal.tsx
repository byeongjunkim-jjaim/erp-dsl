'use client';
// Modal 유기체 — 도메인 무관 껍데기. 본문(children)에 도메인 폼이 오되 Modal은 모름(방식 A).
// 헤더(제목+X)는 Mantine 내부에 위임하지 않고 우리 Group으로 직접 조립한다.
//  → 정렬 보장이 Mantine이 아니라 우리 프리미티브에서 나온다(서드파티 내부 레이아웃 불신).
// 푸터: actions를 variant 보고 배치 고정(primary/danger 맨 오른쪽, 순서 무관).
import { Modal as M } from '@mantine/core';
import type { ReactNode } from 'react';
import { Stack } from './Stack';
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
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
  children: ReactNode;
};

const isPrimaryEnd = (v?: string) => v === 'primary' || v === 'danger';

export function Modal({
  opened, onClose, title, actions, size = 'md', closeOnOverlayClick = true, children,
}: Props) {
  const ordered = actions
    ? [...actions].sort((a, b) => Number(isPrimaryEnd(a.variant)) - Number(isPrimaryEnd(b.variant)))
    : [];

  return (
    <M
      opened={opened}
      onClose={onClose}
      size={size}
      centered
      closeOnClickOutside={closeOnOverlayClick}
      radius="md"
      shadow="md"
      withCloseButton={false}  /* 기본 헤더 끔 — 우리가 직접 조립 */
      padding="md"
    >
      <Stack gap="md">
        {/* 우리 Group으로 헤더 조립 → 제목·X 세로정렬은 우리 보장 */}
        <Group justify="between" align="center">
          <Title variant="heading">{title}</Title>
          <span role="button" aria-label="닫기" onClick={onClose} style={{ display: 'inline-flex', cursor: 'pointer' }}>
            <Icon name="x" color="secondary" />
          </span>
        </Group>

        <div>{children}</div>

        {ordered.length > 0 && (
          <Group justify="end" gap="xs">
            {ordered.map((a, i) => renderAction(a, i))}
          </Group>
        )}
      </Stack>
    </M>
  );
}
