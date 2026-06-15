// Divider 레이아웃 원자 — 선. 색·굵기 고정(보더 토큰 1px, neutral 참조).
import { Divider as M } from '@mantine/core';
type Props = { orientation?: 'horizontal' | 'vertical' };
export function Divider({ orientation = 'horizontal' }: Props) {
  return <M orientation={orientation} color="var(--border-default)" />;
}
