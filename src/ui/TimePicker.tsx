'use client';
// TimePicker 원자 — 시각 입력(HH:MM). 날짜=DatePicker, 날짜범위=DateRangeField와 별개 축.
//  · @mantine/dates TimeInput 격리 래핑. value 문자열 "HH:MM". fieldBorder 공유.
import { TimeInput } from '@mantine/dates';
import { fieldBorder } from './_fieldStyles';
type Props = { value: string; onChange: (value: string) => void; size?: 'sm' | 'md'; disabled?: boolean; name?: string };
export function TimePicker({ value, onChange, size = 'md', disabled, name }: Props) {
  return (
    <TimeInput value={value} onChange={(e) => onChange(e.currentTarget.value)}
      size={size} disabled={disabled} name={name} radius="sm" styles={{ input: fieldBorder }} />
  );
}
