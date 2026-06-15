'use client';
// 2단계 시각 검증용 dev 갤러리. DSL 부품 아님 — 화면 확인 도구.
import { useState } from 'react';
import { Stack } from './Stack';
import { Group } from './Group';
import { Grid } from './Grid';
import { Card } from './Card';
import { Title } from './Title';
import { Text } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';
import { FormField } from './FormField';
import { MultiSelect } from './MultiSelect';
import { DateRangeField } from './DateRangeField';
import { InputGroup } from './InputGroup';
import { FileUploader, type FileItem } from './FileUploader';
import { Pagination } from './Pagination';
import { Callout } from './Callout';
import { StatusRow } from './StatusRow';
import { SummaryCard } from './SummaryCard';
import { TotalRow } from './TotalRow';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { Select } from './Select';

const opts = [
  { label: '합판', value: 'plywood' },
  { label: 'MDF', value: 'mdf' },
  { label: '집성목', value: 'glulam' },
  { label: '파티클보드', value: 'pb' },
];

export function DevMoleculeGallery() {
  const [email, setEmail] = useState('');
  const [qty, setQty] = useState<number | string>('');
  const [mat, setMat] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>(['plywood', 'mdf']);
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [page, setPage] = useState(3);
  const [files, setFiles] = useState<FileItem[]>([
    { id: 'a', name: '도면_A동.pdf', status: 'done' },
    { id: 'b', name: '사양서.xlsx', status: 'uploading', progress: 60 },
    { id: 'c', name: '대용량.zip', status: 'error', error: '용량 초과' },
  ]);

  return (
    <Stack gap="xl">
      <Title variant="heading">2단계 — 분자 6</Title>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">FormField — 장식·에러의 수령자 (에러 시 --field-border 덮어쓰기)</Title>
          <Grid columns={2} gap="md">
            <Grid.Col span={1}>
              <FormField label="이메일" withAsterisk>
                <TextInput value={email} onChange={setEmail} placeholder="name@company.com" />
              </FormField>
            </Grid.Col>
            <Grid.Col span={1}>
              <FormField label="수량" error="1 이상을 입력하세요">
                <NumberInput value={qty} onChange={setQty} placeholder="0" />
              </FormField>
            </Grid.Col>
            <Grid.Col span={1}>
              <FormField label="자재" withAsterisk error="자재를 선택하세요">
                <Select options={opts} value={mat} onChange={setMat} placeholder="고르기" />
              </FormField>
            </Grid.Col>
          </Grid>
          <Text variant="caption" color="secondary">
            ↑ 가운데·오른쪽 칸은 error가 있어 입력칸 테두리가 빨강 — 입력칸은 자기가 에러인지 모름(FormField가 덮음).
          </Text>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">MultiSelect — Select+Chip (드롭다운 유지·체크 Icon·Chip neutral)</Title>
          <FormField label="자재 다중선택">
            <MultiSelect options={opts} value={multi} onChange={setMulti} placeholder="여러 개 선택" />
          </FormField>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">DateRangeField · InputGroup</Title>
          <FormField label="납기 범위">
            <DateRangeField value={range} onChange={setRange} startPlaceholder="시작" endPlaceholder="끝" />
          </FormField>
          <FormField label="단가">
            <InputGroup leftAddon="₩" rightAddon="/ EA">
              <NumberInput value={qty} onChange={setQty} placeholder="0" />
            </InputGroup>
          </FormField>
          <FormField label="중량">
            <InputGroup rightAddon={<Icon name="search" />}>
              <TextInput value={email} onChange={setEmail} placeholder="검색 어드온(Icon)" />
            </InputGroup>
          </FormField>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">FileUploader — 4상태(대기→진행→완료/실패) · controlled</Title>
          <FormField label="첨부">
            <FileUploader value={files} onChange={setFiles} multiple />
          </FormField>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">Pagination — 번호형 단일(축약·화살표 Icon)</Title>
          <Group justify="center">
            <Pagination total={12} value={page} onChange={setPage} />
          </Group>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">Callout — 인라인 비휘발 안내(tone 4 × title 유/무)</Title>
          <Stack gap="sm">
            <Callout tone="info" title="안내">레거시 주소 형식이 감지되었습니다. 새 형식으로 다시 입력해 주세요.</Callout>
            <Callout tone="warning">이미 등록된 연락처와 중복됩니다. 확인 후 진행하세요.</Callout>
            <Callout tone="danger" title="처리 불가">필수 항목이 누락되어 저장할 수 없습니다.</Callout>
            <Callout tone="neutral">이 구획은 계약 후 실제 필드로 교체됩니다.</Callout>
          </Stack>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">StatusRow — 상태 + 행동 한 줄(액션 0/1/2 = 배열 길이)</Title>
          <Stack gap="sm">
            <StatusRow label="발주 승인" icon="file-text" status={{ label: '대기', tone: 'warning' }}
              actions={[{ label: '승인', variant: 'primary', onClick: () => {} }, { label: '반려', variant: 'danger', onClick: () => {} }]} />
            <StatusRow label="배송 상태" icon="truck" status={{ label: '진행', tone: 'info' }}
              actions={[{ label: '추적', variant: 'secondary', onClick: () => {} }]} />
            <StatusRow label="정산" icon="coin" status={{ label: '완료', tone: 'success' }} />
          </Stack>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">SummaryCard — KPI 타일(틴트 아이콘 · 건수 · 금액, 값 유무로 조립)</Title>
          <Grid columns={3} gap="md">
            <Grid.Col span={1}><SummaryCard label="승인 대기" icon="clock" tone="warning" count={12} amount={4820000} /></Grid.Col>
            <Grid.Col span={1}><SummaryCard label="확정" icon="check-circle" tone="success" count={48} amount={31500000} /></Grid.Col>
            <Grid.Col span={1}><SummaryCard label="반려" icon="x-circle" tone="danger" count={3} /></Grid.Col>
          </Grid>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">TotalRow — 리스트 하단 합계(구분선 포함, 자기완결)</Title>
          <Stack gap="xs">
            <Group justify="between" align="center"><Text variant="body">자재비</Text><Text variant="body">₩ 1,200,000</Text></Group>
            <Group justify="between" align="center"><Text variant="body">시공비</Text><Text variant="body">₩ 800,000</Text></Group>
            <TotalRow amount={2000000} />
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
