// Icon 원자 — SVG로 그린다(유니코드 글리프 금지). 색은 currentColor(텍스트 역할 통로).
// --icon-baseline-shift(-0.125em) 내장 → 텍스트와 나란히 놓일 때 광학 중심 자동 정렬.
// 아이콘 세트는 시스템 밖에서 사람이 큐레이션으로 늘린다(헌법 4).

import type { CSSProperties } from 'react';

export type IconName =
  | 'check' | 'x' | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right'
  | 'search' | 'plus' | 'minus' | 'calendar' | 'upload' | 'trash' | 'refresh'
  | 'eye' | 'eye-off' | 'alert-circle' | 'alert-triangle' | 'info' | 'dots' | 'edit' | 'arrow-left' | 'filter';

// 24x24 viewBox, stroke=currentColor 기반(outline). path만 정의(색·정렬은 래퍼가).
const PATHS: Record<IconName, string> = {
  'check': 'M5 12l5 5L20 7',
  'x': 'M6 6l12 12M18 6L6 18',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-up': 'M6 15l6-6 6 6',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  'search': 'M11 3a8 8 0 100 16 8 8 0 100-16M21 21l-4.3-4.3',
  'plus': 'M12 5v14M5 12h14',
  'minus': 'M5 12h14',
  'calendar': 'M5 5h14v15H5zM8 3v4M16 3v4M5 10h14',
  'upload': 'M12 16V4M7 9l5-5 5 5M5 20h14',
  'trash': 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  'refresh': 'M21 12a9 9 0 11-9-9 9.75 9.75 0 016.74 2.74L21 8M21 3v5h-5',
  'eye': 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6',
  'eye-off': 'M3 3l18 18M10 6a9 9 0 0111 6 11 11 0 01-2 3M6 6a11 11 0 00-4 6s4 7 10 7a9 9 0 004-1',
  'alert-circle': 'M12 3a9 9 0 100 18 9 9 0 000-18M12 8v5M12 16h.01',
  'alert-triangle': 'M12 4L2 20h20zM12 10v4M12 17h.01',
  'info': 'M12 3a9 9 0 100 18 9 9 0 000-18M12 11v5M12 8h.01',
  'dots': 'M5 12h.01M12 12h.01M19 12h.01',
  'edit': 'M4 20h4L18.5 9.5a2.12 2.12 0 00-3-3L5 17v3M13.5 6.5l3 3',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  'filter': 'M3 5h18l-7 8v6l-4-2v-4z',
};

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = { sm: 16, md: 20, lg: 24 };
const COLOR_VAR: Record<'primary' | 'secondary' | 'danger', string> = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  danger: 'var(--text-danger)',
};

type IconProps = {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  // 색을 안 주면 currentColor(부모 텍스트색)를 따른다 — 버튼/칩 안 아이콘용
  color?: 'primary' | 'secondary' | 'danger';
};

export function Icon({ name, size = 'md', color }: IconProps) {
  const px = SIZE_PX[size];
  const style: CSSProperties = {
    verticalAlign: 'var(--icon-baseline-shift)', // 광학 정렬 보정(토큰)
    color: color ? COLOR_VAR[color] : undefined,
    flexShrink: 0,
  };
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
