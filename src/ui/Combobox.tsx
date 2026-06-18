'use client';
// Combobox 원자 — 검색되는 단일 선택(Select의 searchable 형제). 대용량 옵션을 타이핑으로 필터.
//  · 경계: Select=옵션 펼쳐 고름 / Combobox=옵션 많아 검색이 필요할 때. 둘 다 닫힌 {label,value}[] 입구.
//  · Mantine Select(searchable) 격리 래핑. fieldBorder 통로 공유(Select와 동일 — 에러 시 FormField가 덮음).
import { Select as M } from '@mantine/core';
import { fieldBorder } from './_fieldStyles';
type Option = { label: string; value: string };
type Props = {
  options: Option[]; value: string | null; onChange: (value: string | null) => void;
  placeholder?: string; disabled?: boolean; size?: 'sm' | 'md'; name?: string; clearable?: boolean;
};
export function Combobox({ options, value, onChange, placeholder, disabled, size = 'md', name, clearable = true }: Props) {
  return (
    <M data={options} value={value} onChange={onChange} placeholder={placeholder}
      disabled={disabled} size={size} name={name} searchable clearable={clearable}
      nothingFoundMessage="결과 없음" radius="sm" styles={{ input: fieldBorder }} />
  );
}
