// Select 원자 — 단일 선택. options는 {label,value}[]로 입구 통일. searchable 고정(끔).
import { Select as M } from '@mantine/core';
import { fieldBorder } from './_fieldStyles';
type Option = { label: string; value: string };
type Props = {
  options: Option[]; value: string | null; onChange: (value: string | null) => void;
  placeholder?: string; disabled?: boolean; size?: 'sm' | 'md'; name?: string;
};
export function Select({ options, value, onChange, placeholder, disabled, size = 'md', name }: Props) {
  return (
    <M data={options} value={value} onChange={onChange} placeholder={placeholder}
      disabled={disabled} size={size} name={name} searchable={false} radius="sm"
      styles={{ input: fieldBorder }} />
  );
}
