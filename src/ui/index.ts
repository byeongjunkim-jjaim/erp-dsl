// ─────────────────────────────────────────────────────────────
// 배럴. 바깥 세계가 보는 유일한 문은 '@/ui' 하나다.
// ─────────────────────────────────────────────────────────────

// 표시·행동 원자
export { Button } from './Button';
export { Badge } from './Badge';
export { Chip } from './Chip';
export { Text } from './Text';
export { Title } from './Title';
export { Label } from './Label';
export { Anchor } from './Anchor';
export { Icon, type IconName } from './Icon';
export { Avatar } from './Avatar';
export { Image } from './Image';
export { Tooltip } from './Tooltip';
export { Popover } from './Popover';
export { Spinner } from './Spinner';
export { SegmentedControl } from './SegmentedControl';
export { TabBar } from './TabBar';

// 입력군
export { TextInput } from './TextInput';
export { PasswordInput } from './PasswordInput';
export { NumberInput } from './NumberInput';
export { Textarea } from './Textarea';
export { Select } from './Select';
export { DatePicker } from './DatePicker';
export { MultiDatePicker } from './MultiDatePicker';
export { Checkbox } from './Checkbox';
export { Switch } from './Switch';
export { Radio } from './Radio';

// 레이아웃 원자
export { Card } from './Card';
export { Divider } from './Divider';
export { Container } from './Container';

// 배치 프리미티브
export { Stack } from './Stack';
export { Group } from './Group';
export { Grid } from './Grid';

// 분자 6
export { FormField } from './FormField';
export { MultiSelect } from './MultiSelect';
export { DateRangeField } from './DateRangeField';
export { InputGroup } from './InputGroup';
export { FileUploader, type FileItem } from './FileUploader';
export { Pagination } from './Pagination';
export { Callout } from './Callout';
export { StatusRow } from './StatusRow';
export { SummaryCard } from './SummaryCard';
export { TotalRow } from './TotalRow';
export { Menu } from './Menu';
export { ObjectCard, type ObjectField } from './ObjectCard';
export { SectionHeader } from './SectionHeader';
export { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

// 유기체
export { Modal } from './Modal';
export { DataTable } from './DataTable';
export { EmptyState } from './EmptyState';
export { PageHeader } from './PageHeader';
export { DescriptionList } from './DescriptionList';
export { AppShell } from './AppShell';
export { Timeline } from './Timeline';
export { Calendar } from './Calendar';
export { IconButton } from './IconButton';
export { Tree, type TreeNodeData } from './Tree';

// 템플릿 + 폼 조립 (스키마 구동)
export { FormSection } from './FormSection';
export { ListPage } from './ListPage';
export { DetailPage } from './DetailPage';
export { HierarchyExplorer, type HierarchyObject } from './HierarchyExplorer';
export { PageGrid } from './PageGrid';
export { buildHierarchyFromRows, type HierarchyImport } from './hierarchyImport';
export type { DataTableColumn, DataTableRow, DataTableSort } from './DataTable';

// 유기체 공유 타입 (스키마 작성자가 쓰는 어휘)
export type { CellType, Action, ActionVariant, BadgeColor } from './_cells';

// App Router 배선 (src/ui 안에서만 @mantine/core를 만질 수 있어 여기서 노출)
export { Providers } from './Providers';
export { notify } from './notify';
export { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

// 0~1단계 시각 검증용 dev 프리뷰 (DSL 부품 아님)
// ── dev 갤러리(DevTokenPreview/DevAtomGallery/…)는 공개 API 아님 — 검증용 도구.
//    데모 앱은 './_dev'에서 import하고, publish 시 _dev·_Dev*는 제외(.npmignore).
