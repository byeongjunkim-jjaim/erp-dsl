// DateRangeField 분자 — DatePicker 둘 + 가운데 ~. 내부 조립형. value={start,end} 객체.
// 검증 진실은 스키마(끝≥시작) — 분자는 자체 판정하지 않는다. "시작만 있음"은 유효 중간상태.
import { Group } from './Group';
import { Text } from './Text';
import { DatePicker } from './DatePicker';

type RangeValue = { start: string | null; end: string | null };
type Props = {
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  name?: string;
};

export function DateRangeField({
  value, onChange, startPlaceholder, endPlaceholder, disabled, size = 'md', name,
}: Props) {
  return (
    <Group gap="xs" align="center">
      <DatePicker
        value={value.start}
        onChange={(start) => onChange({ ...value, start })}
        placeholder={startPlaceholder}
        disabled={disabled}
        size={size}
        name={name ? `${name}-start` : undefined}
      />
      <Text variant="body" color="secondary">~</Text>
      <DatePicker
        value={value.end}
        onChange={(end) => onChange({ ...value, end })}
        placeholder={endPlaceholder}
        disabled={disabled}
        size={size}
        name={name ? `${name}-end` : undefined}
      />
    </Group>
  );
}
