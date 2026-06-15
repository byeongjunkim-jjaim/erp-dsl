// Grid 프리미티브 — 격자(비율 분할). columns는 12의 약수만. 자식 span은 Grid.Col이 받음.
//  equalRows=true: Mantine flex-wrap 대신 CSS grid(grid-auto-rows:1fr)로 모든 행을 동일 높이로.
//   이때 자식은 카드를 직접 배치(Grid.Col 불필요). 비대칭 span은 기본(Mantine) 모드에서 Grid.Col로.
import { Grid as M } from '@mantine/core';
import type { ReactNode } from 'react';
type Columns = 1 | 2 | 3 | 4 | 6 | 12;
type Gap = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type GridProps = { columns?: Columns; gap?: Gap; equalRows?: boolean; children: ReactNode };
type ColProps = { span?: number; children: ReactNode }; // 1~12

function Grid({ columns = 12, gap = 'md', equalRows = false, children }: GridProps) {
  if (equalRows) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: '1fr',
        gap: `var(--mantine-spacing-${gap})`,
      }}>
        {children}
      </div>
    );
  }
  return <M columns={columns} gutter={gap}>{children}</M>;
}
function Col({ span = 1, children }: ColProps) {
  return <M.Col span={span}>{children}</M.Col>;
}
Grid.Col = Col;
export { Grid };
