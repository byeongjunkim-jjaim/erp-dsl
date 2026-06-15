// Tooltip 원자 — 설명 텍스트로 감쌀 대상을 감싼다. 위치 자동(고정).
import { Tooltip as MantineTooltip } from '@mantine/core';
import type { ReactNode } from 'react';

type TooltipProps = { label: string; children: ReactNode };

export function Tooltip({ label, children }: TooltipProps) {
  return <MantineTooltip label={label} withArrow>{children}</MantineTooltip>;
}
