import { TextInput as M } from '@mantine/core';
import { fieldBorder } from './_fieldStyles';
type Props = {
  size?: 'sm' | 'md'; disabled?: boolean; placeholder?: string;
  value: string; onChange: (value: string) => void; name?: string;
};
export function TextInput({ size = 'md', disabled, placeholder, value, onChange, name }: Props) {
  return (
    <M size={size} disabled={disabled} placeholder={placeholder} value={value} name={name}
      onChange={(e) => onChange(e.currentTarget.value)} radius="sm" styles={{ input: fieldBorder }} />
  );
}
