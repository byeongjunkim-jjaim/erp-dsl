// Text 원자 — 본문 3단계(body/body-strong/caption). 타이포·색 전부 역할 변수 통로.
import type { ReactNode, CSSProperties } from 'react';

type TextVariant = 'body' | 'body-strong' | 'caption';
type TextColor = 'primary' | 'secondary' | 'danger';

type TextProps = {
  variant?: TextVariant;
  color?: TextColor;
  children: ReactNode;
};

export function Text({ variant = 'body', color = 'primary', children }: TextProps) {
  const style: CSSProperties = {
    fontSize: `var(--typo-${variant}-size)`,
    fontWeight: `var(--typo-${variant}-weight)` as unknown as number,
    lineHeight: `var(--typo-${variant}-lh)`,
    color: `var(--text-${color})`,
    margin: 0,
  };
  return <span style={style}>{children}</span>;
}
