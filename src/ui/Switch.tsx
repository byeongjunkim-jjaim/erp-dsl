// Switch 원자 — on/off 한 개. 인라인 라벨 유지. controlled. size 고정.
import { Switch as M } from '@mantine/core';
type Props = {
  label?: string; checked: boolean; onChange: (checked: boolean) => void;
  disabled?: boolean; value?: string; name?: string;
};
export function Switch({ label, checked, onChange, disabled, value, name }: Props) {
  return (
    <M label={label} checked={checked} disabled={disabled} value={value} name={name}
      onChange={(e) => onChange(e.currentTarget.checked)} color="primary" radius="full" withThumbIndicator={false}
      classNames={{ track: 'erpHitTarget' }} />
  );
}
