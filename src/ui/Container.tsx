// Container 레이아웃 원자 — 콘텐츠 폭의 천장 + 가운데 정렬. 폭에 관여하는 유일한 닫힌 값.
import { Container as M } from '@mantine/core';
import type { ReactNode } from 'react';
type MaxWidth = 'narrow' | 'default' | 'wide';
// px는 화면 검증에서 조정할 잠정값.
const SIZE: Record<MaxWidth, number> = { narrow: 600, default: 1000, wide: 1400 };
type Props = { maxWidth?: MaxWidth; children: ReactNode };
export function Container({ maxWidth = 'default', children }: Props) {
  return <M size={SIZE[maxWidth]}>{children}</M>;
}
