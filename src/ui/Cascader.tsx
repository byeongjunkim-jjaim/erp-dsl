'use client';
// Cascader (분자) — 계층을 단계별로 좁혀 '경로'를 고른다(지역>시>구, 분류 트리 등 도메인 무관).
//  · 순차 인라인: 한 칸(레벨) 고르면 다음 칸이 옆에 등장(칸 수=깊이, 임의 깊이). 페이지에 N개 박스를 펼치는 방식(공간 여유용).
//    - 각 레벨 드롭다운 박스 = 공유 컬럼-아이템 레이아웃(MillerColumns와 동일 비주얼, Select 아님 → 모양 통일).
//  · 리프(자식 없음) 선택 → 완료 → "라벨 › 라벨 › 라벨 [변경]"으로 압축. 변경 누르면 다시 펼침.
//  · 한 트리거+팝오버 다단(좁은 공간·깊은 트리)은 형제 부품 MillerColumns. value = 선택 경로(value[]). controlled.
import { useState } from 'react';
import { Popover } from './Popover';
import { Group } from './Group';
import { Text } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';
import './controls.css';

export type CascaderOption = { value: string; label: string; children?: CascaderOption[] };
type Props = {
  options: CascaderOption[];
  value: string[];
  onChange: (path: string[]) => void;
  placeholder?: string;
};

// 한 레벨 드롭다운 — 트리거(선택 라벨/placeholder) + 팝오버 단일 컬럼(공유 컬럼-아이템 박스).
function LevelPicker({ options, selected, placeholder, onPick }: {
  options: CascaderOption[];
  selected: string | null;
  placeholder: string;
  onPick: (opt: CascaderOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const cur = selected ? options.find((o) => o.value === selected) : undefined;
  return (
    <Popover
      opened={open}
      onChange={setOpen}
      position="bottom"
      align="start"
      width="sm"
      content={
        <div className="erpColList">
          {options.map((o) => (
            <div
              key={o.value}
              className="erpColItem"
              data-selected={o.value === selected || undefined}
              role="button"
              tabIndex={0}
              onClick={() => { onPick(o); setOpen(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(o); setOpen(false); } }}
            >
              <Text variant="body">{o.label}</Text>
              {o.children?.length ? <span className="erpColItemIcon"><Icon name="chevron-right" size="sm" color="secondary" /></span> : null}
            </div>
          ))}
        </div>
      }
    >
      <div className="erpColTrigger">
        <Text variant="body" color={cur ? 'primary' : 'secondary'}>{cur ? cur.label : placeholder}</Text>
        <span className="erpColTriggerIcon"><Icon name="chevron-down" size="sm" color="secondary" /></span>
      </div>
    </Popover>
  );
}

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

  // 완료 + 비편집 → 브레드크럼 압축.
  if (complete && !editing && labels.length > 0) {
    return (
      <Group gap="xs" align="center" wrap={false}>
        <Text variant="body">{labels.join(' › ')}</Text>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>변경</Button>
      </Group>
    );
  }

  // 편집/미완료 → 순차 인라인 레벨 박스.
  const levels: { options: CascaderOption[]; value: string | null }[] = [];
  let level: CascaderOption[] | undefined = options;
  let i = 0;
  while (level && level.length > 0) {
    const v: string | null = value[i] ?? null;
    levels.push({ options: level, value: v });
    const hit: CascaderOption | undefined = v ? level.find((o) => o.value === v) : undefined;
    if (hit?.children?.length) { level = hit.children; i += 1; } else break;
  }
  const handle = (levelIdx: number, opt: CascaderOption) => {
    const next = [...value.slice(0, levelIdx), opt.value];
    onChange(next);
    // 리프 선택 → 편집 종료(압축) / 비리프 → 계속 편집(다음 칸).
    setEditing(!!opt.children?.length);
  };
  return (
    <Group gap="xs" wrap>
      {levels.map((lv, idx) => (
        <LevelPicker
          key={idx}
          options={lv.options}
          selected={lv.value}
          placeholder={idx === 0 ? placeholder : '하위 선택'}
          onPick={(o) => handle(idx, o)}
        />
      ))}
    </Group>
  );
}
