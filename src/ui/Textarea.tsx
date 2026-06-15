import { Textarea as M } from '@mantine/core';
import { fieldBorder } from './_fieldStyles';
type Props = {
  size?: 'sm' | 'md'; disabled?: boolean; placeholder?: string; autosize?: boolean;
  value: string; onChange: (value: string) => void; name?: string;
};
export function Textarea({ size = 'md', disabled, placeholder, autosize, value, onChange, name }: Props) {
  return (
    <M size={size} disabled={disabled} placeholder={placeholder} autosize={autosize} value={value} name={name}
      onChange={(e) => onChange(e.currentTarget.value)} radius="sm" styles={{ input: fieldBorder }} />
  );
}
