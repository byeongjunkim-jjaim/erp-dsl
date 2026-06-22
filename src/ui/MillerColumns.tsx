'use client';
// MillerColumns (분자) — 계층 경로를 *한 컨트롤*로 고른다. 트리거 1개 → 팝오버에서 좌→우 다단 컬럼(Finder·Ant Cascader 패턴).
//  · Cascader(순차 인라인 박스 N개)의 형제: 같은 컬럼-아이템 박스 비주얼, 다른 배치(트리거 1개 = 페이지 발자국 최소).
//  · 부모 클릭 = 그 자식 컬럼이 오른쪽에 등장(깊으면 가로 스크롤). 리프(자식 없음) = 경로 확정 → 닫고 트리거에 "A › B › C".
//  · 좁은 화면(≤600px)은 단일 컬럼 드릴인(한 컬럼 + 브레드크럼 뒤로)으로 폴백 — 가로 0, 깊이 무한.
//  · value = 경로(value[]). controlled. 대용량 검색은 Combobox로 위임(경계).
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Popover } from './Popover';
import { Group } from './Group';
import { Text } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';
import './controls.css';

export type MillerOption = { value: string; label: string; children?: MillerOption[] };
type Props = {
  options: MillerOption[];
  value: string[];
  onChange: (path: string[]) => void;
  placeholder?: string;
};

type Column = { options: MillerOption[]; selected: string | null };

// 진행 경로(path) → 보여줄 컬럼들(루트 + 선택된 부모들의 자식 컬럼). 마지막 선택이 리프면 거기서 멈춘다.
function buildColumns(options: MillerOption[], path: string[]): Column[] {
  const cols: Column[] = [];
  let level: MillerOption[] | undefined = options;
  let depth = 0;
  while (level && level.length > 0) {
    cols.push({ options: level, selected: path[depth] ?? null });
    const hit: MillerOption | undefined = path[depth] ? level.find((o) => o.value === path[depth]) : undefined;
    if (hit?.children?.length) { level = hit.children; depth += 1; } else break;
  }
  return cols;
}

// 확정 경로(value) → 라벨들(브레드크럼 표시용).
function pathLabels(options: MillerOption[], path: string[]): string[] {
  const out: string[] = [];
  let level: MillerOption[] | undefined = options;
  for (const v of path) {
    const hit: MillerOption | undefined = level?.find((o) => o.value === v);
    if (!hit) break;
    out.push(hit.label);
    level = hit.children;
  }
  return out;
}

// 경로가 리프까지 닿았나(완료) — 완료면 트리거 대신 브레드크럼으로 압축(Cascader와 동형).
function isComplete(options: MillerOption[], path: string[]): boolean {
  let level: MillerOption[] | undefined = options;
  for (const v of path) {
    const hit: MillerOption | undefined = level?.find((o) => o.value === v);
    if (!hit) return false;
    if (!hit.children?.length) return true;   // 리프 도달
    level = hit.children;
  }
  return false;
}

export function MillerColumns({ options, value, onChange, placeholder = '선택' }: Props) {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState<string[]>(value);  // 팝오버 내 진행 경로(확정 전)
  const [drillDepth, setDrillDepth] = useState(0);         // 좁은 모드에서 보는 컬럼 깊이
  const narrow = useMediaQuery('(max-width: 600px)') ?? false;

  const columns = buildColumns(options, active);
  const labels = pathLabels(options, value);
  const complete = labels.length > 0 && isComplete(options, value);  // 완료면 트리거 = 브레드크럼(박스 밖), 아니면 placeholder 박스.

  // 열 때 진행 경로를 현재 확정값으로 초기화(reopen 시 있던 자리에서 시작).
  const open = () => {
    setActive(value);
    setDrillDepth(Math.max(0, buildColumns(options, value).length - 1));
    setOpened(true);
  };

  const pick = (depth: number, opt: MillerOption) => {
    const next = [...active.slice(0, depth), opt.value];
    setActive(next);
    if (opt.children?.length) {
      setDrillDepth(depth + 1);          // 비리프 → 다음 컬럼(드릴 깊이 +1, Miller는 새 컬럼 자동)
    } else {
      onChange(next);                    // 리프 → 경로 확정 + 닫기
      setOpened(false);
    }
  };

  const colView = (col: Column, depth: number) => (
    <div key={depth} className="erpColList erpColListFill">
      {col.options.map((o) => (
        <div
          key={o.value}
          className="erpColItem"
          data-selected={o.value === col.selected || undefined}
          role="button"
          tabIndex={0}
          onClick={() => pick(depth, o)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(depth, o); } }}
        >
          <Text variant="body">{o.label}</Text>
          {o.children?.length ? <span className="erpColItemIcon"><Icon name="chevron-right" size="sm" color="secondary" /></span> : null}
        </div>
      ))}
    </div>
  );

  // 좁은 모드 = 단일 컬럼 드릴인(현재 깊이 + 뒤로 헤더). 넓은 모드 = 다단(가로 스크롤).
  // 패널 바깥 박스를 컬럼 수와 무관하게 *상수 높이(320)*로 고정 → 컬럼 증식 시 floating-ui 재배치(이동) 없음. 컬럼은 내부 세로 스크롤.
  const dShown = Math.min(drillDepth, columns.length - 1);
  const content = narrow ? (
    <div style={{ width: 220, height: 320, display: 'flex', flexDirection: 'column' }}>
      {dShown > 0 && (
        <div
          className="erpColBack"
          role="button"
          tabIndex={0}
          onClick={() => setDrillDepth((d) => Math.max(0, d - 1))}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDrillDepth((d) => Math.max(0, d - 1)); } }}
        >
          <span className="erpColItemIcon"><Icon name="chevron-left" size="sm" color="secondary" /></span>
          <Text variant="caption" color="secondary">{pathLabels(options, active.slice(0, dShown)).join(' › ') || '처음'}</Text>
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0 }}>{colView(columns[dShown], dShown)}</div>
    </div>
  ) : (
    <div style={{ display: 'flex', alignItems: 'stretch', overflowX: 'auto', height: 320 }}>
      {columns.map((col, depth) => colView(col, depth))}
    </div>
  );

  return (
    <Popover
      opened={opened}
      onChange={(o) => (o ? open() : setOpened(false))}
      position="bottom"
      align="start"
      reposition="fixed"
      width={narrow ? 'sm' : 'xl'}
      content={content}
    >
      {complete ? (
        // 완료 — 박스 안에 가두지 말고 Cascader처럼 브레드크럼으로 밖에 표시(+변경). 클릭=팝오버 재오픈.
        <Group gap="xs" align="center" wrap={false}>
          <Text variant="body">{labels.join(' › ')}</Text>
          <Button variant="ghost" size="sm">변경</Button>
        </Group>
      ) : (
        <div className="erpColTrigger">
          <Text variant="body" color="secondary">{placeholder}</Text>
          <span className="erpColTriggerIcon"><Icon name="chevron-down" size="sm" color="secondary" /></span>
        </div>
      )}
    </Popover>
  );
}
