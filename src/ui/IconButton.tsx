'use client';
// IconButton (분자) — Button을 "아이콘 전용"으로 고정한 named 분자(01 4-C가 예고한 아이콘형).
// 접근성: aria-label 필수(텍스트가 없으므로). 정사각. 행 액션의 "윤곽 없는 빨강 삭제" 등에 사용.
import { ActionIcon } from '@mantine/core';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Props = {
  icon: IconName;
  label: string;            // aria-label(필수) — 아이콘만이라 의미를 텍스트로 보존
  variant?: Variant;
  size?: 'sm' | 'md';
  disabled?: boolean;
  onClick?: () => void;
};

// variant → (ActionIcon 외형, Icon 색 역할). danger=윤곽 없는 빨강(subtle).
const MAP: Record<Variant, { mv: string; color: 'primary' | 'secondary' | 'danger' }> = {
  primary:   { mv: 'filled',  color: 'primary' },
  secondary: { mv: 'default', color: 'primary' },
  danger:    { mv: 'subtle',  color: 'danger' },
  ghost:     { mv: 'subtle',  color: 'secondary' },
};

export function IconButton({ icon, label, variant = 'ghost', size = 'md', disabled, onClick }: Props) {
  const m = MAP[variant];
  return (
    <ActionIcon aria-label={label} variant={m.mv} size={size === 'sm' ? 'md' : 'lg'}
      color="neutral" disabled={disabled} onClick={onClick} radius="sm">
      <Icon name={icon} size={size} color={m.color} />
    </ActionIcon>
  );
}
