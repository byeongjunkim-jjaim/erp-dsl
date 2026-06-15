'use client';
// 3단계 시각 검증용 dev 갤러리. DSL 부품 아님. (AppShell은 /shell 라우트에서 별도 확인)
import { useState } from 'react';
import { Stack } from './Stack';
import { Card } from './Card';
import { Title } from './Title';
import { Button } from './Button';
import { PageHeader } from './PageHeader';
import { DataTable } from './DataTable';
import { DescriptionList } from './DescriptionList';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import type { Action, BadgeColor } from './_cells';

const STATUS_COLORS: Record<string, BadgeColor> = {
  대기: 'neutral', 진행: 'info', 완료: 'success', 보류: 'warning', 취소: 'danger',
};
const rowAction = (label: string): Action[] => [
  { label: '보기', variant: 'ghost', onClick: () => {} },
  { label, variant: 'danger', onClick: () => {} },
];
const ROWS = [
  { orderNo: 'PO-1001', status: '완료', amount: 1250000, due: '2026-06-20', actions: rowAction('삭제') },
  { orderNo: 'PO-1002', status: '진행', amount: 870000, due: '2026-06-22', actions: rowAction('삭제') },
  { orderNo: 'PO-1003', status: '대기', amount: 430000, due: '2026-06-25', actions: rowAction('삭제') },
  { orderNo: 'PO-1004', status: '보류', amount: 2010000, due: '2026-07-01', actions: rowAction('삭제') },
];

export function DevOrganismGallery() {
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);

  return (
    <Stack gap="xl">
      <Title variant="heading">3단계 — 유기체 6</Title>

      <Card variant="outlined" padding="lg">
        <PageHeader
          title="발주 목록"
          description="도메인은 데이터로만 — PageHeader는 '발주'가 뭔지 모른다"
          actions={[{ label: '발주 생성', variant: 'primary', onClick: () => setModal(true) }]}
        />
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">DataTable — 셀 type enum(text/badge/number/date/actions) · 정렬 · 페이징</Title>
          <DataTable
            columns={[
              { key: 'orderNo', label: '발주번호', type: 'text', sortable: true },
              { key: 'status', label: '상태', type: 'badge', badgeColors: STATUS_COLORS },
              { key: 'amount', label: '금액', type: 'currency', sortable: true },
              { key: 'due', label: '납기', type: 'date', sortable: true },
              { key: 'actions', label: '', type: 'actions' },
            ]}
            rows={ROWS}
            status="ready"
            sort={sort}
            onSortChange={setSort}
            page={page}
            onPageChange={setPage}
            totalPages={5}
          />
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">DescriptionList — 라벨:값 (값 표현은 셀 enum 공유)</Title>
          <DescriptionList
            columns={2}
            items={[
              { label: '발주번호', value: 'PO-1001', type: 'text' },
              { label: '상태', value: '완료', type: 'badge', badgeColors: STATUS_COLORS },
              { label: '금액', value: 1250000, type: 'currency' },
              { label: '납기', value: '2026-06-20', type: 'date' },
            ]}
          />
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">EmptyState — 아이콘+제목+설명+[action]</Title>
          <EmptyState
            icon="search"
            title="검색 결과가 없습니다"
            description="다른 조건으로 다시 시도해 보세요"
            action={{ label: '필터 초기화', variant: 'secondary', onClick: () => {} }}
          />
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">Modal — 본문은 도메인, 껍데기는 모름 · 푸터 actions 자동 배치</Title>
          <Button variant="primary" onClick={() => setModal(true)}>모달 열기</Button>
        </Stack>
      </Card>

      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title="발주 생성"
        size="md"
        actions={[
          { label: '취소', variant: 'secondary', onClick: () => setModal(false) },
          { label: '생성', variant: 'primary', onClick: () => setModal(false) },
        ]}
      >
        <DescriptionList
          columns={1}
          items={[{ label: '안내', value: '본문엔 도메인 폼이 온다(Modal은 모름). 푸터는 primary가 자동으로 오른쪽 끝.', type: 'text' }]}
        />
      </Modal>
    </Stack>
  );
}
