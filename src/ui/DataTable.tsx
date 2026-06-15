'use client';
// DataTable 유기체 — 도메인 무관 표 껍데기. columns(표현 enum)·rows(데이터) 주입, "고객" 모름.
// 정렬·페이징 상태만 들고 실제 수행은 바깥(controlled). Pagination·EmptyState 조합.
import { Table, Group as MGroup, Center } from '@mantine/core';
import { renderCell, type CellType, type BadgeColor } from './_cells';
import { Text } from './Text';
import { Icon } from './Icon';
import { Spinner } from './Spinner';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import { Stack } from './Stack';
import { Divider } from './Divider';
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
};

const RIGHT = new Set<CellType>(['number', 'currency', 'actions']);

export function DataTable({
  columns, rows, status = 'ready', sort, onSortChange,
  page, onPageChange, totalPages, totalCount, onRowClick, emptyState,
}: Props) {
  if (status === 'loading') return <Center p="xl"><Spinner /></Center>;
  if (status === 'empty')
    return <EmptyState icon={emptyState?.icon} title={emptyState?.title ?? '데이터 없음'} description={emptyState?.description} />;

  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    if (sort?.key === key) onSortChange({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    else onSortChange({ key, direction: 'asc' });
  };

  return (
    <Stack gap="md">
      {/* 데이터행 세로여백 = sm(12). 내용(텍스트 한 줄·작은 아바타) 대비 md(16)는 과해 낮춤. */}
      <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
        <Table.Thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-default)' }}>
          <Table.Tr>
            {columns.map((c) => {
              const active = sort?.key === c.key;
              const arrow: IconName = active && sort?.direction === 'desc' ? 'chevron-down' : 'chevron-up';
              return (
                <Table.Th key={c.key} style={{ textAlign: RIGHT.has(c.type) ? 'right' : 'left', cursor: c.sortable ? 'pointer' : 'default', paddingBlock: 'var(--mantine-spacing-xs)', verticalAlign: 'middle', lineHeight: 1 }}
                  onClick={c.sortable ? () => toggleSort(c.key) : undefined}>
                  <MGroup gap={4} align="center" justify={RIGHT.has(c.type) ? 'flex-end' : 'flex-start'} wrap="nowrap">
                    <Text variant="caption" color="secondary">{c.label}</Text>
                    {c.sortable && active && (
                      // flex 안에선 Icon의 vertical-align 보정이 죽으므로, 같은 토큰을 transform으로 복원(헤더 한정).
                      <span style={{ display: 'inline-flex', transform: 'translateY(calc(-1 * var(--icon-baseline-shift)))' }}>
                        <Icon name={arrow} size="sm" color="secondary" />
                      </span>
                    )}
                  </MGroup>
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row, ri) => (
            <Table.Tr key={ri} onClick={onRowClick ? () => onRowClick(row) : undefined} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
              {columns.map((c) => (
                <Table.Td key={c.key} style={{ textAlign: RIGHT.has(c.type) ? 'right' : 'left', verticalAlign: 'middle' }}
                  onClick={c.type === 'actions' ? (e) => e.stopPropagation() : undefined}>
                  {renderCell(c.type, row[c.key], { badgeColors: c.badgeColors })}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
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
            {/* 표↔페이지네이션 경계 구분선 — 목록 하단 표준 구성. */}
            <Divider />
            <MGroup justify={justify} align="center" p="md" pt="0" wrap="nowrap">
              {hasCount && <Text variant="caption" color="secondary">{`총 ${(totalCount as number).toLocaleString('ko-KR')}건`}</Text>}
              {hasPagination && <Pagination total={totalPages as number} value={page as number} onChange={onPageChange!} />}
            </MGroup>
          </>
        );
      })()}
    </Stack>
  );
}
