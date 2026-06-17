'use client';
// DataTable 유기체 — 도메인 무관 표 껍데기. columns(표현 enum)·rows(데이터) 주입, "고객" 모름.
// 정렬·페이징 상태만 들고 실제 수행은 바깥(controlled). Pagination·EmptyState 조합.
import { Table, Group as MGroup, Center } from '@mantine/core';
import { renderCell, renderAction, type CellType, type BadgeColor, type Action } from './_cells';
import { Text } from './Text';
import { Icon } from './Icon';
import { Spinner } from './Spinner';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import { Divider } from './Divider';
import { Checkbox } from './Checkbox';
import type { IconName } from './Icon';

export type DataTableColumn = {
  key: string;
  label: string;
  type: CellType;
  span?: number;          // text 열 폭(없으면 균등) — 비율은 구조에서
  sortable?: boolean;
  badgeColors?: Record<string, BadgeColor>;
};
export type DataTableRow = Record<string, unknown>;
export type DataTableSort = { key: string; direction: 'asc' | 'desc' } | null;

type Props = {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  status?: 'loading' | 'empty' | 'ready';
  sort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  page?: number;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  totalCount?: number;                        // 푸터 좌측 "총 N건"(number만, 포맷은 부품 고정). 데이터가 결정.
  onRowClick?: (row: DataTableRow) => void;   // 행 클릭 이동(범용). actions 셀과 경쟁 안 하도록 보기 액션은 두지 않음.
  emptyState?: { icon?: IconName; title: string; description?: string };
  // 행 선택(체크박스 열) — controlled. 액션 경계: 행/선택/컬럼 스코프=DataTable, 페이지 스코프(신규 생성 등)=ListPage.
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  rowId?: (row: DataTableRow) => string;      // 기본 row.id
  bulkActions?: Action[];                     // 선택된 행 대상(선택>0일 때 상단 툴바). 선택 무관 액션은 ListPage 몫.
};

const RIGHT = new Set<CellType>(['number', 'currency', 'actions', 'percent']);
const CENTER = new Set<CellType>(['boolean', 'thumbnail']); // boolean(체크/대시)·썸네일은 가운데.
const textAlignOf = (t: CellType): 'right' | 'center' | 'left' => (RIGHT.has(t) ? 'right' : CENTER.has(t) ? 'center' : 'left');
const justifyOf = (t: CellType): 'flex-end' | 'center' | 'flex-start' => (RIGHT.has(t) ? 'flex-end' : CENTER.has(t) ? 'center' : 'flex-start');

export function DataTable({
  columns, rows, status = 'ready', sort, onSortChange,
  page, onPageChange, totalPages, totalCount, onRowClick, emptyState,
  selectable, selectedIds, onSelectionChange, rowId, bulkActions,
}: Props) {
  if (status === 'loading') return <Center p="xl"><Spinner /></Center>;
  if (status === 'empty')
    return <EmptyState icon={emptyState?.icon} title={emptyState?.title ?? '데이터 없음'} description={emptyState?.description} />;

  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    if (sort?.key === key) onSortChange({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    else onSortChange({ key, direction: 'asc' });
  };

  // 선택 상태(controlled). id는 rowId 또는 row.id.
  const idOf = (row: DataTableRow) => (rowId ? rowId(row) : String(row.id ?? ''));
  const selected = new Set(selectedIds ?? []);
  const allSelected = !!selectable && rows.length > 0 && rows.every((r) => selected.has(idOf(r)));
  const toggleAll = () => onSelectionChange?.(allSelected ? [] : rows.map(idOf));
  const toggleOne = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    onSelectionChange([...next]);
  };

  return (
    // 외곽은 Fragment — 표↔푸터 간격은 Divider+푸터 패딩이 책임진다(Stack gap을 넣으면 마지막 행 아래 군더더기 유격).
    <>
      {/* 벌크 액션 툴바 — 선택>0 + bulkActions 있을 때만(선택 스코프 액션). 페이지 액션은 ListPage 헤더 몫(경계). */}
      {selectable && bulkActions && bulkActions.length > 0 && selected.size > 0 && (
        <MGroup justify="space-between" align="center" p="sm" mb="xs" wrap="nowrap"
          style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--mantine-radius-sm)' }}>
          <Text variant="body-strong">{`${selected.size}개 선택`}</Text>
          <MGroup gap="xs" align="center">{bulkActions.map((a, i) => renderAction(a, i, 'sm'))}</MGroup>
        </MGroup>
      )}
      {/* 데이터행 세로여백 = sm(12). 내용(텍스트 한 줄·작은 아바타) 대비 md(16)는 과해 낮춤. */}
      {/* highlightOnHover는 행이 이동(onRowClick)할 때만 — 비이동 행은 hover 강조 불필요(클릭 가능 신호). */}
      <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover={!!onRowClick}>
        <Table.Thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-default)' }}>
          <Table.Tr>
            {selectable && (
              <Table.Th style={{ width: 44, verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                <Checkbox checked={allSelected} onChange={toggleAll} />
              </Table.Th>
            )}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              const arrow: IconName = active && sort?.direction === 'desc' ? 'chevron-down' : 'chevron-up';
              return (
                <Table.Th key={c.key} style={{ textAlign: textAlignOf(c.type), cursor: c.sortable ? 'pointer' : 'default', paddingBlock: 'var(--mantine-spacing-xs)', verticalAlign: 'middle' }}
                  onClick={c.sortable ? () => toggleSort(c.key) : undefined}>
                  <MGroup gap={4} align="center" justify={justifyOf(c.type)} wrap="nowrap">
                    <Text variant="caption" color="secondary">{c.label}</Text>
                    {c.sortable && (
                      // 정렬 가능 열엔 항상 꺽쇠(비활성=opacity 0.35로 옅게). 라벨 옆 — 텍스트 정렬은 데이터 타입대로(우측밀착 강제 X).
                      // flex 안에선 Icon vertical-align 보정이 죽으므로 같은 토큰을 transform으로 복원(헤더 한정).
                      <span style={{ display: 'inline-flex', transform: 'translateY(calc(-1 * var(--icon-baseline-shift)))', opacity: active ? 1 : 0.35 }}>
                        <Icon name={active ? arrow : 'chevron-down'} size="sm" color="secondary" />
                      </span>
                    )}
                  </MGroup>
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row, ri) => {
            const id = idOf(row);
            return (
              <Table.Tr key={ri} onClick={onRowClick ? () => onRowClick(row) : undefined} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                {selectable && (
                  <Table.Td style={{ width: 44, verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selected.has(id)} onChange={() => toggleOne(id)} />
                  </Table.Td>
                )}
                {columns.map((c) => (
                  <Table.Td key={c.key} style={{ textAlign: textAlignOf(c.type), verticalAlign: 'middle' }}
                    onClick={c.type === 'actions' ? (e) => e.stopPropagation() : undefined}>
                    {renderCell(c.type, row[c.key], { badgeColors: c.badgeColors })}
                  </Table.Td>
                ))}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      {(() => {
        const hasPagination = typeof page === 'number' && typeof totalPages === 'number' && !!onPageChange;
        const hasCount = typeof totalCount === 'number';
        if (!hasPagination && !hasCount) return null;
        // 둘 다면 "총 N건"(좌) + 페이지(우), 하나뿐이면 그것만(페이지는 중앙).
        const justify = hasPagination && hasCount ? 'space-between' : hasCount ? 'flex-start' : 'center';
        return (
          <>
            {/* 표↔페이지네이션 경계 구분선 — 목록 하단 표준 구성. Stack gap=0이라 마지막 행 바로 아래 밀착. */}
            <Divider />
            <MGroup justify={justify} align="center" p="md" wrap="nowrap">
              {hasCount && <Text variant="caption" color="secondary">{`총 ${(totalCount as number).toLocaleString('ko-KR')}건`}</Text>}
              {hasPagination && <Pagination total={totalPages as number} value={page as number} onChange={onPageChange!} />}
            </MGroup>
          </>
        );
      })()}
    </>
  );
}
