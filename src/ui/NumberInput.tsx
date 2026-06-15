import { NumberInput as M } from '@mantine/core';
import { fieldBorder } from './_fieldStyles';
type Props = {
  size?: 'sm' | 'md'; disabled?: boolean; placeholder?: string;
  value: number | string; onChange: (value: number | string) => void; name?: string;
};
export function NumberInput({ size = 'md', disabled, placeholder, value, onChange, name }: Props) {
  return (
    <M size={size} disabled={disabled} placeholder={placeholder} value={value} name={name}
      onChange={onChange} radius="sm" styles={{ input: fieldBorder }} />
  );
}
