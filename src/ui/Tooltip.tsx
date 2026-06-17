// Tooltip 원자 — 설명 텍스트로 감쌀 대상을 감싼다. 위치 자동(고정).
import { Tooltip as MantineTooltip } from '@mantine/core';
import type { ReactNode } from 'react';

type TooltipProps = { label: string; children: ReactNode };

export function Tooltip({ label, children }: TooltipProps) {
  // Mantine Tooltip은 트리거에 ref+hover 이벤트를 주입한다. 우리 래퍼 부품은 ref/prop을 전달하지
  // 않으므로(닫힌 경계), 실제 DOM 노드(span)를 트리거로 삼아야 hover가 붙는다. inline-flex라 레이아웃 무영향.
  return (
    <MantineTooltip label={label} withArrow>
      <span style={{ display: 'inline-flex' }}>{children}</span>
    </MantineTooltip>
  );
}
