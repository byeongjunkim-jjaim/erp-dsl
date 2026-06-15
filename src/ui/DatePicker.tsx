// DatePicker 원자 — 단일 날짜. controlled. 범위·다중·min/max는 분자/스키마로.
import { DatePickerInput as M } from '@mantine/dates';
import { fieldBorder } from './_fieldStyles';
type Props = {
  value: string | null; onChange: (value: string | null) => void;
  placeholder?: string; disabled?: boolean; size?: 'sm' | 'md'; name?: string;
};
export function DatePicker({ value, onChange, placeholder, disabled, size = 'md', name }: Props) {
  return (
    <M value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      size={size} name={name} radius="sm" styles={{ input: fieldBorder }} />
  );
}
