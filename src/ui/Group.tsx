// Group 프리미티브 — 가로 배열. align 기본 center(자주 누락되는 세로중앙을 기본값으로 차단).
import { Group as M } from '@mantine/core';
import type { ReactNode } from 'react';
type Gap = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type Props = {
  gap?: Gap; align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between'; wrap?: boolean; children: ReactNode;
};
const AL = { start: 'flex-start', center: 'center', end: 'flex-end' } as const;
const JU = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' } as const;
export function Group({ gap = 'md', align = 'center', justify = 'start', wrap = false, children }: Props) {
  return <M gap={gap} align={AL[align]} justify={JU[justify]} wrap={wrap ? 'wrap' : 'nowrap'}>{children}</M>;
}
