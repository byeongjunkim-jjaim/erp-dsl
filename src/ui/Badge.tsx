// Badge 원자 — 표시 전용(행동 없음). primary 제외(브랜드색은 상태 아님).
import { Badge as MantineBadge } from '@mantine/core';

type BadgeColor = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
type BadgeProps = { color?: BadgeColor; children: string };

export function Badge({ color = 'neutral', children }: BadgeProps) {
  // Mantine 루트는 width:fit-content + overflow:hidden — 좁은 칸(예: grow 열 옆 표 셀)에서 자기 내용보다 작게 줄며 잘린다.
  //  min-width:max-content로 *내용폭 밑으로는 안 줄게* 한다(상태 배지는 짧아 항상 전체 노출이 맞음 → 표가 열 min-content를 제대로 계산).
  return <MantineBadge color={color} variant="light" radius="sm" style={{ minWidth: 'max-content' }}>{children}</MantineBadge>;
}
