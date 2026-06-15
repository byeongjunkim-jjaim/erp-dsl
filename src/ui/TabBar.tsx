// TabBar 원자 — 다른 구획으로 전환하는 트리거(대상이 바뀜). 활성 키만 안다(패널 전환은 밖).
import { Tabs } from '@mantine/core';

type Option = { label: string; value: string };
type TabBarProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function TabBar({ options, value, onChange, disabled = false }: TabBarProps) {
  return (
    <Tabs value={value} onChange={(v) => v && onChange(v)} variant="default">
      <Tabs.List>
        {options.map((o) => (
          <Tabs.Tab key={o.value} value={o.value} disabled={disabled}>
            {o.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
