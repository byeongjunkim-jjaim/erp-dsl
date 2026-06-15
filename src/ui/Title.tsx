// Title 원자 — 제목 3단계(display/heading/subheading). 색은 text.primary 고정(검정/흰색 자동).
import type { ReactNode, CSSProperties } from 'react';

type TitleVariant = 'display' | 'heading' | 'subheading';
const ORDER: Record<TitleVariant, 1 | 2 | 3> = { display: 1, heading: 2, subheading: 3 };

type TitleProps = {
  variant?: TitleVariant;
  children: ReactNode;
};

export function Title({ variant = 'heading', children }: TitleProps) {
  const order = ORDER[variant];
  const style: CSSProperties = {
    fontSize: `var(--typo-${variant}-size)`,
    fontWeight: `var(--typo-${variant}-weight)` as unknown as number,
    lineHeight: `var(--typo-${variant}-lh)`,
    color: 'var(--text-primary)', // 고정 — 제목 색은 거의 항상 기본
    margin: 0,
  };
  const Tag = (`h${order}`) as 'h1' | 'h2' | 'h3';
  return <Tag style={style}>{children}</Tag>;
}
