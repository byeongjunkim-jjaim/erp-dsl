import { Button as MantineButton } from '@mantine/core';
import type { ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────
// 우리 라이브러리의 Button. (C++ 의 안전한 문법에 해당)
//
// 바깥 세계가 보는 것은 아래 ButtonProps 뿐이다.
// color / radius / px / className / style 같은 "열린 문"은 노출하지 않는다.
// → 임의 색·임의 크기·임의 스타일을 넣을 길 자체가 없다.
//
// 핵심: 이 Props는 우리가 손으로 쓴 순수 타입이라 (string & {}) 탈출구가 없다.
//       그래서 variant="rainbow" 는 진짜 컴파일 에러가 난다. (그물 1)
//       Mantine 타입을 상속(extends)하지 않는 게 의도다 — 상속하면 열린 타입이 딸려온다.
// ─────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
};

// variant → 실제 스타일 매핑. 이 "정책"을 우리가 100% 소유한다.
// 색은 hex가 아니라 토큰 역할 이름만 쓴다 (theme.ts가 실제 색을 답한다).
const VARIANT: Record<ButtonVariant, { color: string; mantineVariant: string }> = {
  primary:   { color: 'primary', mantineVariant: 'filled' },
  secondary: { color: 'neutral', mantineVariant: 'default' },
  danger:    { color: 'danger',  mantineVariant: 'filled' },
  ghost:     { color: 'neutral', mantineVariant: 'subtle' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
}: ButtonProps) {
  const policy = VARIANT[variant];

  // 이 파일 안에서는 Mantine의 열린 API를 직접 만져도 된다.
  // 닫힘은 "이 파일 안"이 아니라 "이 파일이 바깥에 노출하는 경계(ButtonProps)"에서 일어난다.
  return (
    <MantineButton
      color={policy.color}
      variant={policy.mantineVariant}
      size={size}
      radius="sm"        // radius는 정책으로 고정. 바깥에서 못 바꾼다.
      leftSection={leftIcon}
      rightSection={rightIcon}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
    >
      {children}
    </MantineButton>
  );
}
