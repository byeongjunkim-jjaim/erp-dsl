'use client';
// LineItemList (유기체) — 편집 가능한 라인아이템 목록. DataTable(읽기 전용)에 없는 "수량 편집 + 소계 + 삭제 + 합계".
//  · 도메인 무지(헌법 1): 라인아이템 데이터를 받아 그릴 뿐 "발주/장바구니/견적"을 모른다(DataTable=columns/rows 동형).
//  · 수량 = NumberStepper(증감+타이핑). 그룹(하위분류 등) 헤더로 묶고, 하단에 수량-중심 합계(가격은 옵션).
//  · 빈 목록 = EmptyState 재사용. 자기 표면(카드/그림자) 없음 — flush. 템플릿이 sunken well에 담는다(02 elevation 2축).
//  · 라벨 말줄임은 Text 원자가 truncate를 안 열어, --typo-body-* 역할변수 raw span으로(Tree·Breadcrumb 선례).
import { Stack } from './Stack';
import { Group } from './Group';
import { Text } from './Text';
import { Divider } from './Divider';
import { NumberStepper } from './NumberStepper';
import { EmptyState } from './EmptyState';
import { fmtCurrency, fmtNumber } from './_cells';
import { Icon, type IconName } from './Icon';

export type LineItem = {
  id: string;
  label: string;
  sublabel?: string;   // 경로/규격 등 보조(caption)
  group?: string;      // 그룹 라벨(있으면 그룹 헤더로 묶음 — 하위분류 등)
  unitAmount?: number; // 단가(showAmount일 때 소계 = unitAmount × quantity)
  quantity: number;
  min?: number;        // 스테퍼 하한(기본 0)
  max?: number;        // 스테퍼 상한(선택)
};

type Props = {
  items: LineItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;     // 있으면 행에 ✕(빼기) 노출
  showAmount?: boolean;                // 단가 소계·금액 합계 표시(기본 off — 수량 중심)
  totalLabel?: string;                 // 합계 라벨(기본 '전체')
  unit?: string;                       // 수량 단위(기본 '개')
  emptyState?: { icon?: IconName; title: string; description?: string };
  showTotal?: boolean;   // 합계 행 표시(기본 true). false면 컨테이너가 합계를 *고정*으로 따로 그릴 때.
};

const ELLIPSIS = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } as const;

export function LineItemList({
  items, onQuantityChange, onRemove, showAmount = false,
  totalLabel = '전체', unit = '개', emptyState, showTotal = true,
}: Props) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={emptyState?.icon ?? 'cart'}
        title={emptyState?.title ?? '담은 항목이 없습니다'}
        description={emptyState?.description}
      />
    );
  }

  // 그룹 순서 보존하며 묶기(group 없으면 평면)
  const groups: { key: string; rows: LineItem[] }[] = [];
  for (const it of items) {
    const k = it.group ?? '';
    let g = groups.find((x) => x.key === k);
    if (!g) { g = { key: k, rows: [] }; groups.push(g); }
    g.rows.push(it);
  }
  const grouped = groups.some((g) => g.key !== '');

  const qtyTotal = items.reduce((s, it) => s + it.quantity, 0);
  const amtTotal = items.reduce((s, it) => s + (it.unitAmount ?? 0) * it.quantity, 0);

  const row = (it: LineItem) => (
    <Group key={it.id} justify="between" align="center" gap="sm">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...ELLIPSIS, fontSize: 'var(--typo-body-size)', fontWeight: 'var(--typo-body-weight)', color: 'var(--text-primary)' }}>
          {it.label}
        </div>
        {it.sublabel && (
          <div style={{ ...ELLIPSIS, fontSize: 'var(--typo-caption-size)', color: 'var(--text-secondary)' }}>{it.sublabel}</div>
        )}
      </div>
      <Group gap="xs" align="center" wrap={false}>
        {showAmount && it.unitAmount !== undefined && (
          <Text variant="caption" color="secondary">{fmtCurrency(it.unitAmount * it.quantity)}</Text>
        )}
        <NumberStepper
          value={it.quantity}
          onChange={(q) => onQuantityChange(it.id, q)}
          min={it.min} max={it.max} size="sm"
        />
        {onRemove && (
          <button type="button" className="erpLineItemDel" aria-label="빼기" onClick={() => onRemove(it.id)}>
            <Icon name="x" size="sm" />
          </button>
        )}
      </Group>
    </Group>
  );

  return (
    <Stack gap="md">
      {groups.map((g) => (
        <Stack key={g.key || '_'} gap="xs">
          {grouped && (
            <Group justify="between" align="center">
              <Text variant="body-strong" color="primary">{g.key || '기타'}</Text>
              <Text variant="caption" color="secondary">
                {fmtNumber(g.rows.reduce((s, it) => s + it.quantity, 0))}{unit}
              </Text>
            </Group>
          )}
          {g.rows.map(row)}
        </Stack>
      ))}

      {showTotal && (
        <Stack gap="xs">
          <Divider />
          <Group justify="between" align="center">
            <Text variant="body-strong">{totalLabel}</Text>
            <Group gap="sm" align="center">
              {showAmount && <Text variant="body" color="secondary">{fmtCurrency(amtTotal)}</Text>}
              <Text variant="body-strong">{fmtNumber(qtyTotal)}{unit}</Text>
            </Group>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}
