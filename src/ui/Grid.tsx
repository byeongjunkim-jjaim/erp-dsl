// Grid 프리미티브 — 격자(비율 분할). columns는 12의 약수만. 자식 span은 Grid.Col이 받음.
import { Grid as M } from '@mantine/core';
import type { ReactNode } from 'react';
type Columns = 1 | 2 | 3 | 4 | 6 | 12;
type Gap = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type GridProps = { columns?: Columns; gap?: Gap; children: ReactNode };
type ColProps = { span?: number; children: ReactNode }; // 1~12

function Grid({ columns = 12, gap = 'md', children }: GridProps) {
  return <M columns={columns} gutter={gap}>{children}</M>;
}
function Col({ span = 1, children }: ColProps) {
  return <M.Col span={span}>{children}</M.Col>;
}
Grid.Col = Col;
export { Grid };
