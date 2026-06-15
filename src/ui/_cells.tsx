// 유기체 공유 패턴 — DataTable·DescriptionList가 "값을 어떤 표현으로 그리나"를 공유.
// 자유 render 함수 금지(raw 구멍). 새 타입은 큐레이션 추가(헌법 4).
import dayjs from 'dayjs';
import { Text } from './Text';
import { Badge } from './Badge';
import { Button } from './Button';
import { Group } from './Group';
import { Icon, type IconName } from './Icon';
import { IconButton } from './IconButton';

export type CellType = 'text' | 'badge' | 'number' | 'currency' | 'date' | 'boolean' | 'actions';
export type ActionVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
// 행위 중심 액션은 좌측 아이콘(icon) 또는 아이콘 전용(iconOnly). 중립 액션(취소·이동)은 둘 다 생략 → 텍스트.
export type Action = {
  label: string;
  variant?: ActionVariant;
  onClick: () => void;
  icon?: IconName;
  iconOnly?: boolean;        // true면 IconButton(aria-label=label). icon 필수.
};
export type BadgeColor = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

// 액션 1개 렌더 — 모든 호출처(표·PageHeader·Modal·EmptyState·DetailPage) 공유.
//  iconOnly+icon → IconButton / icon+label → Button leftIcon / 그 외 → 텍스트 Button.
export function renderAction(a: Action, key: number | string, size: 'sm' | 'md' = 'md') {
  if (a.iconOnly && a.icon) {
    return <IconButton key={key} icon={a.icon} label={a.label} variant={a.variant ?? 'ghost'} size={size} onClick={a.onClick} />;
  }
  return (
    <Button key={key} variant={a.variant ?? 'secondary'} size={size}
      leftIcon={a.icon ? <Icon name={a.icon} size={size} /> : undefined} onClick={a.onClick}>
      {a.label}
    </Button>
  );
}

function fmtDate(v: unknown): string {
  if (v == null || v === '') return '';
  const d = dayjs(v as string);
  return d.isValid() ? d.format('YYYY-MM-DD') : String(v);
}

// 한국 소비자 기준(잠정 — 다국어화 시 locale은 토큰/설정으로 분리).
const NUM = new Intl.NumberFormat('ko-KR');
const KRW = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 });
// 통화·숫자 포맷의 단일 진실 공급원 — 셀뿐 아니라 분자(SummaryCard·TotalRow)도 이걸 재사용한다.
export function fmtNumber(v: unknown): string {
  const n = typeof v === 'number' ? v : Number(v);
  return v == null || v === '' || Number.isNaN(n) ? '' : NUM.format(n); // 천 단위 ,
}
export function fmtCurrency(v: unknown): string {
  const n = typeof v === 'number' ? v : Number(v);
  return v == null || v === '' || Number.isNaN(n) ? '' : KRW.format(n); // ₩ + 천 단위 ,
}

// badge 값→색 매핑은 스키마 주입(컬럼/아이템이 badgeColors로 넘김).
export function renderCell(
  type: CellType,
  value: unknown,
  opts?: { badgeColors?: Record<string, BadgeColor> },
) {
  switch (type) {
    case 'text':
      return <Text variant="body">{value == null ? '' : String(value)}</Text>;
    case 'number':
      return <Text variant="body">{fmtNumber(value)}</Text>;
    case 'currency':
      return <Text variant="body">{fmtCurrency(value)}</Text>;
    case 'date':
      return <Text variant="body">{fmtDate(value)}</Text>;
    case 'badge': {
      const v = String(value ?? '');
      const color = opts?.badgeColors?.[v] ?? 'neutral';
      return <Badge color={color}>{v}</Badge>;
    }
    case 'boolean':
      // true → check 아이콘(primary), false → 엷은 대시(비활성 색). 빈 칸 대신 명시적 false 표시.
      return value
        ? <Icon name="check" color="primary" />
        : <span style={{ color: 'var(--text-disabled)' }}>—</span>;
    case 'actions': {
      const acts = (value as Action[] | undefined) ?? [];
      return (
        <Group gap="xs" justify="end">
          {acts.map((a, i) => renderAction(a, i, 'sm'))}
        </Group>
      );
    }
  }
}
