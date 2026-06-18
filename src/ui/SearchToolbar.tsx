'use client';
// SearchToolbar (분자) — 목록 상단 띠: 검색 + 필터 + 활성 필터칩. ListPage의 '죽은 필터 버튼'을 정식화.
//  · controlled: searchValue + filters[](각자 controlled). 활성 필터는 Chip으로 노출(클릭/X로 해제).
//  · 닫힌 조립(Group + InputGroup/TextInput + Select + Chip). 임의 JSX 주입 없음.
import { Group } from './Group';
import { TextInput } from './TextInput';
import { Select } from './Select';
import { Chip } from './Chip';
import { Icon } from './Icon';
import { InputGroup } from './InputGroup';

type Filter = {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
};
type Props = {
  searchValue: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters?: Filter[];
};
export function SearchToolbar({ searchValue, onSearchChange, searchPlaceholder = '검색', filters = [] }: Props) {
  const active = filters.filter((f) => f.value != null && f.value !== '');
  const optLabel = (f: Filter) => f.options.find((o) => o.value === f.value)?.label ?? f.value;
  return (
    <Group gap="sm" align="center" wrap>
      <div style={{ minWidth: 220, flex: 1 }}>
        <InputGroup leftAddon={<Icon name="search" size="sm" />}>
          <TextInput value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
        </InputGroup>
      </div>
      {filters.map((f) => (
        <div key={f.key} style={{ minWidth: 160 }}>
          <Select options={f.options} value={f.value} onChange={f.onChange} placeholder={f.label} />
        </div>
      ))}
      {active.map((f) => (
        <Chip key={f.key} color="info" selected onChange={() => f.onChange(null)} onRemove={() => f.onChange(null)}>
          {`${f.label}: ${optLabel(f)}`}
        </Chip>
      ))}
    </Group>
  );
}
