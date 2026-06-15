// MultiDatePicker 원자 — 여러 개의 *개별* 날짜를 한 입력칸에서 고른다(집합 = string[]).
// DatePicker의 형제 원자다: 화면상 "날짜 입력 한 칸"으로 더 쪼갤 수 없고(원자),
// 받는 데이터만 다르다(단일 Date vs Date 배열 — TextInput/NumberInput을 데이터로 가른 논리와 동일).
// 연속 범위(start~end)는 의미가 달라 DateRangeField 분자가 담당한다(경쟁 경로 아님).
// 경계 닫기는 DatePicker와 동일: label/description/required → FormField, radius·variant 래퍼 고정,
// min/max → 스키마, className/style → 규칙 3.
import { DatePickerInput as M } from '@mantine/dates';
import { fieldBorder } from './_fieldStyles';
type Props = {
  value: string[]; onChange: (value: string[]) => void;
  placeholder?: string; disabled?: boolean; size?: 'sm' | 'md'; name?: string;
};
export function MultiDatePicker({ value, onChange, placeholder, disabled, size = 'md', name }: Props) {
  return (
    <M type="multiple" value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      size={size} name={name} radius="sm" styles={{ input: fieldBorder }} />
  );
}
