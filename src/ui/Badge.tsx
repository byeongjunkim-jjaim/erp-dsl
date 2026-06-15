// Badge 원자 — 표시 전용(행동 없음). primary 제외(브랜드색은 상태 아님).
import { Badge as MantineBadge } from '@mantine/core';

type BadgeColor = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
type BadgeProps = { color?: BadgeColor; children: string };

export function Badge({ color = 'neutral', children }: BadgeProps) {
  return <MantineBadge color={color} variant="light" radius="sm">{children}</MantineBadge>;
}
