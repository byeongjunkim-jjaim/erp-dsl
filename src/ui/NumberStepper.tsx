'use client';
// NumberStepper (분자) — 수량 − [n] + 스테퍼. NumberInput을 "증감 노출 + 타이핑"으로 고정한 형제.
//  · NumberInput은 스텝퍼를 *끄는 것*이 정체성(타이핑 본질, 작은 타깃·경쟁 경로 회피 — 03 §11-3).
//    NumberInput.tsx 주석이 "좁은-범위 증감은 별도 named 부품으로"라고 예고한 그 부품이다(이름은 Stepper가
//    다단계-진행 유기체로 선점돼 NumberStepper). CurrencyInput이 NumberInput을 ₩로 고정한 것과 동형의 named 분자
//    (경쟁 경로 아님 — 수치 입력 vs 수량 선택).
//  · 가운데는 타이핑 가능(B2B 큰 수량 — 시장 조사: 순수 +/−만으론 부족, 타이핑 가능 스테퍼가 정석).
//  · min/max는 "검증의 진실"(스키마)이 아니라 증감 버튼의 *동작 경계*(UI). 폼 값 검증은 여전히 스키마.
import { NumberInput as M, UnstyledButton } from '@mantine/core';
import { Icon } from './Icon';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;   // 증감 하한(기본 0 — 수량은 음수 불가)
  max?: number;   // 증감 상한(선택)
  step?: number;  // 증감 단위(기본 1)
  size?: 'sm' | 'md';
  disabled?: boolean;
  name?: string;
};

export function NumberStepper({ value, onChange, min = 0, max, step = 1, size = 'md', disabled, name }: Props) {
  const clamp = (n: number) => {
    let v = Number.isFinite(n) ? n : min;
    if (v < min) v = min;
    if (max !== undefined && v > max) v = max;
    return v;
  };
  return (
    <div className={`erpNumStepper erpNumStepper-${size}`} data-disabled={disabled || undefined}>
      <UnstyledButton
        className="erpNumStepperBtn" type="button" aria-label="감소"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - step))}
      >
        <Icon name="minus" size="sm" />
      </UnstyledButton>
      <M
        className="erpNumStepperInput" variant="unstyled" size={size}
        value={value} name={name} disabled={disabled}
        min={min} max={max} step={step}
        hideControls allowDecimal={false} allowNegative={min < 0} clampBehavior="strict"
        onChange={(v) => onChange(clamp(typeof v === 'number' ? v : Number.parseInt(String(v), 10) || min))}
      />
      <UnstyledButton
        className="erpNumStepperBtn" type="button" aria-label="증가"
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={() => onChange(clamp(value + step))}
      >
        <Icon name="plus" size="sm" />
      </UnstyledButton>
    </div>
  );
}
