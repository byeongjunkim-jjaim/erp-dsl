'use client';
// Stepper (유기체) — 다단계 진행 표시(번호/체크 노드 + 커넥터 + 라벨). 등록 마법사·온보딩.
//  · controlled: active(현재 단계 index). 단계 콘텐츠는 호출측이 active로 분기(Stepper는 진행 표시만).
//  · Mantine Stepper 격리 래핑. 색 primary 고정.
import { Stepper as M } from '@mantine/core';
type Step = { label: string; description?: string };
type Props = { active: number; steps: Step[]; orientation?: 'horizontal' | 'vertical'; onStepClick?: (index: number) => void };
export function Stepper({ active, steps, orientation = 'horizontal', onStepClick }: Props) {
  return (
    <M active={active} onStepClick={onStepClick} orientation={orientation} color="primary" size="sm">
      {steps.map((s, i) => <M.Step key={i} label={s.label} description={s.description} />)}
    </M>
  );
}
