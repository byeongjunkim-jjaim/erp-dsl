// ─────────────────────────────────────────────────────────────────────────
// _catalog.ts — 어휘 카탈로그 (LLM 조립 계약 #2의 직렬화 가능 데이터 씨앗)
//
//  · 공개 배럴(index.ts)이 노출하는 "사용자가 볼 수 있는 모든 부품"을 한곳에 나열한다.
//  · 각 부품 = { 계층, 역할, 닫힌 props(enum/토큰), 구성요소(분자↑만) }.
//  · 구성요소(composition)는 각 부품 파일의 실제 import에서 추출한 실측이다 — 손으로 추정한 값이 아니라
//    "그 파일이 무엇으로 조립되었는가"의 사실. (import가 곧 단일 진실 → 카탈로그 드리프트 차단.)
//  · 토큰 항목은 헤더 주석·구현에 근거한 "그 부품이 소비하는 토큰/역할 변수"를 큐레이션한 것.
//  · dev 전용. publish 대상 아님(.npmignore의 _* 제외 규칙). 부품이 아니라 부품을 "설명하는" 데이터.
// ─────────────────────────────────────────────────────────────────────────

export type Layer =
  | '의미 원자' | '레이아웃 원자' | '배치 프리미티브'
  | '분자' | '유기체' | '템플릿';

export type PropKind = '스타일' | '콘텐츠' | '기능' | '값';

export type PropSpec = {
  name: string;
  kind: PropKind;
  values: string;   // 닫힌 enum/토큰/타입 (사용자가 고를 수 있는 선택지)
};

// 분자 이상의 "무엇으로 조립되었나" — 계층별로 분해. 값은 부품명(혹은 토큰/공유 헬퍼).
export type Composition = {
  토큰?: string[];
  '의미 원자'?: string[];
  '레이아웃 원자'?: string[];
  '배치 프리미티브'?: string[];
  분자?: string[];
  유기체?: string[];
  템플릿?: string[];
  공유?: string[];   // _cells / _masks / _fieldStyles 등 격리 구역 공유 모듈
};

export type CatalogEntry = {
  name: string;
  layer: Layer;
  role: string;            // 한 줄 역할
  props: PropSpec[];
  composition?: Composition; // 분자 이상만
};

// 공통 enum 약어(중복 줄이기용 — 표에는 풀어서 적는다)
const ROLE_TEXT = "'primary' | 'secondary' | 'danger'";
const BADGE = "'neutral' | 'success' | 'warning' | 'danger' | 'info'";
const SIZE2 = "'sm' | 'md'";
const SIZE3 = "'sm' | 'md' | 'lg'";

// 의미 원자의 하위 분류(뷰 그룹핑 단일 출처) — 입력군 vs 표시·행동. 새 입력 원자는 여기 한 곳에 등록.
export const INPUT_ATOMS: ReadonlySet<string> = new Set([
  'TextInput', 'PasswordInput', 'NumberInput', 'Textarea', 'Select', 'Combobox',
  'Radio', 'Checkbox', 'Switch', 'DatePicker', 'MultiDatePicker', 'TimePicker',
]);

export const CATALOG: CatalogEntry[] = [
  // ── 의미 원자 — 표시·행동 ─────────────────────────────────────────────
  { name: 'Button', layer: '의미 원자', role: '클릭 행동의 기본 단위. variant가 색·강조를 닫는다.',
    props: [
      { name: 'variant', kind: '스타일', values: "'primary' | 'secondary' | 'danger' | 'ghost'" },
      { name: 'size', kind: '스타일', values: SIZE2 },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode (텍스트/아이콘)' },
      { name: 'leftIcon / rightIcon', kind: '콘텐츠', values: 'ReactNode(아이콘)' },
      { name: 'loading / disabled / fullWidth', kind: '스타일', values: 'boolean' },
      { name: 'type', kind: '기능', values: "'button' | 'submit'" },
      { name: 'onClick', kind: '기능', values: '() => void' },
    ] },
  { name: 'Badge', layer: '의미 원자', role: '표시 전용 상태 알약(행동 없음).',
    props: [
      { name: 'color', kind: '스타일', values: BADGE + ' (primary 제외)' },
      { name: 'children', kind: '콘텐츠', values: 'string' },
    ] },
  { name: 'Chip', layer: '의미 원자', role: '행동 있는 알약(선택/삭제). controlled.',
    props: [
      { name: 'color', kind: '스타일', values: BADGE + ' + neutral' },
      { name: 'selected', kind: '기능', values: 'boolean (controlled)' },
      { name: 'onChange', kind: '기능', values: '() => void (클릭 신호)' },
      { name: 'onRemove', kind: '기능', values: '() => void (있으면 X 노출)' },
      { name: 'children', kind: '콘텐츠', values: 'string' },
    ] },
  { name: 'Text', layer: '의미 원자', role: '본문 텍스트(3단계). 색 역할 노출(에러·보조 실수요).',
    props: [
      { name: 'variant', kind: '스타일', values: "'body' | 'body-strong' | 'caption'" },
      { name: 'color', kind: '스타일', values: ROLE_TEXT },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode' },
    ] },
  { name: 'Title', layer: '의미 원자', role: '제목 텍스트(3단계). 색은 text.primary 고정.',
    props: [
      { name: 'variant', kind: '스타일', values: "'display' | 'heading' | 'subheading'" },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode' },
    ] },
  { name: 'Label', layer: '의미 원자', role: '무언가의 이름표. 항상 짝이 있음(body-strong 고정).',
    props: [
      { name: 'children', kind: '콘텐츠', values: 'ReactNode' },
      { name: 'htmlFor', kind: '기능', values: 'string (짝 연결)' },
    ] },
  { name: 'Anchor', layer: '의미 원자', role: '이동 의미 고유(Button으로 대체 불가).',
    props: [
      { name: 'href', kind: '콘텐츠', values: 'string' },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode' },
    ] },
  { name: 'Icon', layer: '의미 원자', role: 'SVG 아이콘(85종). baseline 광학보정 내장.',
    props: [
      { name: 'name', kind: '콘텐츠', values: 'IconName (85종 enum)' },
      { name: 'size', kind: '스타일', values: SIZE3 },
      { name: 'color', kind: '스타일', values: ROLE_TEXT },
    ] },
  { name: 'Avatar', layer: '의미 원자', role: '사람 식별 원형(이니셜 폴백). 고정 종횡비.',
    props: [
      { name: 'src', kind: '콘텐츠', values: 'string' },
      { name: 'children', kind: '콘텐츠', values: 'string (이니셜)' },
      { name: 'size', kind: '스타일', values: SIZE3 },
    ] },
  { name: 'Image', layer: '의미 원자', role: '콘텐츠 이미지 고정 종횡비 박스(명시 예외=고정치수).',
    props: [
      { name: 'src / alt', kind: '콘텐츠', values: 'string (alt 필수)' },
      { name: 'fallbackSrc', kind: '콘텐츠', values: 'string' },
      { name: 'fit', kind: '스타일', values: "'cover' | 'contain'" },
      { name: 'radius', kind: '값', values: "'sm' | 'md' | 'full'" },
      { name: 'size', kind: '스타일', values: SIZE3 },
    ] },
  { name: 'Tooltip', layer: '의미 원자', role: 'hover 텍스트 설명(위치 자동).',
    props: [
      { name: 'label', kind: '콘텐츠', values: 'string' },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode (감쌀 대상)' },
    ] },
  { name: 'Popover', layer: '의미 원자', role: 'Tooltip의 클릭·슬롯 형제. content=raw 슬롯(부품).',
    props: [
      { name: 'children', kind: '콘텐츠', values: 'ReactNode (trigger)' },
      { name: 'content', kind: '콘텐츠', values: 'ReactNode (@/ui 부품 슬롯)' },
      { name: 'opened', kind: '기능', values: 'boolean (controlled)' },
      { name: 'onChange', kind: '기능', values: '(opened: boolean) => void' },
      { name: 'position', kind: '스타일', values: "'top' | 'bottom' | 'left' | 'right'" },
      { name: 'width', kind: '값', values: SIZE3 },
    ] },
  { name: 'Spinner', layer: '의미 원자', role: '영역/페이지 로딩(Button loading과 별개).',
    props: [{ name: 'size', kind: '스타일', values: SIZE3 }] },
  { name: 'Skeleton', layer: '의미 원자', role: '로드 전 자리표시(형태 보존). 레이아웃 부품 안에 박아 실제 구조를 흉내냄.',
    props: [
      { name: 'variant', kind: '스타일', values: "'text' | 'block' | 'circle'" },
      { name: 'lines', kind: '값', values: 'number (text 전용, 기본 3)' },
      { name: 'size', kind: '스타일', values: SIZE3 + ' (circle 지름/block 높이)' },
      { name: 'radius', kind: '스타일', values: "'sm' | 'md'" },
    ] },
  { name: 'Combobox', layer: '의미 원자', role: '검색되는 단일 선택(Select의 searchable 형제). 대용량 옵션 타이핑 필터.',
    props: [
      { name: 'options', kind: '기능', values: '{ label, value }[]' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, string | null' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'clearable', kind: '기능', values: 'boolean (기본 true)' },
      { name: 'size', kind: '스타일', values: SIZE2 },
    ] },
  { name: 'Progress', layer: '의미 원자', role: '결정형 진행률(0~100). 끝 모르는 로딩은 Spinner.',
    props: [
      { name: 'value', kind: '값', values: 'number (0~100)' },
      { name: 'tone', kind: '스타일', values: "'primary' | 'success' | 'warning' | 'danger'" },
      { name: 'size', kind: '스타일', values: SIZE3 },
    ] },
  { name: 'TimePicker', layer: '의미 원자', role: '시각 입력(HH:MM). 날짜=DatePicker와 별개 축.',
    props: [
      { name: 'value / onChange', kind: '기능', values: 'controlled, "HH:MM"' },
      { name: 'size', kind: '스타일', values: SIZE2 },
      { name: 'disabled', kind: '스타일', values: 'boolean' },
    ] },
  { name: 'SegmentedControl', layer: '의미 원자', role: '같은 대상의 뷰/모드 토글(즉시 전환, 비제출).',
    props: [
      { name: 'options', kind: '기능', values: '{ label, value }[]' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
      { name: 'fullWidth / disabled', kind: '스타일', values: 'boolean' },
    ] },
  { name: 'TabBar', layer: '의미 원자', role: '다른 구획으로 전환(대상 자체가 바뀜).',
    props: [
      { name: 'options', kind: '기능', values: '{ label, value }[]' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, string(활성 키)' },
      { name: 'disabled', kind: '스타일', values: 'boolean' },
    ] },

  // ── 의미 원자 — 입력군 ────────────────────────────────────────────────
  { name: 'TextInput', layer: '의미 원자', role: '한 줄 텍스트 입력. controlled.',
    props: [
      { name: 'value / onChange', kind: '기능', values: 'controlled, string' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
      { name: 'disabled', kind: '스타일', values: 'boolean' },
      { name: 'name', kind: '기능', values: 'string (폼 배선)' },
    ] },
  { name: 'PasswordInput', layer: '의미 원자', role: '가림 입력 + 가시성 토글.',
    props: [
      { name: 'value / onChange', kind: '기능', values: 'controlled, string' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
      { name: 'disabled', kind: '스타일', values: 'boolean' },
    ] },
  { name: 'NumberInput', layer: '의미 원자', role: '숫자 입력(min/max는 스키마로).',
    props: [
      { name: 'value / onChange', kind: '기능', values: 'controlled, number | string' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
      { name: 'disabled', kind: '스타일', values: 'boolean' },
    ] },
  { name: 'Textarea', layer: '의미 원자', role: '여러 줄 입력(autosize).',
    props: [
      { name: 'value / onChange', kind: '기능', values: 'controlled, string' },
      { name: 'autosize', kind: '스타일', values: 'boolean' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
    ] },
  { name: 'Select', layer: '의미 원자', role: '단일 선택 드롭다운(searchable 끔).',
    props: [
      { name: 'options', kind: '기능', values: '{ label, value }[]' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, string | null' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
    ] },
  { name: 'DatePicker', layer: '의미 원자', role: '단일 날짜 선택(범위는 분자로).',
    props: [
      { name: 'value / onChange', kind: '기능', values: 'controlled, string | null (ISO)' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
    ] },
  { name: 'MultiDatePicker', layer: '의미 원자', role: '여러 개별 날짜(집합 string[]). DatePicker 형제.',
    props: [
      { name: 'value / onChange', kind: '기능', values: 'controlled, string[]' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
    ] },
  { name: 'Checkbox', layer: '의미 원자', role: '단일 on/off + 인라인 라벨.',
    props: [
      { name: 'checked / onChange', kind: '기능', values: 'controlled, boolean' },
      { name: 'label', kind: '콘텐츠', values: 'string (인라인)' },
      { name: 'disabled', kind: '스타일', values: 'boolean' },
    ] },
  { name: 'Switch', layer: '의미 원자', role: '알약 토글(트랙 full 고정).',
    props: [
      { name: 'checked / onChange', kind: '기능', values: 'controlled, boolean' },
      { name: 'label', kind: '콘텐츠', values: 'string (인라인)' },
      { name: 'disabled', kind: '스타일', values: 'boolean' },
    ] },
  { name: 'Radio', layer: '의미 원자', role: '그룹 단일 선택(배열 방향은 프리미티브 몫).',
    props: [
      { name: 'options', kind: '기능', values: '{ label, value }[]' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, string' },
      { name: 'disabled', kind: '스타일', values: 'boolean' },
    ] },

  // ── 레이아웃 원자 ─────────────────────────────────────────────────────
  { name: 'Card', layer: '레이아웃 원자', role: '그릇·그림자. 자식을 담음.',
    props: [
      { name: 'variant', kind: '스타일', values: "'elevated' | 'outlined' | 'flat'" },
      { name: 'padding', kind: '값', values: "'none' | 'sm' | 'md' | 'lg'" },
      { name: 'fill', kind: '스타일', values: 'boolean (부모 높이 채움)' },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode' },
    ] },
  { name: 'Divider', layer: '레이아웃 원자', role: '구분선(보더 토큰 1px).',
    props: [{ name: 'orientation', kind: '스타일', values: "'horizontal' | 'vertical'" }] },
  { name: 'Container', layer: '레이아웃 원자', role: '콘텐츠 폭 천장 + 가운데 정렬. 폭의 유일한 출발점.',
    props: [
      { name: 'maxWidth', kind: '값', values: "'narrow' | 'default' | 'wide'" },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode' },
    ] },

  // ── 배치 프리미티브 ───────────────────────────────────────────────────
  { name: 'Stack', layer: '배치 프리미티브', role: '세로 배열. 간격 토큰 소비.',
    props: [
      { name: 'gap', kind: '값', values: '간격 토큰 (기본 md)' },
      { name: 'align', kind: '스타일', values: "'start' | 'center' | 'end' | 'stretch'" },
      { name: 'justify', kind: '스타일', values: "'start' | 'center' | 'end' | 'between'" },
    ] },
  { name: 'Group', layer: '배치 프리미티브', role: '가로 배열(내용 크기대로 흐름).',
    props: [
      { name: 'gap', kind: '값', values: '간격 토큰 (기본 md)' },
      { name: 'align', kind: '스타일', values: "'start' | 'center' | 'end' (기본 center)" },
      { name: 'justify', kind: '스타일', values: "'start' | 'center' | 'end' | 'between'" },
      { name: 'wrap', kind: '스타일', values: 'boolean' },
    ] },
  { name: 'Grid', layer: '배치 프리미티브', role: '격자(비율 지정). Grid.Col span으로 비대칭 분할.',
    props: [
      { name: 'columns', kind: '값', values: '1 | 2 | 3 | 4 | 6 | 12 (12의 약수)' },
      { name: 'gap', kind: '값', values: '간격 토큰' },
      { name: 'equalRows', kind: '스타일', values: 'boolean (행 높이 균등)' },
      { name: 'Grid.Col span', kind: '값', values: '1~12' },
    ] },

  // ── 분자 (11) — 구성요소 표시 ────────────────────────────────────────
  { name: 'FormField', layer: '분자', role: '입력 원자에서 벗긴 장식·에러의 수령자(방식 A).',
    props: [
      { name: 'label', kind: '콘텐츠', values: 'string' },
      { name: 'withAsterisk', kind: '스타일', values: 'boolean (별표 표시만)' },
      { name: 'error', kind: '콘텐츠', values: 'string (있으면 에러 상태)' },
      { name: 'children', kind: '콘텐츠', values: '입력 컨트롤(원자)' },
    ],
    composition: {
      토큰: ['gap xs/xxs', 'text.primary(라벨)', 'text.danger(별표·에러)', '타이포 body-strong/caption', '--field-border(에러 시 덮음)'],
      '의미 원자': ['Label', 'Text'],
      '배치 프리미티브': ['Stack'],
    } },
  { name: 'Accordion', layer: '분자', role: '여러 [헤더+본문] 섹션의 펼침을 조율(하나만/여럿). Collapsible 직접 쌓기를 대체.',
    props: [
      { name: 'items', kind: '콘텐츠', values: '{ value, label, children }[]' },
      { name: 'multiple', kind: '기능', values: 'boolean (여러 개 동시 펼침)' },
      { name: 'defaultOpen', kind: '값', values: 'string[] (처음 펼친 섹션 value)' },
    ],
    composition: {
      토큰: ['radius md', '구분(separated)', 'chevron'],
      '의미 원자': ['Icon'],
    } },
  { name: 'Stat', layer: '분자', role: 'KPI 지표 타일(추세형). SummaryCard 형제: 큰 값 + 추세·델타.',
    props: [
      { name: 'label', kind: '콘텐츠', values: 'string' },
      { name: 'value', kind: '콘텐츠', values: 'string (포맷된 표시값)' },
      { name: 'trend', kind: '스타일', values: "'up' | 'down' | 'flat'" },
      { name: 'delta', kind: '콘텐츠', values: 'string (예: +12.4%)' },
      { name: 'icon', kind: '콘텐츠', values: 'IconName' },
    ],
    composition: {
      토큰: ['status 색(추세)', 'gap'],
      '의미 원자': ['Title', 'Text', 'Badge', 'Icon'],
      '레이아웃 원자': ['Card'],
      '배치 프리미티브': ['Group', 'Stack'],
    } },
  { name: 'TreeSelect', layer: '분자', role: '계층에서 노드 하나를 입력칸으로 선택(Tree를 드롭다운에 임베드). 부모/자식 임의 깊이.',
    props: [
      { name: 'nodes', kind: '기능', values: 'TreeNodeData[]' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, node id' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
    ],
    composition: {
      '의미 원자': ['Button', 'Icon', 'Popover'],
      유기체: ['Tree'],
    } },
  { name: 'Cascader', layer: '분자', role: '순차 드롭다운으로 계층 경로 선택(한 칸 고르면 다음 칸). 완료 시 브레드크럼 압축, 변경으로 재선택.',
    props: [
      { name: 'options', kind: '기능', values: '{ value, label, children }[]' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, value[] (경로)' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
    ],
    composition: {
      '의미 원자': ['Button', 'Text', 'Icon', 'Popover'],
    } },
  { name: 'SearchToolbar', layer: '분자', role: '목록 상단 띠: 검색 + 필터 + 활성 필터칩. ListPage 죽은 필터를 정식화.',
    props: [
      { name: 'searchValue / onSearchChange', kind: '기능', values: 'controlled, string' },
      { name: 'searchPlaceholder', kind: '콘텐츠', values: 'string' },
      { name: 'filters', kind: '기능', values: '{ key, label, options, value, onChange }[]' },
    ],
    composition: {
      '의미 원자': ['TextInput', 'Select', 'Chip', 'Icon'],
      분자: ['InputGroup'],
      '배치 프리미티브': ['Group'],
    } },
  { name: 'MultiSelect', layer: '분자', role: 'Select + Chip. 고른 값이 Chip으로 쌓임(neutral 고정).',
    props: [
      { name: 'options', kind: '기능', values: '{ label, value }[]' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, string[]' },
      { name: 'placeholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
    ],
    composition: {
      토큰: ['neutral(Chip 색 고정)', 'gap', '--field-border'],
      '의미 원자': ['Chip', 'Icon'],
      공유: ['_fieldStyles'],
    } },
  { name: 'DateRangeField', layer: '분자', role: 'DatePicker 둘 + 가운데 ~. "시작 ≤ 끝"이 묶음.',
    props: [
      { name: 'value / onChange', kind: '기능', values: '{ start, end } controlled' },
      { name: 'startPlaceholder / endPlaceholder', kind: '콘텐츠', values: 'string' },
      { name: 'size', kind: '스타일', values: SIZE2 },
    ],
    composition: {
      토큰: ['gap', 'align=center'],
      '의미 원자': ['DatePicker', 'Text'],
      '배치 프리미티브': ['Group'],
    } },
  { name: 'InputGroup', layer: '분자', role: '입력칸 양 끝에 비대화형 어드온(단위·아이콘).',
    props: [
      { name: 'leftAddon / rightAddon', kind: '콘텐츠', values: 'string | <Icon> (raw 금지)' },
      { name: 'children', kind: '콘텐츠', values: '입력 원자' },
    ],
    composition: {
      토큰: ['gap', 'align=center', '--field-border'],
      '의미 원자': ['Text', 'Icon(어드온)'],
      '배치 프리미티브': ['Group'],
    } },
  { name: 'FileUploader', layer: '분자', role: '파일 업로드 4단계 상태(대기→진행→완료/실패). controlled.',
    props: [
      { name: 'value / onChange', kind: '기능', values: 'FileItem[], (next) => void' },
      { name: 'multiple / disabled', kind: '스타일', values: 'boolean' },
    ],
    composition: {
      토큰: ['status 색(danger 등)', 'gap', 'radius', '진행바'],
      '의미 원자': ['Button', 'Icon', 'Text'],
      '배치 프리미티브': ['Group', 'Stack'],
    } },
  { name: 'Pagination', layer: '분자', role: '번호형 페이지 이동(축약 …). 목록 공유.',
    props: [
      { name: 'total', kind: '기능', values: 'number (전체 페이지)' },
      { name: 'value / onChange', kind: '기능', values: 'controlled, number' },
    ],
    composition: {
      토큰: ['primary(현재 페이지)', 'gap', '--icon-baseline-shift'],
      '의미 원자': ['Icon(화살표)'],
    } },
  { name: 'IconButton', layer: '분자', role: 'Button을 아이콘 전용으로 고정(label=aria).',
    props: [
      { name: 'icon', kind: '콘텐츠', values: 'IconName' },
      { name: 'label', kind: '콘텐츠', values: 'string (aria-label 필수)' },
      { name: 'variant', kind: '스타일', values: "'primary' | 'secondary' | 'danger' | 'ghost'" },
      { name: 'size', kind: '스타일', values: SIZE2 },
    ],
    composition: {
      토큰: ['variant→색 역할(primary/danger/secondary)', 'radius sm', '정사각'],
      '의미 원자': ['Icon'],
    } },
  { name: 'Callout', layer: '분자', role: '인라인 비휘발 안내(토스트와 분리). tone 4종.',
    props: [
      { name: 'tone', kind: '스타일', values: "'info' | 'warning' | 'danger' | 'neutral'" },
      { name: 'title', kind: '콘텐츠', values: 'string (선택)' },
      { name: 'children', kind: '콘텐츠', values: 'string (본문)' },
      { name: 'icon', kind: '콘텐츠', values: 'IconName (선택)' },
    ],
    composition: {
      토큰: ['tone 스케일(-0 배경/-2 보더/-7 아이콘)', 'padding md', 'radius md'],
      '의미 원자': ['Icon', 'Text'],
      '배치 프리미티브': ['Group', 'Stack'],
    } },
  { name: 'StatusRow', layer: '분자', role: '한 항목의 "상태 + 할 수 있는 행동"을 한 줄로.',
    props: [
      { name: 'label', kind: '콘텐츠', values: 'string' },
      { name: 'icon', kind: '콘텐츠', values: 'IconName (선택)' },
      { name: 'status', kind: '콘텐츠', values: '{ label, tone: ' + BADGE + ' }' },
      { name: 'actions', kind: '기능', values: 'Action[] (0~2 권장)' },
    ],
    composition: {
      토큰: ['타이포 body-strong(라벨)', 'gap', 'justify=between', 'sm 버튼 높이 reserve'],
      '의미 원자': ['Badge', 'Icon', 'Text'],
      '배치 프리미티브': ['Group'],
      공유: ['_cells(renderAction)'],
    } },
  { name: 'SummaryCard', layer: '분자', role: 'KPI/요약 타일(틴트 아이콘 + 건수 + 금액).',
    props: [
      { name: 'label', kind: '콘텐츠', values: 'string' },
      { name: 'icon', kind: '콘텐츠', values: 'IconName (선택)' },
      { name: 'tone', kind: '스타일', values: BADGE + ' (아이콘 틴트)' },
      { name: 'count / amount', kind: '값', values: 'number (각 선택)' },
    ],
    composition: {
      토큰: ['tone 틴트 스케일 var(--mantine-color-{tone}-{n})', 'gap', 'fmtCurrency/fmtNumber'],
      '의미 원자': ['Title(count)', 'Text', 'Icon'],
      '레이아웃 원자': ['Card'],
      '배치 프리미티브': ['Group', 'Stack'],
      공유: ['_cells(fmt)'],
    } },
  { name: 'TotalRow', layer: '분자', role: '리스트 하단 합계 행(마감선 + 라벨 ─ 금액).',
    props: [
      { name: 'label', kind: '콘텐츠', values: 'string (기본 "합계")' },
      { name: 'amount', kind: '값', values: 'number (₩ + 콤마)' },
    ],
    composition: {
      토큰: ['gap', 'fmtCurrency', '금액 강조(body-strong)'],
      '의미 원자': ['Text'],
      '레이아웃 원자': ['Divider'],
      '배치 프리미티브': ['Group', 'Stack'],
      공유: ['_cells(fmt)'],
    } },
  { name: 'Menu', layer: '분자', role: '클릭 시 열리는 액션 메뉴(Popover + Action[] + 선택 header).',
    props: [
      { name: 'trigger', kind: '콘텐츠', values: 'ReactNode (보통 IconButton)' },
      { name: 'items', kind: '기능', values: 'Action[] (클릭 시 닫고 onClick)' },
      { name: 'header', kind: '콘텐츠', values: 'ReactNode (선택 — 신원/제목, 구분선 자동)' },
      { name: 'width / position', kind: '값', values: "'sm'|'md'|'lg' / 4방향" },
    ],
    composition: {
      토큰: ['hover bg(controls.css)', 'gap', 'danger 색(variant)'],
      '의미 원자': ['Popover', 'Text', 'Icon'],
      '레이아웃 원자': ['Divider'],
      '배치 프리미티브': ['Stack'],
      공유: ['_cells(Action)'],
    } },
  { name: 'ObjectCard', layer: '분자', role: '계층 안 오브젝트 한 칸의 완결된 닫힌 표현(미리보기 아님 — 자유 render 구멍 대신 스키마).',
    props: [
      { name: 'title', kind: '콘텐츠', values: 'string' },
      { name: 'subtitle', kind: '콘텐츠', values: 'string (선택)' },
      { name: 'badge', kind: '콘텐츠', values: '{ label, tone } (선택 — 오브젝트 자체 상태)' },
      { name: 'thumbnail', kind: '콘텐츠', values: 'string(src) (선택)' },
      { name: 'fields', kind: '콘텐츠', values: '{ label, value, type: CellType, note?: { label, tone } }[] (선택 — note=필드별 상태 배지)' },
      { name: 'actions', kind: '기능', values: 'Action[] (전파 차단)' },
      { name: 'onClick', kind: '기능', values: '() => void (카드 클릭)' },
    ],
    composition: {
      토큰: ['gap', 'fill 높이', 'caption(필드 라벨)'],
      '의미 원자': ['Text', 'Badge', 'Image'],
      '레이아웃 원자': ['Card', 'Divider'],
      '배치 프리미티브': ['Group', 'Stack'],
      공유: ['_cells(renderAction·renderCell)'],
    } },
  { name: 'SectionHeader', layer: '분자', role: '카드/구획 표준 헤더(제목 subheading > 본문 + 설명? + 액션?). "헤더≥content+1tier" 규칙의 부품화.',
    props: [
      { name: 'title', kind: '콘텐츠', values: 'string (subheading)' },
      { name: 'titleNode', kind: '콘텐츠', values: 'ReactNode (title 대신 — 예: 인터랙티브 Breadcrumb)' },
      { name: 'description', kind: '콘텐츠', values: 'string (선택, caption)' },
      { name: 'actions', kind: '기능', values: 'Action[] (우측, 섹션 스코프·영속)' },
      { name: 'divider', kind: '스타일', values: 'boolean (하단 구분선=헤더 밴드)' },
    ],
    composition: {
      토큰: ['Title subheading(헤더 티어)', 'caption(설명)', 'justify=between'],
      '의미 원자': ['Title', 'Text'],
      '레이아웃 원자': ['Divider'],
      '배치 프리미티브': ['Group', 'Stack'],
      공유: ['_cells(renderAction)'],
    } },
  { name: 'Breadcrumb', layer: '분자', role: '위치 경로(a › b › c). 앞 단계 이동 가능(인터랙티브), 마지막=현재 강조.',
    props: [
      { name: 'items', kind: '기능', values: '{ label, onClick? }[] (마지막=현재, 비링크)' },
    ],
    composition: {
      토큰: ['chevron-right 구분', 'gap', '마지막 body-strong/primary'],
      '의미 원자': ['Text', 'Icon'],
      '배치 프리미티브': ['Group'],
    } },
  { name: 'Collapsible', layer: '분자', role: '헤더(항상 보임)+본문(접힘/펼침) 한 단위. 헤더 클릭 토글. 쌓아서 "요약 목록→펼쳐 상세". accordion은 경계 밖.',
    props: [
      { name: 'header', kind: '콘텐츠', values: 'ReactNode (요약 슬롯, 항상 보임 — 보통 StatusRow/TotalRow)' },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode (상세 슬롯, 접힘 대상)' },
      { name: 'defaultOpen', kind: '스타일', values: 'boolean (처음 상태, 기본 false=접힘)' },
    ],
    composition: {
      토큰: ['hover bg(controls.css)', 'padding md', 'chevron-up/down'],
      '의미 원자': ['Icon'],
      '레이아웃 원자': ['Card', 'Divider'],
      '배치 프리미티브': ['Group'],
      공유: ['Mantine Collapse(애니메이션 엔진, 격리)'],
    } },

  // ── 유기체 (8) — 구성요소 표시 ───────────────────────────────────────
  { name: 'Modal', layer: '유기체', role: '도메인 무관 껍데기. 헤더·푸터 고정 + 본문 스크롤.',
    props: [
      { name: 'opened / onClose', kind: '기능', values: 'boolean, () => void' },
      { name: 'title', kind: '콘텐츠', values: 'string' },
      { name: 'actions', kind: '기능', values: 'Action[]' },
      { name: 'size', kind: '스타일', values: SIZE3 + ' (폭)' },
      { name: 'closeOnOverlayClick', kind: '스타일', values: 'boolean' },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode (도메인 폼)' },
    ],
    composition: {
      토큰: ['shadow md', 'maxHeight 85vh(명시예외)', '3영역 패딩', 'gap xs(푸터)'],
      '의미 원자': ['Title', 'Icon(x)'],
      '배치 프리미티브': ['Group (헤더 직접 조립)'],
      공유: ['_cells(renderAction)'],
    } },
  { name: 'Drawer', layer: '유기체', role: 'Modal의 슬라이드오버 형제. edge(좌/우/상/하)에서 패널이 들어옴. 상세 편집·필터.',
    props: [
      { name: 'opened / onClose', kind: '기능', values: 'boolean, () => void' },
      { name: 'title', kind: '콘텐츠', values: 'string' },
      { name: 'actions', kind: '기능', values: 'Action[]' },
      { name: 'position', kind: '스타일', values: "'left' | 'right' | 'top' | 'bottom'" },
      { name: 'size', kind: '스타일', values: SIZE3 + ' (폭/높이)' },
      { name: 'closeOnOverlayClick', kind: '스타일', values: 'boolean' },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode (도메인 폼)' },
    ],
    composition: {
      토큰: ['3영역 패딩', 'gap xs(푸터)', '--border-default'],
      '의미 원자': ['Title', 'Icon(x)'],
      '배치 프리미티브': ['Group (헤더 직접 조립)'],
      공유: ['_cells(renderAction)'],
    } },
  { name: 'Stepper', layer: '유기체', role: '다단계 진행 표시(노드+커넥터+라벨). controlled active. 등록 마법사.',
    props: [
      { name: 'active', kind: '기능', values: 'number (현재 단계 index)' },
      { name: 'steps', kind: '콘텐츠', values: '{ label, description? }[]' },
      { name: 'orientation', kind: '스타일', values: "'horizontal' | 'vertical'" },
      { name: 'onStepClick', kind: '기능', values: '(index) => void' },
    ] },
  { name: 'Transfer', layer: '유기체', role: '좌(선택가능)·우(선택됨) 듀얼 리스트 + 이동 버튼. 권한·항목 배정.',
    props: [
      { name: 'items', kind: '기능', values: '{ value, label }[]' },
      { name: 'selected / onChange', kind: '기능', values: 'controlled, string[]' },
      { name: 'titles', kind: '콘텐츠', values: '[소스, 타깃] 제목' },
    ],
    composition: {
      '의미 원자': ['Checkbox'],
      분자: ['IconButton', 'SectionHeader'],
      유기체: ['EmptyState'],
      '레이아웃 원자': ['Card'],
      '배치 프리미티브': ['Grid', 'Group', 'Stack'],
    } },
  { name: 'ToastHost', layer: '유기체', role: '토스트 호스트(위치·지속·스택 단일 관리). notify.*가 이리로 띄움. 앱 셸에 1회 배치.',
    props: [],
    composition: { 공유: ['notify(트리거)'] } },
  { name: 'DataTable', layer: '유기체', role: '도메인 무관 표. columns(표현 enum) + rows. controlled 정렬/페이징.',
    props: [
      { name: 'columns', kind: '기능', values: '{ key, label, type, span?, sortable? }[]' },
      { name: 'rows', kind: '기능', values: 'DataTableRow[]' },
      { name: 'type(셀)', kind: '값', values: 'text·badge·number·currency·date·boolean·actions·user·tags·link·percent·secondary·relative-time·thumbnail' },
      { name: 'status', kind: '스타일', values: "'loading' | 'empty' | 'ready'" },
      { name: 'sort / onSortChange', kind: '기능', values: 'controlled (정렬 가능 열엔 항상 옅은 꺽쇠)' },
      { name: 'page / onPageChange / totalPages', kind: '기능', values: 'Pagination 연결' },
      { name: 'totalCount', kind: '기능', values: 'number ("총 N건")' },
      { name: 'onRowClick', kind: '기능', values: '(row) => void (있을 때만 hover)' },
      { name: 'selectable / selectedIds / onSelectionChange / rowId', kind: '기능', values: '행 선택(체크박스 열, controlled)' },
      { name: 'bulkActions', kind: '기능', values: 'Action[] (선택 행 대상 툴바 — 페이지 액션은 ListPage)' },
      { name: 'emptyState', kind: '콘텐츠', values: '{ icon?, title, description? }' },
    ],
    composition: {
      토큰: ['행 sm / 헤더 xs(위계)', '--icon-baseline-shift(헤더 화살표)', 'number/currency 우측정렬'],
      '의미 원자': ['Icon', 'Text', 'Spinner'],
      '레이아웃 원자': ['Divider'],
      '배치 프리미티브': ['Stack'],
      분자: ['Pagination'],
      유기체: ['EmptyState'],
      공유: ['_cells(셀 type enum)'],
    } },
  { name: 'EmptyState', layer: '유기체', role: 'empty 전용(아이콘+제목+설명+[action]). 세로 중앙.',
    props: [
      { name: 'icon', kind: '콘텐츠', values: 'IconName' },
      { name: 'title / description', kind: '콘텐츠', values: 'string' },
      { name: 'action', kind: '기능', values: 'Action (선택 — 없으면 미조립)' },
    ],
    composition: {
      토큰: ['gap 위계', 'align=center', '아이콘 크기'],
      '의미 원자': ['Icon', 'Title', 'Text'],
      '배치 프리미티브': ['Stack'],
      공유: ['_cells(renderAction)'],
    } },
  { name: 'PageHeader', layer: '유기체', role: '페이지 상단 제목/설명(좌) + 액션(우).',
    props: [
      { name: 'title', kind: '콘텐츠', values: 'string' },
      { name: 'description', kind: '콘텐츠', values: 'string (선택)' },
      { name: 'status', kind: '콘텐츠', values: '{ label, tone } (선택 배지)' },
      { name: 'actions', kind: '기능', values: 'Action[] (우측, sm 고정)' },
    ],
    composition: {
      토큰: ['justify=between', 'Title heading', '액션 size=sm(제목이 주인공)'],
      '의미 원자': ['Title', 'Text', 'Badge'],
      '배치 프리미티브': ['Group', 'Stack'],
      공유: ['_cells(renderAction)'],
    } },
  { name: 'DescriptionList', layer: '유기체', role: '"라벨: 값" 쌍 나열(읽기 전용). 셀 타입 공유.',
    props: [
      { name: 'items', kind: '기능', values: '{ label, value, type }[]' },
      { name: 'columns', kind: '스타일', values: '1 | 2 | 3' },
    ],
    composition: {
      토큰: ['라벨 caption+secondary', '값 body+primary', 'minHeight lg(이종값 baseline)'],
      '의미 원자': ['Text'],
      '배치 프리미티브': ['Grid', 'Stack'],
      공유: ['_cells(셀 type enum)'],
    } },
  { name: 'AppShell', layer: '유기체', role: '페이지 전체 골격(좌 넷바 + 우상단 바 + 콘텐츠).',
    props: [
      { name: 'logo / onLogoClick', kind: '콘텐츠', values: 'ReactNode, () => void' },
      { name: 'menuItems / activePath / onNavigate', kind: '기능', values: '{ label, icon, path, group }[]' },
      { name: 'profile', kind: '콘텐츠', values: '{ name, role, email, menu?: Action[] }' },
      { name: 'notification', kind: '기능', values: '{ hasUnread?, onClick?, content? }' },
      { name: 'children', kind: '콘텐츠', values: 'ReactNode (콘텐츠 영역)' },
    ],
    composition: {
      토큰: ['넷바/상단바 골격·폭·높이', 'navy 그림자(떠있는 패널)', 'danger(안읽음 점)'],
      '의미 원자': ['Avatar', 'Icon', 'Popover', 'Text'],
      '레이아웃 원자': ['Divider'],
      '배치 프리미티브': ['Stack'],
      분자: ['IconButton'],
      공유: ['_cells(renderAction)'],
    } },
  { name: 'Timeline', layer: '유기체', role: '시간순 누적 이벤트(시각·작성자·구분·내용 말풍선).',
    props: [
      { name: 'events', kind: '기능', values: 'TimelineEvent[]' },
      { name: 'emptyState', kind: '콘텐츠', values: '{ icon?, title, description? }' },
    ],
    composition: {
      토큰: ['gap', 'caption(날짜 구분)', '말풍선 카드', 'category tone 배지'],
      '의미 원자': ['Avatar', 'Badge', 'Icon', 'Text'],
      '레이아웃 원자': ['Card'],
      '배치 프리미티브': ['Group', 'Stack'],
      유기체: ['EmptyState'],
      공유: ['_cells'],
    } },
  { name: 'Calendar', layer: '유기체', role: '월 달력(셀당 이벤트 배지 + 셀 클릭). 모달 비소유.',
    props: [
      { name: 'month / onMonthChange', kind: '기능', values: "'YYYY-MM' controlled" },
      { name: 'events', kind: '기능', values: 'CalendarEvent[]' },
      { name: 'onSelectDate', kind: '기능', values: '(date, dayEvents) => void' },
      { name: 'onSelectEvent', kind: '기능', values: '(event) => void' },
    ],
    composition: {
      토큰: ['7열 grid(calendar.css 명시예외)', 'tone 배지', 'gap', '오늘 강조'],
      '의미 원자': ['Badge', 'Title', 'Text'],
      '배치 프리미티브': ['Group', 'Stack'],
      분자: ['IconButton(이전/다음 달)'],
      공유: ['_cells', 'calendar.css'],
    } },
  { name: 'Tree', layer: '유기체', role: '재귀 계층 표시 + 펼침/접힘 + 선택 + 노드 ⋯메뉴 + 제자리 편집(범용).',
    props: [
      { name: 'nodes', kind: '기능', values: 'TreeNodeData[] ({id,label,children?})' },
      { name: 'selectedId / expandedIds', kind: '기능', values: 'controlled (선택·펼침)' },
      { name: 'onSelect / onToggle', kind: '기능', values: '콜백' },
      { name: 'title', kind: '콘텐츠', values: 'string (패널 헤더)' },
      { name: 'editable', kind: '스타일', values: 'boolean (⋯·추가 노출)' },
      { name: 'onAddRoot / onAddChild / onRename / onDelete', kind: '기능', values: '쓰기 위임(제자리 입력 → 콜백)' },
    ],
    composition: {
      토큰: ['들여쓰기 16px', '선택 강조 bg(primary-0)', 'gap'],
      '의미 원자': ['Icon(chevron/folder)', 'Text', 'TextInput(제자리 편집)'],
      '배치 프리미티브': ['Group', 'Stack'],
      분자: ['IconButton', 'Menu(노드 ⋯)'],
    } },

  // ── 템플릿 (3) + 폼 조립 조직 ────────────────────────────────────────
  { name: 'FormSection', layer: '템플릿', role: 'FieldSpec[]을 FormField + 입력 원자로 조립(조직). 도메인 무지.',
    props: [
      { name: 'fields', kind: '기능', values: 'FieldSpec[] (스키마)' },
      { name: 'values / onChange', kind: '기능', values: 'controlled 폼 값' },
      { name: 'columns', kind: '스타일', values: '1 | 2' },
      { name: 'resolvers', kind: '기능', values: 'lookupKey→조회함수(코드 주입)' },
      { name: 'errors', kind: '콘텐츠', values: 'Record<name, message> (Zod 결과)' },
    ],
    composition: {
      토큰: ['gap', '1열 Stack / 2열 Grid', '마스크·조건부 토글'],
      '의미 원자': ['TextInput', 'NumberInput', 'Textarea', 'Select', 'DatePicker', 'Checkbox', 'Button', 'Icon'],
      '배치 프리미티브': ['Grid', 'Group', 'Stack'],
      분자: ['FormField'],
      공유: ['_masks'],
    } },
  { name: 'ListPage', layer: '템플릿', role: '목록 골격(헤더 + 테이블 카드 + 푸터). 도메인 0줄.',
    props: [
      { name: 'schema', kind: '기능', values: '{ title, columns, primaryAction?, toolbar?, emptyState? ... }' },
      { name: 'rows', kind: '기능', values: 'DataTableRow[]' },
      { name: 'status', kind: '스타일', values: "'loading' | 'empty' | 'ready'" },
      { name: 'sort / page / totalPages / totalCount', kind: '기능', values: 'controlled' },
      { name: 'onRowClick / onFilterClick', kind: '기능', values: '콜백' },
    ],
    composition: {
      토큰: ['Container wide', 'Stack lg', 'Card elevated padding=none'],
      '의미 원자': ['Icon', 'SegmentedControl(toolbar)'],
      '레이아웃 원자': ['Card', 'Container'],
      '배치 프리미티브': ['Stack'],
      유기체: ['PageHeader', 'DataTable'],
      공유: ['_cells'],
    } },
  { name: 'DetailPage', layer: '템플릿', role: '상세 골격(좌 정보 / 우 폼 2분할). 폼은 선택.',
    props: [
      { name: 'title / description', kind: '콘텐츠', values: 'string' },
      { name: 'actions', kind: '기능', values: 'Action[]' },
      { name: 'info', kind: '기능', values: '{ heading?, items, columns? } (DescriptionList)' },
      { name: 'form', kind: '기능', values: '{ fields, values, onChange, resolvers?, errors?, footer? } (선택)' },
    ],
    composition: {
      토큰: ['Container wide', 'Grid 2분할', 'Card elevated lg'],
      '의미 원자': ['Title'],
      '레이아웃 원자': ['Card', 'Container'],
      '배치 프리미티브': ['Grid', 'Group', 'Stack'],
      유기체: ['PageHeader', 'DescriptionList'],
      템플릿: ['FormSection'],
      공유: ['_cells'],
    } },
  { name: 'HierarchyExplorer', layer: '템플릿', role: '계층 기반 마스터-디테일(좌 디렉토리 트리 / 우 오브젝트). Unity·Figma·VSCode 멘탈모델. 페이지 템플릿(PageHeader 내장).',
    props: [
      { name: 'title / description / status / actions', kind: '콘텐츠', values: 'PageHeader(고정) — title 필수' },
      { name: 'nodes / selectedId / expandedIds', kind: '기능', values: '트리(controlled)' },
      { name: 'onSelect / onToggle / onAddRoot / onAddChild / onRename / onDelete', kind: '기능', values: '쓰기·선택 위임' },
      { name: 'editable / treeTitle', kind: '스타일', values: 'boolean / string' },
      { name: 'objects', kind: '기능', values: 'HierarchyObject[] (선택 디렉토리 직속만)' },
      { name: 'onAddObject', kind: '기능', values: '() => void' },
      { name: 'page / onPageChange / totalPages', kind: '기능', values: 'Pagination(controlled)' },
    ],
    composition: {
      토큰: ['Container wide', '단일 elevated 카드', '좌측 고정폭 280', '고정높이 70vh+내부 스크롤', '오브젝트 grid auto-fill'],
      '레이아웃 원자': ['Card', 'Container'],
      '배치 프리미티브': ['Group', 'Stack'],
      '의미 원자': ['Button', 'Icon'],
      분자: ['Pagination', 'ObjectCard', 'SectionHeader', 'Breadcrumb'],
      유기체: ['Tree', 'EmptyState', 'PageHeader'],
    } },
  { name: 'PageGrid', layer: '템플릿', role: '페이지 공간을 닫힌 격자로 — 위젯이 정수 칸 점유(iOS 홈/Bento). 크기 변주가 위계.',
    props: [
      { name: 'columns', kind: '값', values: '2 | 3 | 4 | 6 | 12 (닫힌 열 수)' },
      { name: 'gap', kind: '값', values: "'sm' | 'md' | 'lg'" },
      { name: 'PageGrid.Tile colSpan', kind: '값', values: '1..columns (위젯 가로 칸)' },
      { name: 'PageGrid.Tile rowSpan', kind: '값', values: '1 | 2 | 3 (고정 타일 세로 칸)' },
    ],
    composition: {
      토큰: ['닫힌 columns', '고정 셀 140px(가변 높이 불허)', 'gap 토큰', 'raw CSS grid(명시 예외)'],
    } },
];

// ── 그래프 헬퍼 (박물관 하이퍼링크·역참조) ──
export const LAYERS: Layer[] = ['의미 원자', '레이아웃 원자', '배치 프리미티브', '분자', '유기체', '템플릿'];
export const PART_NAMES = new Set(CATALOG.map((e) => e.name));
export const findEntry = (name: string): CatalogEntry | undefined => CATALOG.find((e) => e.name === name);

// 구성요소 칩 문자열에서 부품명만 추출 — 'Title(count)'→'Title', 'Group (헤더…)'→'Group', '아이콘박스'→그대로(비부품).
export const basePart = (entry: string): string => entry.split(/[ (]/)[0];

// 역참조: 이 부품을 구성요소로 쓰는 부품들("쓰인 곳").
export function usedBy(name: string): string[] {
  return CATALOG.filter((e) =>
    e.composition && Object.values(e.composition).some((arr) => (arr ?? []).some((v) => basePart(v) === name)),
  ).map((e) => e.name);
}
