// Stack 프리미티브 — 세로 배열. gap=토큰. align 기본 stretch, justify 기본 start.
import { Stack as M } from '@mantine/core';
import type { ReactNode } from 'react';
type Gap = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type Props = {
  gap?: Gap; align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between'; children: ReactNode;
};
const AL = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' } as const;
const JU = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' } as const;
export function Stack({ gap = 'md', align = 'stretch', justify = 'start', children }: Props) {
  return <M gap={gap} align={AL[align]} justify={JU[justify]}>{children}</M>;
}
