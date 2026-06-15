// Label 원자 — "무언가의 이름표". 타이포 body-strong 고정(입력값과 동급 위계), text.primary 고정.
import type { ReactNode, CSSProperties } from 'react';

type LabelProps = {
  children: ReactNode;
  htmlFor?: string; // 짝 연결 배선
};

export function Label({ children, htmlFor }: LabelProps) {
  const style: CSSProperties = {
    fontSize: 'var(--typo-body-strong-size)',
    fontWeight: 'var(--typo-body-strong-weight)' as unknown as number,
    lineHeight: 'var(--typo-body-strong-lh)',
    color: 'var(--text-primary)',
  };
  return <label htmlFor={htmlFor} style={style}>{children}</label>;
}
