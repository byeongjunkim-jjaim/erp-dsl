'use client';
// MultiSelect 분자 — Select + Chip 결합(내부 조립형, children 아님). value 배열.
// 고정: 고른 값을 Chip(neutral 고정)으로 표시 / Chip onRemove 항상 켬 /
//       항목 선택 시 드롭다운 유지(닫지 않음) / 드롭다운 체크 = Icon(SVG+baseline).
import { Combobox, useCombobox, PillsInput, Pill, Group as MGroup } from '@mantine/core';
import { Chip } from './Chip';
import { Icon } from './Icon';
import { fieldBorder } from './_fieldStyles';

type Option = { label: string; value: string };
type Props = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  name?: string;
};

export function MultiSelect({ options, value, onChange, placeholder, disabled, size = 'md', name }: Props) {
  const combobox = useCombobox();

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const remove = (v: string) => onChange(value.filter((x) => x !== v));

  return (
    <Combobox store={combobox} onOptionSubmit={toggle} disabled={disabled}>
      <Combobox.DropdownTarget>
        <PillsInput size={size} disabled={disabled} onClick={() => combobox.openDropdown()}
          styles={{ input: fieldBorder }}>
          <Pill.Group>
            {value.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <Chip key={v} color="neutral" selected onRemove={() => remove(v)}>
                  {opt?.label ?? v}
                </Chip>
              );
            })}
            <Combobox.EventsTarget>
              <PillsInput.Field
                name={name}
                placeholder={value.length ? undefined : placeholder}
                onFocus={() => combobox.openDropdown()}
                readOnly
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>
      <Combobox.Dropdown>
        <Combobox.Options>
          {options.map((o) => (
            <Combobox.Option value={o.value} key={o.value} active={value.includes(o.value)}>
              <MGroup gap="xs" align="center" wrap="nowrap">
                {value.includes(o.value) && <Icon name="check" size="sm" />}
                <span>{o.label}</span>
              </MGroup>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
