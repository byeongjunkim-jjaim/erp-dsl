'use client';
// Transfer (유기체) — 좌(선택가능)·우(선택됨) 듀얼 리스트 + 이동 버튼. 권한·항목 대량 배정.
//  · controlled: selected(우측에 담긴 value들). 나머지는 좌측. MultiSelect(인라인 태그 다중)와 독립.
//  · 두 카드 = 동일 높이(더 큰 쪽 기준 동적) + 폭 100% 충전. 헤더·본문 동일 패딩(sm)으로 좌측 인셋 정렬.
//    (래퍼는 flex column → Card가 가로·세로 모두 충전. outer alignItems=stretch로 높이 균등.)
//  · Mantine Transfer 없음 → 우리 프리미티브 조립.
import { useState } from 'react';
import { Stack } from './Stack';
import { Card } from './Card';
import { Text } from './Text';
import { Divider } from './Divider';
import { Checkbox } from './Checkbox';
import { IconButton } from './IconButton';

type Item = { value: string; label: string };
type Props = {
  items: Item[];
  selected: string[];
  onChange: (selected: string[]) => void;
  titles?: [string, string];
};
export function Transfer({ items, selected, onChange, titles = ['선택 가능', '선택됨'] }: Props) {
  const sel = new Set(selected);
  const source = items.filter((i) => !sel.has(i.value));
  const target = items.filter((i) => sel.has(i.value));
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (v: string) => setChecked((c) => { const n = new Set(c); if (n.has(v)) n.delete(v); else n.add(v); return n; });
  const moveRight = () => { const add = source.filter((i) => checked.has(i.value)).map((i) => i.value); onChange([...selected, ...add]); setChecked(new Set()); };
  const moveLeft = () => { const rm = new Set(target.filter((i) => checked.has(i.value)).map((i) => i.value)); onChange(selected.filter((v) => !rm.has(v))); setChecked(new Set()); };

  const list = (title: string, rows: Item[]) => (
    <Card variant="outlined" padding="none" fill>
      {/* 헤더·본문 동일 패딩(sm) → 헤더 텍스트와 항목 행이 같은 좌측 인셋에서 정렬. */}
      <div style={{ padding: 'var(--mantine-spacing-sm)' }}>
        <Text variant="body-strong">{title}</Text>
      </div>
      <Divider />
      <div style={{ padding: 'var(--mantine-spacing-sm)' }}>
        {rows.length === 0 ? (
          <div style={{ padding: 'var(--mantine-spacing-md)', textAlign: 'center' }}>
            <Text variant="caption" color="secondary">비어 있음</Text>
          </div>
        ) : (
          <Stack gap="xs">
            {rows.map((i) => <Checkbox key={i.value} label={i.label} checked={checked.has(i.value)} onChange={() => toggle(i.value)} />)}
          </Stack>
        )}
      </div>
    </Card>
  );

  return (
    <div style={{ display: 'flex', gap: 'var(--mantine-spacing-md)', alignItems: 'stretch' }}>
      {/* 래퍼 flex column → Card가 폭 100%·높이 100% 충전(가로 row였을 때 폭을 안 채우던 문제 해소). */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{list(titles[0], source)}</div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
        <Stack gap="xxs">
          <IconButton icon="chevron-right" label="선택됨으로" variant="secondary" size="sm" onClick={moveRight} />
          <IconButton icon="chevron-left" label="선택가능으로" variant="secondary" size="sm" onClick={moveLeft} />
        </Stack>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{list(titles[1], target)}</div>
    </div>
  );
}
