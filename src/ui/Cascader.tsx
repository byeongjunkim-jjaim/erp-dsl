'use client';
// Cascader (분자) — 계층을 단계별로 좁혀 '경로'를 고른다(지역>시>구, 분류 트리 등 도메인 무관).
//  · 방식 C = A(순차 드롭다운) + 완료 시 브레드크럼 압축.
//    - 편집/미완료: 한 칸 고르면 다음 칸 등장(칸 수=깊이, 폭 오버플로 0, 임의 깊이). 각 칸은 닫힌 Select.
//    - 리프(자식 없음) 선택 → 완료 → "라벨 › 라벨 › 라벨 [변경]" 으로 압축. 변경 누르면 다시 드롭다운.
//  · value = 선택 경로(value[]). 시각적 리프(색·재질)는 Cascader 밖 — 적용 사례지 컴포넌트 책임 아님.
import { useState } from 'react';
import { Group } from './Group';
import { Select } from './Select';
import { Text } from './Text';
import { Button } from './Button';

export type CascaderOption = { value: string; label: string; children?: CascaderOption[] };
type Props = {
  options: CascaderOption[];
  value: string[];
  onChange: (path: string[]) => void;
  placeholder?: string;
};
export function Cascader({ options, value, onChange, placeholder = '선택' }: Props) {
  const [editing, setEditing] = useState(false);

  // 경로 라벨 + 완료(리프 도달) 여부.
  const labels: string[] = [];
  let walk: CascaderOption[] | undefined = options;
  let complete = false;
  for (const v of value) {
    const hit: CascaderOption | undefined = walk?.find((o) => o.value === v);
    if (!hit) break;
    labels.push(hit.label);
    if (!hit.children?.length) { complete = true; break; }
    walk = hit.children;
  }

  // 완료 + 비편집 → 브레드크럼 압축(C).
  if (complete && !editing && labels.length > 0) {
    return (
      <Group gap="xs" align="center" wrap={false}>
        <Text variant="body">{labels.join(' › ')}</Text>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>변경</Button>
      </Group>
    );
  }

  // 편집/미완료 → 순차 드롭다운(A).
  const levels: { options: CascaderOption[]; value: string | null }[] = [];
  let level: CascaderOption[] | undefined = options;
  let i = 0;
  while (level && level.length > 0) {
    const v: string | null = value[i] ?? null;
    levels.push({ options: level, value: v });
    const hit: CascaderOption | undefined = v ? level.find((o) => o.value === v) : undefined;
    if (hit?.children?.length) { level = hit.children; i += 1; }
    else break;
  }
  const handle = (levelIdx: number, v: string | null) => {
    const next = value.slice(0, levelIdx);
    if (v) next.push(v);
    onChange(next);
    // 리프 선택 → 편집 종료(브레드크럼 압축) / 비리프 → 계속 편집(다음 칸).
    const picked: CascaderOption | undefined = v ? levels[levelIdx].options.find((o) => o.value === v) : undefined;
    setEditing(!(picked && !picked.children?.length));
  };
  return (
    <Group gap="xs" wrap>
      {levels.map((lv, idx) => (
        <div key={idx} style={{ minWidth: 160 }}>
          <Select
            options={lv.options.map((o) => ({ label: o.label, value: o.value }))}
            value={lv.value}
            onChange={(v) => handle(idx, v)}
            placeholder={idx === 0 ? placeholder : '하위 선택'}
          />
        </div>
      ))}
    </Group>
  );
}
