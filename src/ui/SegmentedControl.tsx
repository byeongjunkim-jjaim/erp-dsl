// SegmentedControl 원자 — 같은 대상의 뷰/모드 토글(즉시 전환, 비제출). controlled.
import { SegmentedControl as MantineSegmented } from '@mantine/core';

type Option = { label: string; value: string };
type SegmentedControlProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  disabled?: boolean;
};

export function SegmentedControl({
  options, value, onChange, size = 'md', fullWidth = false, disabled = false,
}: SegmentedControlProps) {
  return (
    <MantineSegmented
      data={options}
      value={value}
      onChange={onChange}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      radius="sm"
    />
  );
}
