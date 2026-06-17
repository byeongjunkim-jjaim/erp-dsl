'use client';
// PageGrid (템플릿) — 페이지 공간을 닫힌 격자로. 위젯(템플릿·유기체)이 정수 칸을 점유한다.
//  · 창립 은유의 공간판(00 설계원리: iOS 홈 화면 = 유한한 틀 안의 선택) / 베이스 패턴 = Bento grid.
//  · **Bento의 본질 = 가변 높이 불허.** 셀 높이는 고정(ROW_UNIT)이고, 위젯은 자기 본성에 맞는 닫힌 n×n footprint를
//    colSpan·rowSpan으로 *선택*한다. 그 선택만이 가변이며, 그 이상의 높이 가변은 템플릿 층에 존재하지 않는다.
//  · 내용이 footprint를 넘치면 위젯이 *내부에서* 처리(스크롤/요약) — Tile은 overflow:hidden으로 셀을 고정한다.
//  · 모바일 1열 스택·드래그 재배치는 후속(작게 시작). raw CSS grid는 Calendar 7열과 동류의 명시 예외.
import type { ReactNode } from 'react';

type Columns = 2 | 3 | 4 | 6 | 12;
type Gap = 'sm' | 'md' | 'lg';
type GridProps = { columns?: Columns; gap?: Gap; children: ReactNode };
type TileProps = { colSpan?: number; rowSpan?: 1 | 2 | 3; children: ReactNode };

const ROW_UNIT = 140; // 셀 한 칸 높이(px, 잠정 — 화면 검증 후 조정). 고정이라 내용으로 늘지 않는다.

function PageGrid({ columns = 12, gap = 'lg', children }: GridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gridAutoRows: `${ROW_UNIT}px`,   // 고정 셀 — 가변 높이 불허(Bento 본질)
      gap: `var(--mantine-spacing-${gap})`,
    }}>
      {children}
    </div>
  );
}

// Tile은 footprint를 고정한다(overflow:hidden) — 내용이 넘치면 위젯이 내부에서 스크롤/요약.
function Tile({ colSpan = 1, rowSpan = 1, children }: TileProps) {
  return <div style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}`, minWidth: 0, minHeight: 0, overflow: 'hidden' }}>{children}</div>;
}

PageGrid.Tile = Tile;
export { PageGrid };
