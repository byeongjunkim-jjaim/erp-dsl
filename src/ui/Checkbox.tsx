// Checkbox 원자 — 인라인 라벨 유지(컨트롤과 한 몸). controlled. size 고정.
import { Checkbox as M } from '@mantine/core';
type Props = {
  label?: string; checked: boolean; onChange: (checked: boolean) => void;
  disabled?: boolean; value?: string; name?: string;
};
export function Checkbox({ label, checked, onChange, disabled, value, name }: Props) {
  return (
    <M label={label} checked={checked} disabled={disabled} value={value} name={name}
      onChange={(e) => onChange(e.currentTarget.checked)} color="primary" />
  );
}
