'use client';
// 위젯 그리드 시범 — 페이지를 Bento 닫힌 격자로 두고 위젯(요약 타일·표 위젯)이 정수 칸 점유.
// "작게 시작" 한 화면 검증용. 크기 변주(요약=좁게, 표=넓게)가 위계를 만든다(Bento).
import { Bento, SummaryCard, Card, DataTable, Title, Text, Stack } from '@/ui';

export default function GridDemo() {
  return (
    <Stack gap="lg">
      <Stack gap="xxs">
        <Title variant="display">위젯 그리드 시범</Title>
        <Text variant="body" color="secondary">페이지 = 닫힌 격자(columns 6). 위젯이 colSpan으로 칸을 점유 — 요약 타일(2)·표 위젯(6).</Text>
      </Stack>
      <Bento columns={6} gap="lg">
        <Bento.Tile colSpan={2}><SummaryCard label="승인 대기" icon="clock" tone="warning" count={12} amount={3400000} /></Bento.Tile>
        <Bento.Tile colSpan={2}><SummaryCard label="확정" icon="check-circle" tone="success" count={48} amount={18200000} /></Bento.Tile>
        <Bento.Tile colSpan={2}><SummaryCard label="반려" icon="x-circle" tone="danger" count={3} /></Bento.Tile>
        <Bento.Tile colSpan={6} rowSpan={3}>
          <Card variant="elevated" padding="none" fill>
           <div style={{ height: '100%', overflowY: 'auto' }}>
            <DataTable
              columns={[
                { key: 'name', label: '거래처', type: 'text', sortable: true },
                { key: 'owner', label: '담당', type: 'user' },
                { key: 'status', label: '상태', type: 'badge' },
                { key: 'amount', label: '금액', type: 'currency', sortable: true },
              ]}
              rows={[
                { id: '1', name: '가구상사', owner: { name: '김병준' }, status: '확정', amount: 1200000, badgeColors: { 확정: 'success' } },
                { id: '2', name: '목재유통', owner: { name: '이수연' }, status: '대기', amount: 880000, badgeColors: { 대기: 'warning' } },
              ]}
              status="ready"
            />
           </div>
          </Card>
        </Bento.Tile>
      </Bento>
    </Stack>
  );
}
