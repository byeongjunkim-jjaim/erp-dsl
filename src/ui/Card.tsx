// Card 레이아웃 원자 — 그릇. variant로 elevated/outlined/flat 닫음. padding 토큰. 자식 받음.
import { Paper } from '@mantine/core';
import type { ReactNode } from 'react';
type CardVariant = 'elevated' | 'outlined' | 'flat';
const V: Record<CardVariant, { withBorder: boolean; shadow?: 'sm' | 'md' }> = {
  elevated: { withBorder: false, shadow: 'md' },
  outlined: { withBorder: true },
  flat: { withBorder: false },
};
type CardProps = { variant?: CardVariant; padding?: 'none' | 'sm' | 'md' | 'lg'; fill?: boolean; children: ReactNode };
export function Card({ variant = 'outlined', padding = 'md', fill = false, children }: CardProps) {
  const v = V[variant];
  return (
    <Paper withBorder={v.withBorder} shadow={v.shadow} p={padding === 'none' ? 0 : padding} radius="md"
      bg="var(--bg-primary)" style={{ borderColor: 'var(--border-default)', overflow: 'hidden', ...(fill ? { height: '100%' } : {}) }}>
      {children}
    </Paper>
  );
}
