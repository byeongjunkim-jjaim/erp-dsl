'use client';
// ─────────────────────────────────────────────────────────────────────────
// _registry — 부품별 라이브 예시 단일 출처. <Demo name="Button"/>로 어디서든 렌더.
//  · 손으로 짠 갤러리(_DevAtomGallery 등)를 흡수 — 부품 추가 시 여기 한 곳만 늘린다.
//  · 박물관 부품 상세(/dev/part/[name])가 이걸 쓴다. (JSX는 직렬화 불가라 데이터(_catalog)와 분리.)
//  · dev 전용(publish 제외).
// ─────────────────────────────────────────────────────────────────────────
import { useState, type ReactNode } from 'react';
import { Stack } from './Stack';
import { Group } from './Group';
import { Grid } from './Grid';
import { Card } from './Card';
import { Divider } from './Divider';
import { Title } from './Title';
import { Text } from './Text';
import { Badge } from './Badge';
import { Button } from './Button';
import { Chip } from './Chip';
import { Label } from './Label';
import { Anchor } from './Anchor';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { Image } from './Image';
import { Tooltip } from './Tooltip';
import { Popover } from './Popover';
import { Spinner } from './Spinner';
import { SegmentedControl } from './SegmentedControl';
import { TabBar } from './TabBar';
import { TextInput } from './TextInput';
import { PasswordInput } from './PasswordInput';
import { NumberInput } from './NumberInput';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { MultiDatePicker } from './MultiDatePicker';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';
import { Radio } from './Radio';
import { FormField } from './FormField';
import { MultiSelect } from './MultiSelect';
import { DateRangeField } from './DateRangeField';
import { InputGroup } from './InputGroup';
import { FileUploader, type FileItem } from './FileUploader';
import { Pagination } from './Pagination';
import { IconButton } from './IconButton';
import { Callout } from './Callout';
import { StatusRow } from './StatusRow';
import { SummaryCard } from './SummaryCard';
import { TotalRow } from './TotalRow';
import { Modal } from './Modal';
import { DataTable } from './DataTable';
import { EmptyState } from './EmptyState';
import { PageHeader } from './PageHeader';
import { DescriptionList } from './DescriptionList';
import { Timeline } from './Timeline';
import { Calendar } from './Calendar';
import { FormSection } from './FormSection';
import { Menu } from './Menu';
import { ObjectCard } from './ObjectCard';
import { Tree, type TreeNodeData } from './Tree';
import { HierarchyExplorer } from './HierarchyExplorer';
import { SectionHeader } from './SectionHeader';
import { Breadcrumb } from './Breadcrumb';
import { PageGrid } from './PageGrid';

const opts = [
  { label: '합판', value: 'plywood' },
  { label: 'MDF', value: 'mdf' },
  { label: '집성목', value: 'glulam' },
];

function Box({ children }: { children?: ReactNode }) {
  return (
    <div style={{ background: 'var(--mantine-color-primary-1)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: 4, textAlign: 'center', fontSize: 13 }}>
      {children ?? '·'}
    </div>
  );
}

const SAMPLE_TREE: TreeNodeData[] = [
  { id: 'd1', label: '현장', children: [
    { id: 'd1-1', label: '강남 현장' },
    { id: 'd1-2', label: '판교 현장' },
  ] },
  { id: 'd2', label: '거래처', children: [{ id: 'd2-1', label: '가구상사' }] },
];

const IMG_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90"><rect width="120" height="90" fill="#3b5ba5"/><text x="60" y="50" fill="#fff" font-size="14" text-anchor="middle">IMG</text></svg>');

// 부품명 → 라이브 예시. 박물관 상세가 <Demo name/>로 렌더.
export function Demo({ name }: { name: string }) {
  const [chip, setChip] = useState(true);
  const [pop, setPop] = useState(false);
  const [seg, setSeg] = useState('plywood');
  const [tab, setTab] = useState('plywood');
  const [txt, setTxt] = useState('');
  const [pw, setPw] = useState('');
  const [num, setNum] = useState<number | string>('');
  const [area, setArea] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [mdate, setMdate] = useState<string[]>([]);
  const [chk, setChk] = useState(false);
  const [sw, setSw] = useState(true);
  const [rad, setRad] = useState('plywood');
  const [ff, setFf] = useState('');
  const [multi, setMulti] = useState<string[]>(['plywood']);
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [grp, setGrp] = useState('');
  const [files, setFiles] = useState<FileItem[]>([
    { id: 'a', name: '도면.pdf', status: 'done' },
    { id: 'b', name: '사양.xlsx', status: 'uploading', progress: 60 },
  ]);
  const [page, setPage] = useState(2);
  const [modal, setModal] = useState(false);
  const [month, setMonth] = useState('2026-06');
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [dtSel, setDtSel] = useState<string[]>([]);
  const [treeSel, setTreeSel] = useState<string | null>('d1-1');
  const [treeExp, setTreeExp] = useState<string[]>(['d1']);
  const toggleExp = (id: string) => setTreeExp((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const D: Record<string, ReactNode> = {
    Button: <Group gap="xs" wrap><Button variant="primary">저장</Button><Button variant="secondary">취소</Button><Button variant="danger">삭제</Button><Button variant="ghost">더보기</Button></Group>,
    Badge: <Group gap="xs"><Badge color="success">완료</Badge><Badge color="warning">대기</Badge><Badge color="danger">실패</Badge><Badge color="info">신규</Badge></Group>,
    Chip: <Chip color="info" selected={chip} onChange={() => setChip((v) => !v)} onRemove={() => {}}>합판</Chip>,
    Text: <Stack gap="xxs"><Text variant="body">본문(body)</Text><Text variant="body-strong">강조(body-strong)</Text><Text variant="caption" color="secondary">보조(caption)</Text></Stack>,
    Title: <Stack gap="xxs"><Title variant="display">Display</Title><Title variant="heading">Heading</Title><Title variant="subheading">Subheading</Title></Stack>,
    Label: <Label htmlFor="x">담당자 이름</Label>,
    Anchor: <Anchor href="#">상세 페이지로 이동</Anchor>,
    Icon: <Group gap="sm"><Icon name="check-circle" /><Icon name="bell" color="danger" /><Icon name="settings" size="lg" /></Group>,
    Avatar: <Group gap="xs"><Avatar>김</Avatar><Avatar size="sm">병</Avatar><Avatar size="lg">준</Avatar></Group>,
    Image: <Image src={IMG_SRC} alt="예시" size="sm" />,
    Tooltip: <Tooltip label="도움말 텍스트"><Button variant="secondary">hover 해보기</Button></Tooltip>,
    Popover: <Popover opened={pop} onChange={setPop} content={<Card variant="outlined" padding="sm"><Text variant="body">슬롯 안은 부품으로</Text></Card>}><Button variant="secondary" onClick={() => setPop((v) => !v)}>클릭</Button></Popover>,
    Spinner: <Spinner />,
    SegmentedControl: <SegmentedControl options={opts} value={seg} onChange={setSeg} />,
    TabBar: <TabBar options={opts} value={tab} onChange={setTab} />,
    TextInput: <TextInput value={txt} onChange={setTxt} placeholder="이름 입력" />,
    PasswordInput: <PasswordInput value={pw} onChange={setPw} placeholder="비밀번호" />,
    NumberInput: <NumberInput value={num} onChange={setNum} placeholder="수량" />,
    Textarea: <Textarea value={area} onChange={setArea} placeholder="메모" autosize />,
    Select: <Select options={opts} value={sel} onChange={setSel} placeholder="자재 선택" />,
    DatePicker: <DatePicker value={date} onChange={setDate} placeholder="날짜" />,
    MultiDatePicker: <MultiDatePicker value={mdate} onChange={setMdate} placeholder="여러 날짜" />,
    Checkbox: <Checkbox label="동의합니다" checked={chk} onChange={setChk} />,
    Switch: <Switch label="알림 받기" checked={sw} onChange={setSw} />,
    Radio: <Radio options={opts} value={rad} onChange={setRad} />,
    Card: <Group gap="sm"><Card variant="elevated" padding="md"><Text variant="body">elevated</Text></Card><Card variant="outlined" padding="md"><Text variant="body">outlined</Text></Card><Card variant="flat" padding="md"><Text variant="body">flat</Text></Card></Group>,
    Divider: <div style={{ width: 240 }}><Divider /></div>,
    Container: <Card variant="flat" padding="sm"><Box>narrow 천장 + 가운데</Box></Card>,
    Stack: <div style={{ width: 200 }}><Stack gap="xs"><Box>1</Box><Box>2</Box><Box>3</Box></Stack></div>,
    Group: <Group gap="xs"><Box>A</Box><Box>B</Box><Box>C</Box></Group>,
    Grid: <Grid columns={3} gap="xs"><Grid.Col span={1}><Box>1</Box></Grid.Col><Grid.Col span={2}><Box>span 2</Box></Grid.Col></Grid>,
    FormField: <FormField label="이메일" withAsterisk error={ff && !ff.includes('@') ? '형식이 올바르지 않습니다' : undefined}><TextInput value={ff} onChange={setFf} placeholder="user@kk.co.kr" /></FormField>,
    MultiSelect: <MultiSelect options={opts} value={multi} onChange={setMulti} placeholder="자재(복수)" />,
    DateRangeField: <DateRangeField value={range} onChange={setRange} startPlaceholder="시작" endPlaceholder="끝" />,
    InputGroup: <InputGroup rightAddon="원"><NumberInput value={grp} onChange={(v) => setGrp(String(v))} placeholder="금액" /></InputGroup>,
    FileUploader: <FileUploader value={files} onChange={setFiles} multiple accept=".pdf,.xlsx,image/*" maxSize={5 * 1024 * 1024} />,
    Pagination: <Pagination total={10} value={page} onChange={setPage} />,
    IconButton: <Group gap="xs"><IconButton icon="settings" label="설정" variant="secondary" /><IconButton icon="trash" label="삭제" variant="danger" /><IconButton icon="dots" label="더보기" variant="ghost" /></Group>,
    Callout: <Callout tone="warning" title="중복 연락처">같은 번호가 이미 등록되어 있습니다.</Callout>,
    StatusRow: <StatusRow label="발주서 #1024" icon="file-text" status={{ label: '승인 대기', tone: 'warning' }} actions={[{ label: '승인', variant: 'primary', onClick: () => {} }, { label: '반려', variant: 'ghost', onClick: () => {} }]} />,
    SummaryCard: <div style={{ width: 220 }}><SummaryCard label="승인 대기" icon="clock" tone="warning" count={12} amount={3400000} /></div>,
    TotalRow: <div style={{ width: 280 }}><TotalRow amount={3400000} /></div>,
    Modal: (
      <>
        <Button variant="secondary" onClick={() => setModal(true)}>모달 열기</Button>
        <Modal opened={modal} onClose={() => setModal(false)} title="신규 등록" actions={[{ label: '취소', variant: 'ghost', onClick: () => setModal(false) }, { label: '저장', variant: 'primary', onClick: () => setModal(false) }]}>
          <Text variant="body">본문(children)에 도메인 폼이 온다. Modal은 그게 뭔지 모른다.</Text>
        </Modal>
      </>
    ),
    DataTable: (
      <DataTable
        selectable
        selectedIds={dtSel}
        onSelectionChange={setDtSel}
        bulkActions={[{ label: '삭제', variant: 'danger', icon: 'trash', iconOnly: true, onClick: () => setDtSel([]) }]}
        columns={[
          { key: 'name', label: '거래처', type: 'text', sortable: true },
          { key: 'owner', label: '담당', type: 'user' },
          { key: 'tags', label: '태그', type: 'tags' },
          { key: 'rate', label: '달성률', type: 'percent', sortable: true },
          { key: 'amount', label: '금액', type: 'currency', sortable: true },
        ]}
        rows={[
          { id: '1', name: '가구상사', owner: { name: '김병준' }, tags: ['B2B', '우수'], rate: 92, amount: 1200000 },
          { id: '2', name: '목재유통', owner: { name: '이수연' }, tags: ['B2C'], rate: 47, amount: 880000 },
        ]}
        status="ready"
      />
    ),
    EmptyState: <EmptyState icon="box" title="등록된 발주가 없습니다" description="신규 발주를 만들어 시작하세요." action={{ label: '신규 발주', variant: 'primary', onClick: () => {} }} />,
    PageHeader: <PageHeader title="고객 관리" description="유입경로 · 2026-05-02 등록" status={{ label: '활성', tone: 'success' }} actions={[{ label: '신규 고객', variant: 'primary', icon: 'user', onClick: () => {} }]} />,
    DescriptionList: <DescriptionList columns={2} items={[{ label: '거래처명', value: '가구상사', type: 'text' }, { label: '상태', value: '확정', type: 'badge', badgeColors: { 확정: 'success' } }, { label: '담당자', value: '김병준', type: 'text' }, { label: '계약일', value: '2026-05-02', type: 'date' }]} />,
    Timeline: <Timeline events={[{ id: '1', timestamp: '2026-06-15T09:00:00', actor: { name: '김병준' }, category: { label: '발주', tone: 'info' }, title: '발주서 생성', body: '#1024 생성됨' }, { id: '2', timestamp: '2026-06-16T14:30:00', actor: { name: '이수연' }, category: { label: '승인', tone: 'success' }, title: '승인 완료' }]} />,
    Calendar: <Calendar month={month} onMonthChange={setMonth} events={[{ id: '1', date: '2026-06-10', label: 'A현장 납품', tone: 'info' }, { id: '2', date: '2026-06-18', label: 'B현장 시공', tone: 'success' }]} />,
    FormSection: (
      <FormSection
        columns={2}
        fields={[
          { name: 'company', label: '거래처명', type: 'text', required: true },
          { name: 'phone', label: '연락처', type: 'text', mask: 'phone' },
          { name: 'material', label: '주요 자재', type: 'select', options: opts },
          { name: 'memo', label: '메모', type: 'textarea', span: 2 },
        ]}
        values={form}
        onChange={(n, value) => setForm((s) => ({ ...s, [n]: value }))}
      />
    ),
    ListPage: <Anchor href="/customers">→ /customers 에서 라이브 (스키마 구동 목록)</Anchor>,
    DetailPage: <Anchor href="/customers">→ /customers/[id] 에서 라이브 (정보+폼 2분할)</Anchor>,
    Menu: <Menu trigger={<IconButton icon="dots-vertical" label="메뉴" variant="secondary" />} items={[{ label: '수정', icon: 'edit', onClick: () => {} }, { label: '복제', icon: 'copy', onClick: () => {} }, { label: '삭제', icon: 'trash', variant: 'danger', onClick: () => {} }]} />,
    ObjectCard: <div style={{ width: 240 }}><ObjectCard title="자작나무 합판 18T" subtitle="SKU-0421" thumbnail={IMG_SRC} badge={{ label: '판매중', tone: 'success' }} fields={[{ label: '가격', value: 120000, type: 'currency', note: { label: '변경요청중', tone: 'warning' } }, { label: '단위', value: 'EA', type: 'text' }]} actions={[{ label: '수정', variant: 'secondary', icon: 'edit', onClick: () => {} }]} /></div>,
    Tree: <div style={{ width: 300 }}><Tree nodes={SAMPLE_TREE} selectedId={treeSel} expandedIds={treeExp} onSelect={setTreeSel} onToggle={toggleExp} title="디렉토리" editable onAddRoot={() => {}} onAddChild={() => {}} onRename={() => {}} onDelete={() => {}} /></div>,
    HierarchyExplorer: (
      <HierarchyExplorer
        title="자재 계층" description="현장·거래처별 품목 디렉토리"
        nodes={SAMPLE_TREE} selectedId={treeSel} expandedIds={treeExp} onSelect={setTreeSel} onToggle={toggleExp}
        editable treeTitle="공간" selectedLabel="강남 현장"
        objects={treeSel ? [
          { id: 'o1', title: '거실 도면', subtitle: 'rev.2', badge: { label: '승인', tone: 'success' }, fields: [{ label: '면적', value: 32, type: 'number' }, { label: '수정일', value: '2026-06-10', type: 'date' }] },
          { id: 'o2', title: '주방 도면', subtitle: 'rev.1', fields: [{ label: '면적', value: 18, type: 'number', note: { label: '검토중', tone: 'warning' } }] },
        ] : []}
        onAddObject={() => {}}
      />
    ),
    SectionHeader: <div style={{ width: 360 }}><Card variant="elevated" padding="md"><SectionHeader title="강남 현장" description="rev.2 · 2026-05-02 등록" divider actions={[{ label: '추가', variant: 'primary', icon: 'plus', onClick: () => {} }]} /></Card></div>,
    Breadcrumb: <Breadcrumb items={[{ label: '현장', onClick: () => {} }, { label: '강남 현장', onClick: () => {} }, { label: '도면' }]} />,
    PageGrid: (() => {
      // 고정 셀을 보이게 가득 채우는 데모 타일.
      const cell = (t: string) => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mantine-color-primary-1)', color: 'var(--text-primary)', borderRadius: 4, fontSize: 13 }}>{t}</div>;
      return (
        <PageGrid columns={4} gap="md">
          <PageGrid.Tile colSpan={1}>{cell('1×1')}</PageGrid.Tile>
          <PageGrid.Tile colSpan={2}>{cell('colSpan 2')}</PageGrid.Tile>
          <PageGrid.Tile colSpan={1} rowSpan={2}>{cell('1×2')}</PageGrid.Tile>
          <PageGrid.Tile colSpan={3}>{cell('colSpan 3')}</PageGrid.Tile>
        </PageGrid>
      );
    })(),
  };

  return <>{D[name] ?? <Text variant="caption" color="secondary">예시 준비 중</Text>}</>;
}
