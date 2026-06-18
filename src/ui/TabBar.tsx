// TabBar 원자 — 다른 구획으로 전환하는 트리거(대상이 바뀜). 활성 키만 안다(패널 전환은 밖).
//  · count: 그 탭의 미처리 건수(행동요구). CountBadge로 라벨 우측에 — "어느 탭에 가도 보이는" 주의 층위.
//    행동요구만 빨강(기본), 정보성 카운트는 countTone="neutral". 0이면 안 보임(CountBadge가 처리).
import { Tabs } from '@mantine/core';
import { CountBadge } from './CountBadge';

type Option = { label: string; value: string; count?: number; countTone?: 'danger' | 'neutral' };
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
          <Tabs.Tab key={o.value} value={o.value} disabled={disabled}
            rightSection={o.count != null && o.count > 0 ? <CountBadge count={o.count} tone={o.countTone ?? 'danger'} /> : undefined}>
            {o.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
