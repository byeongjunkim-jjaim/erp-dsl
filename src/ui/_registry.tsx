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
import { CountBadge } from './CountBadge';
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
import { CurrencyInput } from './CurrencyInput';
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
import { fmtCurrency } from './_cells';
import { Pagination } from './Pagination';
import { IconButton } from './IconButton';
import { Callout } from './Callout';
import { StatusRow } from './StatusRow';
import { SummaryCard } from './SummaryCard';
import { TotalRow } from './TotalRow';
import { Collapsible } from './Collapsible';
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
import { FieldGrid } from './FieldGrid';
import { HierarchyExplorer, type HierarchyObject } from './HierarchyExplorer';
import { PeriodNavigator } from './PeriodNavigator';
import { LedgerPage } from './LedgerPage';
import { SectionHeader } from './SectionHeader';
import { Breadcrumb } from './Breadcrumb';
import { PageGrid } from './PageGrid';
import { Accordion } from './Accordion';
import { Drawer } from './Drawer';
import { Skeleton } from './Skeleton';
import { Combobox } from './Combobox';
import { Progress } from './Progress';
import { TimePicker } from './TimePicker';
import { Stat } from './Stat';
import { Stepper } from './Stepper';
import { Transfer } from './Transfer';
import { TreeSelect } from './TreeSelect';
import { Cascader } from './Cascader';
import { MillerColumns } from './MillerColumns';
import { SearchToolbar } from './SearchToolbar';
import { notify } from './notify';

const opts = [
  { label: '합판', value: 'plywood' },
  { label: 'MDF', value: 'mdf' },
  { label: '집성목', value: 'glulam' },
];

const CASC_OPTS = [
  { value: 'seoul', label: '서울', children: [
    { value: 'gangnam', label: '강남구', children: [{ value: 'samsung', label: '삼성동' }, { value: 'yeoksam', label: '역삼동' }] },
    { value: 'mapo', label: '마포구', children: [{ value: 'hapjeong', label: '합정동' }] },
  ] },
  { value: 'gyeonggi', label: '경기', children: [{ value: 'seongnam', label: '성남시', children: [{ value: 'pangyo', label: '판교' }] }] },
];
const XFER_ITEMS = [
  { value: 'plywood', label: '합판' }, { value: 'mdf', label: 'MDF' }, { value: 'glulam', label: '집성목' },
  { value: 'veneer', label: '베니어' }, { value: 'osb', label: 'OSB' },
];

function Box({ children }: { children?: ReactNode }) {
  return (
    <div style={{ background: 'var(--mantine-color-primary-1)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: 4, textAlign: 'center', fontSize: 13 }}>
      {children ?? '·'}
    </div>
  );
}

// 비포/애프터 — 부품 정형화 시 '기존 ↔ 수정안'을 같은 탭에서 나란히 본다(삭제 전 검증용).
//  좌: 현행(땜빵/직접 조립) · 우: 신규 부품 적용. dev 전용 비교 슬롯.
function BeforeAfter({ before, after }: { before: ReactNode; after: ReactNode }) {
  const col = (tag: string, tone: 'neutral' | 'success', node: ReactNode) => (
    <div style={{ flex: 1, minWidth: 280 }}>
      <Stack gap="xs">
        <Group gap="xs" align="center"><Badge color={tone}>{tag}</Badge></Group>
        <Card variant="outlined" padding="md">{node}</Card>
      </Stack>
    </div>
  );
  return (
    <Group gap="lg" align="start" wrap>
      {col('기존', 'neutral', before)}
      {col('수정안', 'success', after)}
    </Group>
  );
}

// kk ERP 도메인(철물/부자재) — 캡쳐의 '경첩'처럼 최하위 분류에 제품을 등록한다. 더미 양 늘려 폴더 타일(4분할)·목록 스크롤 확인용.
const SAMPLE_TREE: TreeNodeData[] = [
  { id: 'd1', label: '부자재', children: [
    { id: 'd1-1', label: '경첩' },
    { id: 'd1-2', label: '손잡이' },
    { id: 'd1-3', label: '레일' },
    { id: 'd1-4', label: '브라켓' },
    { id: 'd1-5', label: '댐퍼' },
    { id: 'd1-6', label: '자석·캐치' },
    { id: 'd1-7', label: '볼트·너트' },
    { id: 'd1-8', label: '타카·핀' },
    { id: 'd1-9', label: '경첩 액세서리' },
  ] },
  { id: 'd2', label: '거래처', children: [
    { id: 'd2-1', label: '동양철물' },
    { id: 'd2-2', label: '세양하드웨어' },
    { id: 'd2-3', label: '대한철물' },
    { id: 'd2-4', label: '광성특수' },
  ] },
  { id: 'd3', label: '공구', children: [
    { id: 'd3-1', label: '전동공구' },
    { id: 'd3-2', label: '수공구' },
    { id: 'd3-3', label: '측정공구' },
  ] },
  { id: 'd4', label: '소모품', children: [
    { id: 'd4-1', label: '접착·실란트' },
    { id: 'd4-2', label: '연마재' },
  ] },
];

// viewBox 필수 — 없으면 컨테이너 비율로 SVG가 늘어나(반응형 스케일 불가) 미디어 밴드에서 찌그러진다.
const IMG_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" width="120" height="90"><rect width="120" height="90" fill="#3b5ba5"/><text x="60" y="50" fill="#fff" font-size="14" text-anchor="middle">IMG</text></svg>');

// HierarchyExplorer 데모 데이터(kk ERP 철물/부자재) — 잎별 오브젝트 + 경로(검색 결과용).
//  역할 슬롯: 썸네일 없으면 폴백 아이콘 / status=상태 배지 / headline=핵심값 1개 / attributes=보조(상세 뷰만).
//  ※ 단위는 *데이터 층*에서 단가 뒤에 합성("₩3,200 / 개") — 한 칸 차지할 값이 아니다. ObjectCard(DSL)는 단위를
//    모른다(완성된 텍스트만 받음). 그래서 type:'text'. 단가 합성은 fmtCurrency로 통화 포맷 단일출처 유지.
const won = (n: number, unit: string) => `${fmtCurrency(n)} / ${unit}`;
// 중첩 트리에 자식 노드 추가 / id로 경로(브레드크럼) 찾기 — 데모의 분류 추가·검색 결과 경로용(순수 헬퍼).
function addChildNode(nodes: TreeNodeData[], parentId: string, child: TreeNodeData): TreeNodeData[] {
  return nodes.map((n) =>
    n.id === parentId ? { ...n, children: [...(n.children ?? []), child] }
      : n.children ? { ...n, children: addChildNode(n.children, parentId, child) } : n);
}
function pathOf(nodes: TreeNodeData[], id: string, trail: { id: string; label: string }[] = []): { id: string; label: string }[] | null {
  for (const n of nodes) {
    const t = [...trail, { id: n.id, label: n.label }];
    if (n.id === id) return t;
    if (n.children) { const r = pathOf(n.children, id, t); if (r) return r; }
  }
  return null;
}
// 더미 제품 생성기 — 디렉토리별로 N개를 양산(목록 스크롤 확인용). 상태·비고 배지·단가를 i로 변주해 컬럼이 다 차게.
const HX_STATUSES: HierarchyObject['status'][] = [
  { label: '판매중', tone: 'success' }, { label: '견적대기', tone: 'warning' },
  { label: '신규', tone: 'info' }, { label: '단종', tone: 'danger' }, { label: '판매중', tone: 'success' },
];
const HX_MATERIALS = ['STS304', '아연도금', '알루미늄', '황동', '냉간압연', '고무나무'];
function genProducts(idBase: string, code: string, titlePrefix: string, n: number): HierarchyObject[] {
  return Array.from({ length: n }, (_, i): HierarchyObject => ({
    id: `${idBase}#${i}`,
    title: `${titlePrefix} ${String.fromCharCode(65 + (i % 26))}형 ${i + 1}호`,
    subtitle: `${code}-${String(i + 1).padStart(3, '0')}`,
    icon: 'package',
    status: HX_STATUSES[i % HX_STATUSES.length],
    headline: {
      label: '단가', type: 'text',
      value: i % 7 === 3 ? '견적 필요' : won(1000 + ((i * 437) % 90) * 100, '개'),
      note: i % 6 === 0 ? { label: '변경요청중', tone: 'warning' } : undefined,
    },
    attributes: [
      { label: '규격', value: `${20 + (i % 12) * 5}mm`, type: 'text' },
      { label: '재질', value: HX_MATERIALS[i % HX_MATERIALS.length], type: 'text' },
    ],
    // 행 액션(수정·삭제)은 목록 케밥이 아니라 *상세 모달 안*에서 — 목록 끝은 디스클로저(›)만(상세로 인도하는 시각 장치).
  }));
}
// 디렉토리 id → 직속 제품. 부자재(d1)는 하위 분류 + 직속 제품 공존(잎/폴더 이분법 없음 시연). d2-2 등 일부는 비워 빈상태 확인.
const HX_OBJECTS: Record<string, HierarchyObject[]> = {
  d1: genProducts('d1', 'HW-GEN', '범용 부자재', 7),
  'd1-1': genProducts('d1-1', 'HG', '경첩', 24),
  'd1-2': genProducts('d1-2', 'HD', '손잡이', 16),
  'd1-3': genProducts('d1-3', 'RL', '레일', 13),
  'd1-4': genProducts('d1-4', 'BK', '브라켓', 9),
  'd1-5': genProducts('d1-5', 'DP', '댐퍼', 7),
  'd1-6': genProducts('d1-6', 'MC', '자석캐치', 5),
  'd1-7': genProducts('d1-7', 'BN', '볼트너트', 31),
  'd1-8': genProducts('d1-8', 'TP', '타카핀', 11),
  'd2-1': genProducts('d2-1', 'OY', '동양철물 납품', 8),
  'd2-3': genProducts('d2-3', 'DH', '대한철물 납품', 6),
  'd3-1': genProducts('d3-1', 'PT', '전동공구', 14),
  'd3-2': genProducts('d3-2', 'HT', '수공구', 19),
  'd3-3': genProducts('d3-3', 'MT', '측정공구', 6),
  'd4-1': genProducts('d4-1', 'SL', '실란트', 5),
};

// 부품명 → 라이브 예시. 박물관 상세가 <Demo name/>로 렌더.
export function Demo({ name }: { name: string }) {
  const [chip, setChip] = useState(true);
  const [pop, setPop] = useState(false);
  const [seg, setSeg] = useState('plywood');
  const [tab, setTab] = useState('plywood');
  const [txt, setTxt] = useState('');
  const [pw, setPw] = useState('');
  const [num, setNum] = useState<number | string>('');
  const [cur, setCur] = useState<number | string>(3200);
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
  const [dwBefore, setDwBefore] = useState(false);
  const [dwAfter, setDwAfter] = useState(false);
  const [cbo, setCbo] = useState<string | null>(null);
  const [time, setTime] = useState('');
  const [stp, setStp] = useState(1);
  const [xfer, setXfer] = useState<string[]>(['mdf']);
  const [tsel, setTsel] = useState<string | null>(null);
  const [casc, setCasc] = useState<string[]>([]);
  const [mcol, setMcol] = useState<string[]>([]);
  const [stbSearch, setStbSearch] = useState('');
  const [stbStatus, setStbStatus] = useState<string | null>(null);
  const [month, setMonth] = useState('2026-06');
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [dtSel, setDtSel] = useState<string[]>([]);
  const [treeSel, setTreeSel] = useState<string | null>('d1');
  const [treeExp, setTreeExp] = useState<string[]>(['d1']);
  const [hxSearch, setHxSearch] = useState('');
  const [hxDetail, setHxDetail] = useState<HierarchyObject | null>(null);
  const [hxNodes, setHxNodes] = useState<TreeNodeData[]>(SAMPLE_TREE);
  const [hxObjMap, setHxObjMap] = useState<Record<string, HierarchyObject[]>>(() => ({ ...HX_OBJECTS }));
  const [addKind, setAddKind] = useState<null | 'product' | 'dir'>(null);
  const [addName, setAddName] = useState('');
  const [ledgerMonth, setLedgerMonth] = useState(6);
  const [ledgerTab, setLedgerTab] = useState('item');
  const [ledgerSel, setLedgerSel] = useState<string | null>(null);
  const toggleExp = (id: string) => setTreeExp((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  const [fgMode, setFgMode] = useState<'edit' | 'read'>('edit');
  const [fgVals, setFgVals] = useState<Record<string, unknown>>({
    site: '서울 송파구 장지동 308-204', manager: '인연지', phone: '010-8108-0626',
    useDate: '2026-03-11', door: 'kei', usage: '주방&냉장고장&아일랜드, 화장대, 현장칠, 도어',
  });

  const D: Record<string, ReactNode> = {
    Button: <Group gap="xs" wrap><Button variant="primary">저장</Button><Button variant="secondary">취소</Button><Button variant="danger">삭제</Button><Button variant="ghost">더보기</Button></Group>,
    Badge: <Group gap="xs"><Badge color="success">완료</Badge><Badge color="warning">대기</Badge><Badge color="danger">실패</Badge><Badge color="info">신규</Badge></Group>,
    CountBadge: (
      <Stack gap="sm">
        {/* 탭 라벨 뒤 카운트 — 행동요구(빨강)만 튀고 정보(중립)는 가라앉는다. 0건은 안 보임. */}
        <Group gap="lg" align="center">
          <Group gap="xs" align="center"><Text variant="body-strong">새 주문</Text><CountBadge count={1} /></Group>
          <Group gap="xs" align="center"><Text variant="body" color="secondary">진행 중</Text><CountBadge count={3} tone="neutral" /></Group>
          <Group gap="xs" align="center"><Text variant="body" color="secondary">완료</Text><CountBadge count={0} /></Group>
        </Group>
        {/* 점(dot) 모드 + 99+ 캡 */}
        <Group gap="lg" align="center">
          <Group gap="xs" align="center"><Text variant="body">발주</Text><CountBadge count={5} dot /></Group>
          <CountBadge count={128} />
        </Group>
      </Stack>
    ),
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
    TabBar: <TabBar options={[{ ...opts[0], count: 2 }, opts[1], opts[2]]} value={tab} onChange={setTab} />,
    TextInput: <TextInput value={txt} onChange={setTxt} placeholder="이름 입력" />,
    PasswordInput: <PasswordInput value={pw} onChange={setPw} placeholder="비밀번호" />,
    NumberInput: <NumberInput value={num} onChange={setNum} placeholder="수량" />,
    CurrencyInput: <CurrencyInput value={cur} onChange={setCur} placeholder="단가" />,
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
    Collapsible: (
      // 정산 사용례 — 발주 한 건당 요약행(StatusRow) 헤더, 펼치면 품목 줄들 + 소계(TotalRow). 쌓아서 요약 목록.
      <div style={{ width: 440, display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-sm)' }}>
        <Collapsible defaultOpen header={<StatusRow label="발주서 #1024" icon="file-text" status={{ label: '완료', tone: 'success' }} />}>
          <Stack gap="xs">
            <Group justify="between"><Text variant="body">합판 24T × 50</Text><Text variant="body">₩1,200,000</Text></Group>
            <Group justify="between"><Text variant="body">경첩 × 200</Text><Text variant="body">₩800,000</Text></Group>
            <TotalRow amount={2000000} />
          </Stack>
        </Collapsible>
        <Collapsible header={<StatusRow label="발주서 #1025" icon="file-text" status={{ label: '진행', tone: 'info' }} />}>
          <Text variant="body">기본 접힘 — 헤더를 누르면 펼쳐집니다.</Text>
        </Collapsible>
      </div>
    ),
    Accordion: (
      // 윤곽 최소·그림자 위주. 기본=회색(bg-tertiary)+그림자, 강조(첫 행)=틴트 채움+얇은 틴트 윤곽+그림자(좌측 띠 없음).
      //  clearAttentionOnOpen: 강조 행을 펼치면(=봤음) 기본 회색으로 페이드 해제. 펼침 조율은 하나만 열림(multiple 아님).
      <div style={{ width: 440 }}>
        <Accordion
          clearAttentionOnOpen
          items={[
            { value: 'basic', label: <StatusRow label="기본 정보" icon="file-text" status={{ label: '필수', tone: 'info' }} />, children: <Text variant="body">상호 · 사업자번호 · 대표자</Text>, tone: 'attention' },
            { value: 'owner', label: <StatusRow label="담당자" icon="user" status={{ label: '선택', tone: 'neutral' }} />, children: <Text variant="body">이름 · 연락처 · 이메일</Text> },
            { value: 'config', label: <StatusRow label="환경설정" icon="settings" status={{ label: '선택', tone: 'neutral' }} />, children: <Text variant="body">여신한도 · 결제일</Text> },
          ]}
        />
      </div>
    ),
    Modal: (
      <>
        <Button variant="secondary" onClick={() => setModal(true)}>모달 열기</Button>
        <Modal opened={modal} onClose={() => setModal(false)} title="신규 등록" actions={[{ label: '취소', variant: 'ghost', onClick: () => setModal(false) }, { label: '저장', variant: 'primary', onClick: () => setModal(false) }]}>
          <Text variant="body">본문(children)에 도메인 폼이 온다. Modal은 그게 뭔지 모른다.</Text>
        </Modal>
      </>
    ),
    Drawer: (
      // 단독 부품(신규, 기존 대체 아님). 기준: 뒤 화면이 보여야 하면 Drawer / 가려도 되면(차단) Modal.
      <Stack gap="xs">
        <Text variant="caption" color="secondary">맥락(목록·상세)을 유지한 채 가장자리에서 보조작업. position으로 좌/우/상/하.</Text>
        <Group gap="xs" wrap>
          <Button variant="secondary" onClick={() => setDwAfter(true)}>우측 상세 Drawer</Button>
          <Button variant="ghost" onClick={() => setDwBefore(true)}>좌측 필터 Drawer</Button>
        </Group>
        <Drawer opened={dwAfter} onClose={() => setDwAfter(false)} position="right" title="거래처 상세" actions={[{ label: '닫기', variant: 'ghost', onClick: () => setDwAfter(false) }, { label: '저장', variant: 'primary', onClick: () => setDwAfter(false) }]}>
          <Text variant="body">우측에서 슬라이드 — 뒤 목록 맥락을 유지한 채 편집.</Text>
        </Drawer>
        <Drawer opened={dwBefore} onClose={() => setDwBefore(false)} position="left" title="필터" actions={[{ label: '적용', variant: 'primary', onClick: () => setDwBefore(false) }]}>
          <Text variant="body">좌측 필터 패널 예시.</Text>
        </Drawer>
      </Stack>
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
    Skeleton: (
      // 정형화 비교 — 기존: 로딩 시 점 하나(Spinner)로 레이아웃 붕괴. 수정안: 실제 행 구조를 흉내낸 Skeleton(레이아웃 유지).
      <BeforeAfter
        before={
          <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner />
          </div>
        }
        after={
          <Stack gap="sm">
            {[0, 1, 2].map((i) => (
              <Group key={i} gap="sm" align="center" wrap={false}>
                <Skeleton variant="circle" size="sm" />
                <div style={{ flex: 1 }}><Skeleton variant="text" lines={2} /></div>
              </Group>
            ))}
          </Stack>
        }
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
    FieldGrid: (
      // 단독(신규) — 테두리 셀 격자(장표). 작성↔확인 토글로 "같은 크기·같은 뷰" 확인(셀 박스 기하 불변, 값만 스왑).
      <Stack gap="sm">
        <Group justify="between" align="center">
          <Text variant="caption" color="secondary">테두리 셀 격자(장표) — 작성/확인이 같은 크기·같은 뷰</Text>
          <SegmentedControl size="sm" value={fgMode} onChange={(v) => setFgMode(v as 'edit' | 'read')}
            options={[{ label: '작성', value: 'edit' }, { label: '확인', value: 'read' }]} />
        </Group>
        <FieldGrid
          columns={4}
          mode={fgMode}
          values={fgVals}
          onChange={(n, v) => setFgVals((s) => ({ ...s, [n]: v }))}
          fields={[
            { name: 'site', label: '현장주소', type: 'text' },
            { name: 'manager', label: '발주담당자', type: 'text' },
            { name: 'phone', label: '연락처', type: 'text', mask: 'phone' },
            { name: 'useDate', label: '사용일', type: 'date' },
            { name: 'door', label: '도어재작', type: 'select', options: [{ label: '케이산업', value: 'kei' }, { label: '미정', value: 'tbd' }] },
            { name: 'usage', label: '사용용도', type: 'textarea' },
          ]}
          rows={[
            [{ label: '현장주소' }, { field: 'site', colSpan: 3 }],
            [{ label: '발주담당자' }, { field: 'manager' }, { label: '연락처' }, { field: 'phone' }],
            [{ label: '사용일' }, { field: 'useDate' }, { label: '도어재작' }, { field: 'door' }],
            [{ label: '사용용도' }, { field: 'usage', colSpan: 3 }],
            // node 셀 — 스키마 필드로 안 떨어지는 비표준 컨트롤(여기선 Cascader)을 통째로 한 칸에. label/field/image와 배타, mode 무관 그대로 렌더.
            [{ label: '지역' }, { node: <Cascader options={CASC_OPTS} value={casc} onChange={setCasc} placeholder="지역 선택" />, colSpan: 3 }],
          ]}
        />
      </Stack>
    ),
    ListPage: <Anchor href="/customers">→ /customers 에서 라이브 (스키마 구동 목록)</Anchor>,
    DetailPage: <Anchor href="/customers">→ /customers/[id] 에서 라이브 (정보+폼 2분할)</Anchor>,
    Combobox: (
      <BeforeAfter
        before={<Select options={opts} value={cbo} onChange={setCbo} placeholder="Select (검색 불가)" />}
        after={<Combobox options={opts} value={cbo} onChange={setCbo} placeholder="Combobox (타이핑 검색)" />}
      />
    ),
    Progress: (
      // 단독(신규) — 결정형(%) 진행. 끝 모르는 로딩은 Spinner(대체 아님, 별개 축).
      <Stack gap="xxs">
        <Text variant="caption" color="secondary">결정형 진행률(0~100). 끝 모르는 로딩은 Spinner.</Text>
        <div style={{ width: 320 }}><Progress value={68} /></div>
      </Stack>
    ),
    TimePicker: (
      // 단독(신규) — 시각 입력 축(날짜=DatePicker와 별개).
      <Stack gap="xxs">
        <Text variant="caption" color="secondary">시각 입력(HH:MM).</Text>
        <TimePicker value={time} onChange={setTime} />
      </Stack>
    ),
    Stat: (
      // 단독(신규) — SummaryCard와 형제. 건수/금액 요약=SummaryCard, 단일 지표+추세=Stat.
      <Stack gap="xxs">
        <Text variant="caption" color="secondary">단일 지표 + 추세·델타(SummaryCard와 형제).</Text>
        <div style={{ width: 240 }}><Stat label="이번 달 매출" value="₩34,000,000" trend="up" delta="12.4%" icon="check-circle" /></div>
      </Stack>
    ),
    Stepper: (
      // 단독(신규) — 다단계 진행 표시(controlled active). 단계 콘텐츠는 호출측이 active로 분기.
      <Stack gap="xxs">
        <Text variant="caption" color="secondary">등록 마법사 등 다단계 흐름. 노드 클릭으로 이동.</Text>
        <Stepper active={stp} onStepClick={setStp} steps={[{ label: '기본 정보' }, { label: '연락처' }, { label: '확인' }]} />
      </Stack>
    ),
    Transfer: (
      // 단독 부품(신규) — MultiSelect와 독립. 대량 항목을 양쪽 리스트로 옮길 때(MultiSelect=인라인 태그 다중).
      <Stack gap="xxs">
        <Text variant="caption" color="secondary">대량 항목 양쪽 배정(MultiSelect와 독립)</Text>
        <div style={{ width: 640 }}>
          <Transfer items={XFER_ITEMS} selected={xfer} onChange={setXfer} titles={['자재 후보', '선택 자재']} />
        </div>
      </Stack>
    ),
    TreeSelect: (
      // 단독 부품(신규) — Tree와 독립. Tree=파인더/표시(HierarchyExplorer·dev 좌측 패널), TreeSelect=노드를 값으로 고르는 입력.
      <Stack gap="xxs">
        <Text variant="caption" color="secondary">계층에서 노드 하나를 값으로 선택(Tree와 독립)</Text>
        <TreeSelect nodes={SAMPLE_TREE} value={tsel} onChange={setTsel} placeholder="디렉토리 선택" />
      </Stack>
    ),
    Cascader: (
      // 순차 인라인 — 한 칸 고르면 다음 칸 등장(깊이=칸 수). 리프 선택 시 "A › B › C [변경]"으로 압축.
      //  드롭다운 박스는 MillerColumns와 같은 컬럼-아이템 레이아웃(Select 아님). 한 트리거+다단은 MillerColumns(형제).
      <Stack gap="xxs">
        <Text variant="caption" color="secondary">서울 → 강남구 → 삼성동 순으로 칸이 늘어난다(페이지에 N박스, 공간 여유용).</Text>
        <Cascader options={CASC_OPTS} value={casc} onChange={setCasc} placeholder="지역 선택" />
      </Stack>
    ),
    MillerColumns: (
      // 트리거 1개 → 팝오버 다단 컬럼(좌→우, 부모 클릭=다음 컬럼). 좁은 화면(≤600px)은 단일 컬럼 드릴인 폴백. 페이지 발자국 최소.
      <Stack gap="xxs">
        <Text variant="caption" color="secondary">트리거 1개 → 팝오버에서 좌→우 컬럼으로 좁혀 경로 선택(Finder·Ant Cascader 패턴). 브라우저 폭 ≤600px면 단일 컬럼 드릴인.</Text>
        <MillerColumns options={CASC_OPTS} value={mcol} onChange={setMcol} placeholder="지역 선택" />
      </Stack>
    ),
    SearchToolbar: (
      // 세로 비교(전체폭) — SearchToolbar는 가로로 길어 2열 비교에 넣으면 wrap돼 행이 쌓인다. 실제는 한 줄.
      <Stack gap="md">
        <Stack gap="xxs">
          <Group gap="xs" align="center"><Badge color="neutral">기존</Badge><Text variant="caption" color="secondary">ListPage 죽은 필터 버튼(동작 없음)</Text></Group>
          <Group gap="xs" align="center"><Button variant="secondary" disabled>필터</Button></Group>
        </Stack>
        <Stack gap="xxs">
          <Group gap="xs" align="center"><Badge color="success">수정안</Badge></Group>
          <SearchToolbar searchValue={stbSearch} onSearchChange={setStbSearch} searchPlaceholder="거래처 검색" filters={[{ key: 'status', label: '상태', options: [{ label: '활성', value: 'active' }, { label: '휴면', value: 'dormant' }], value: stbStatus, onChange: setStbStatus }]} />
        </Stack>
      </Stack>
    ),
    ToastHost: (
      <Stack gap="xs">
        <Text variant="caption" color="secondary">notify.* 트리거 — 호스트=ToastHost(위치·지속 단일 관리)</Text>
        <Group gap="xs" wrap>
          <Button variant="secondary" onClick={() => notify.success('저장되었습니다')}>성공</Button>
          <Button variant="danger" onClick={() => notify.danger('삭제 실패')}>실패</Button>
          <Button variant="ghost" onClick={() => notify.info('동기화 중')}>정보</Button>
        </Group>
      </Stack>
    ),
    Menu: <Menu trigger={<IconButton icon="dots-vertical" label="메뉴" variant="secondary" />} items={[{ label: '수정', icon: 'edit', onClick: () => {} }, { label: '복제', icon: 'copy', onClick: () => {} }, { label: '삭제', icon: 'trash', variant: 'danger', onClick: () => {} }]} />,
    ObjectCard: <div style={{ width: 260, height: 300 }}><ObjectCard title="스테인리스 자유경첩 4″" subtitle="HG-SS-4F" thumbnail={IMG_SRC} status={{ label: '판매중', tone: 'success' }} headline={{ label: '단가', value: won(3200, '개'), type: 'text', note: { label: '변경요청중', tone: 'warning' } }} attributes={[{ label: '규격', value: '4″', type: 'text' }, { label: '재질', value: 'STS304', type: 'text' }]} actions={[{ label: '수정', icon: 'edit', onClick: () => {} }, { label: '삭제', variant: 'danger', icon: 'trash', onClick: () => {} }]} /></div>,
    Tree: <div style={{ width: 300 }}><Tree nodes={SAMPLE_TREE} selectedId={treeSel} expandedIds={treeExp} onSelect={setTreeSel} onToggle={toggleExp} title="디렉토리" editable onAddRoot={() => {}} onRename={() => {}} onDelete={() => {}} /></div>,
    HierarchyExplorer: (() => {
      // 제품 클릭 → 상세(Modal)는 *소비처* 책임 — 부품(HE/ObjectCard)은 onClick만 노출하고 상세에 뭐가 들었는지 모른다(헌법 1).
      //  데모에선 onClick에 상세 Modal 열기를 배선해 목록 항목이 interactive함을 보인다(액션 케밥은 별개).
      //  · 부자재(d1) 선택 시 하위 분류 타일 + 직속 제품 목록이 함께 보인다(잎/폴더 이분법 없음).
      //  · 추가는 우측 ＋ 드롭다운(제품/분류) → 종류만 정하고 이름 입력은 소비처 모달이 받는다(완전 위임).
      const withDetail = (objs: HierarchyObject[]) => objs.map((o) => ({ ...o, onClick: () => setHxDetail(o) }));
      const doAdd = () => {
        const name = addName.trim();
        if (!name || !treeSel) { setAddKind(null); return; }
        if (addKind === 'dir') {
          const id = `${treeSel} > ${name}`;
          setHxNodes((ns) => addChildNode(ns, treeSel, { id, label: name }));
          setTreeExp((e) => (e.includes(treeSel) ? e : [...e, treeSel]));
        } else {
          const id = `${treeSel}#p-${name}`;
          setHxObjMap((m) => ({ ...m, [treeSel]: [...(m[treeSel] ?? []), { id, title: name, icon: 'package', headline: { label: '단가', value: '견적 필요', type: 'text' } }] }));
        }
        setAddKind(null); setAddName('');
      };
      return (
        <>
          <HierarchyExplorer
            title="품목 카탈로그" description="분류별 부자재 제품 등록 (kk ERP)"
            nodes={hxNodes} selectedId={treeSel} expandedIds={treeExp} onSelect={setTreeSel} onToggle={toggleExp}
            editable treeTitle="분류" selectedLabel="제품"
            // 선택 디렉토리의 직속 제품(하위 분류와 공존 가능). 없으면 [] → 빈상태.
            objects={withDetail(hxObjMap[treeSel ?? ''] ?? [])}
            onAddObject={() => { setAddName(''); setAddKind('product'); }}
            onAddChild={() => { setAddName(''); setAddKind('dir'); }}
            // 전역 검색 — 입력 시 결과 모드(각 결과에 경로). 디렉토리 선택 후 위 검색칸에 '경첩' 입력해보면 보인다.
            searchQuery={hxSearch}
            onSearchChange={setHxSearch}
            searchResults={Object.entries(hxObjMap).flatMap(([dirId, list]) => {
              const p = pathOf(hxNodes, dirId) ?? [];
              return list.filter((o) => o.title.includes(hxSearch)).map((o) => ({ ...o, path: p, onClick: () => setHxDetail(o) }));
            })}
          />
          {/* 제품/분류 추가 모달(소비처 조립) — HE의 ＋ 드롭다운은 종류만 정하고, 이름 입력은 소비처 몫(헌법 1). */}
          <Modal opened={addKind != null} onClose={() => setAddKind(null)} title={addKind === 'dir' ? '분류 추가' : '제품 추가'}
            actions={[{ label: '취소', variant: 'ghost', onClick: () => setAddKind(null) }, { label: '추가', variant: 'primary', onClick: doAdd }]}>
            <FormField label={addKind === 'dir' ? '분류 이름' : '제품명'}>
              <TextInput value={addName} onChange={setAddName} placeholder={addKind === 'dir' ? '예: 특수 경첩' : '예: 스테인리스 경첩 5″'} />
            </FormField>
          </Modal>
          {/* 상세 모달(소비처 조립) — 클릭한 제품의 역할 슬롯을 그대로 펼친다. 수정·삭제는 *여기서* 한다(목록 케밥 폐기). */}
          <Modal opened={hxDetail != null} onClose={() => setHxDetail(null)} title={hxDetail?.title ?? ''}
            actions={[
              { label: '닫기', variant: 'ghost', onClick: () => setHxDetail(null) },
              { label: '수정', icon: 'edit', onClick: () => notify.info('수정 — 소비처 폼에 연결') },
              { label: '삭제', variant: 'danger', icon: 'trash', onClick: () => {
                if (!hxDetail) return;
                setHxObjMap((m) => Object.fromEntries(Object.entries(m).map(([k, list]) => [k, list.filter((o) => o.id !== hxDetail.id)])));
                setHxDetail(null);
              } },
            ]}>
            <Stack gap="sm">
              {hxDetail?.subtitle && <Text variant="caption" color="secondary">{hxDetail.subtitle}</Text>}
              {hxDetail?.status && <div><Badge color={hxDetail.status.tone}>{hxDetail.status.label}</Badge></div>}
              <Divider />
              <Stack gap="xs">
                {hxDetail?.headline && (
                  <Group justify="between"><Text variant="body" color="secondary">{hxDetail.headline.label}</Text><Text variant="body-strong">{String(hxDetail.headline.value)}</Text></Group>
                )}
                {hxDetail?.attributes?.map((a, i) => (
                  <Group key={i} justify="between"><Text variant="body" color="secondary">{a.label}</Text><Text variant="body">{String(a.value)}</Text></Group>
                ))}
              </Stack>
            </Stack>
          </Modal>
        </>
      );
    })(),
    SectionHeader: <div style={{ width: 360 }}><Card variant="elevated" padding="md"><SectionHeader title="강남 현장" description="rev.2 · 2026-05-02 등록" divider actions={[{ label: '추가', variant: 'primary', icon: 'plus', onClick: () => {} }]} /></Card></div>,
    Breadcrumb: <Breadcrumb items={[{ label: '현장', onClick: () => {} }, { label: '강남 현장', onClick: () => {} }, { label: '도면' }]} />,
    PeriodNavigator: <PeriodNavigator label={`2026년 ${ledgerMonth}월`} onPrev={() => setLedgerMonth((m) => Math.max(1, m - 1))} onNext={() => setLedgerMonth((m) => Math.min(12, m + 1))} disabledPrev={ledgerMonth <= 1} disabledNext={ledgerMonth >= 12} />,
    LedgerPage: (() => {
      // 정산 데모(kk ERP) — 기간·KPI밴드·분해(품목별/발주별)·드릴(Drawer). 발주별에서 행 클릭 → 라인 상세.
      const isItem = ledgerTab === 'item';
      const columns = isItem
        ? [
            { key: 'name', label: '품목명', type: 'text' as const },
            { key: 'qty', label: '수량', type: 'number' as const },
            { key: 'amount', label: '금액 합계', type: 'currency' as const },
          ]
        : [
            { key: 'no', label: '발주번호', type: 'text' as const },
            { key: 'vendor', label: '거래처', type: 'text' as const },
            { key: 'amount', label: '금액', type: 'currency' as const },
            { key: 'status', label: '상태', type: 'badge' as const, badgeColors: { '정산완료': 'success' as const, '미정산': 'warning' as const } },
          ];
      const rows = isItem
        ? [{ id: 'i1', name: '모니터암', qty: 2, amount: 12323 }]
        : [
            { id: 'PO-2026-0612', no: 'PO-2026-0612', vendor: '㈜대한철물', amount: 12323, status: '정산완료' },
            { id: 'PO-2026-0613', no: 'PO-2026-0613', vendor: '세양하드웨어', amount: 45000, status: '미정산' },
          ];
      return (
        <LedgerPage
          title="정산"
          description="월별 정산 현황 (kk ERP)"
          actions={[{ label: '명세서 다운로드', variant: 'secondary', icon: 'upload', onClick: () => {} }]}
          period={{ label: `2026년 ${ledgerMonth}월`, onPrev: () => setLedgerMonth((m) => Math.max(1, m - 1)), onNext: () => setLedgerMonth((m) => Math.min(12, m + 1)), disabledPrev: ledgerMonth <= 1, disabledNext: ledgerMonth >= 12 }}
          metrics={[
            { kind: 'stat', label: '정산 총액', value: fmtCurrency(12323), trend: 'up', delta: '전월 +8%', icon: 'wallet' },
            { kind: 'summary', label: '미정산 잔액', icon: 'credit-card', tone: 'warning', amount: 45000 },
            { kind: 'summary', label: '정산 완료', icon: 'check-circle', tone: 'success', count: 1, amount: 12323 },
            { kind: 'summary', label: '정산 대기', icon: 'clock', tone: 'neutral', count: 1 },
          ]}
          breakdown={{
            tabs: [{ label: '품목별', value: 'item' }, { label: '발주별', value: 'order' }],
            value: ledgerTab, onChange: setLedgerTab,
            columns, rows, total: isItem ? 12323 : 57323,
            onRowClick: isItem ? undefined : (row) => setLedgerSel(String(row.no)),
            emptyState: { icon: 'wallet', title: '정산 내역이 없습니다' },
          }}
          detail={{
            opened: ledgerSel != null,
            onClose: () => setLedgerSel(null),
            title: ledgerSel ?? '',
            actions: [{ label: '명세서 출력', icon: 'receipt', onClick: () => {} }, { label: '정산 확정', variant: 'primary', onClick: () => {} }],
            content: (
              <Stack gap="md">
                <StatusRow label="세양하드웨어" status={{ label: '미정산', tone: 'warning' }} />
                <Text variant="caption" color="secondary">발주일 2026-06-13 · 3품목</Text>
                <Divider />
                <Stack gap="xs">
                  <Group justify="between"><Text variant="body">모니터암 ×2</Text><Text variant="body">{fmtCurrency(12323)}</Text></Group>
                  <Group justify="between"><Text variant="body">경첩 4″ ×5</Text><Text variant="body">{fmtCurrency(16000)}</Text></Group>
                  <Group justify="between"><Text variant="body">레일 ×4</Text><Text variant="body">{fmtCurrency(16677)}</Text></Group>
                </Stack>
                <TotalRow amount={45000} />
              </Stack>
            ),
          }}
        />
      );
    })(),
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
