'use client';
// HierarchyExplorer (템플릿) — 계층(디렉토리) 기반 마스터-디테일 표준. 멘탈모델: Unity Hierarchy / Figma Layers / VSCode Explorer.
//  · 페이지 템플릿(ListPage·DetailPage 동급): Container wide + 고정 PageHeader + 단일 elevated 카드(좌/우 구획).
//    "AppShell + PageHeader 모든 화면 고정"을 구조로 보장 — 페이지 파일은 데이터·콜백만 주입. (카드 안은 수직 경계로 좌/우, 카드 2개 아님.)
//  · 좌: Tree(디렉토리 탐색·수정, 고정폭) / 우: 선택된 디렉토리의 품목(추가·나열·페이지·빈상태, 가변폭).
//  · 고정 높이 위젯 + 패널 내부 스크롤 → 펼침/접힘에 카드 크기 불변(jitter 0). scrollbar-gutter로 스크롤바 폭 변동 차단.
//  · 순수 표현 — 데이터·렌더는 닫힌 스키마 주입, 모든 쓰기·선택은 콜백 위임. 오브젝트는 닫힌 ObjectCard 스키마(자유 render 0).
//  · 불변식: 오브젝트는 정확히 한 디렉토리 / 직속만(하위 끌어올림 없음) / 단일 트리·단일 스코프.
import { Card } from './Card';
import { Container } from './Container';
import { Stack } from './Stack';
import { Group } from './Group';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import { SectionHeader } from './SectionHeader';
import { PageHeader } from './PageHeader';
import { Breadcrumb } from './Breadcrumb';
import { Tree, type TreeNodeData } from './Tree';
import { ObjectCard, type ObjectField } from './ObjectCard';
import type { Action, BadgeColor } from './_cells';

// 선택 노드의 조상 경로(자신 포함) — 우측 브레드크럼용.
function findPath(nodes: TreeNodeData[], id: string): TreeNodeData[] {
  for (const n of nodes) {
    if (n.id === id) return [n];
    if (n.children) {
      const sub = findPath(n.children, id);
      if (sub.length) return [n, ...sub];
    }
  }
  return [];
}

export type HierarchyObject = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: { label: string; tone: BadgeColor };
  thumbnail?: string;
  fields?: ObjectField[];
  actions?: Action[];
  onClick?: () => void;
};

type Props = {
  // 페이지 헤더(고정) — PageHeader 현재 구조 그대로. AppShell 아래 모든 화면 공통 정체성 밴드.
  title: string;
  description?: string;
  status?: { label: string; tone: BadgeColor };
  actions?: Action[];
  // 좌: 디렉토리 트리 (controlled)
  nodes: TreeNodeData[];
  selectedId?: string | null;
  expandedIds: string[];
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  treeTitle?: string;
  editable?: boolean;
  onAddRoot?: (label: string) => void;
  onAddChild?: (parentId: string, label: string) => void;
  onRename?: (id: string, label: string) => void;
  onDelete?: (id: string) => void;
  // 우: 선택된 디렉토리의 오브젝트(소비처가 직속만 필터해 주입)
  selectedLabel?: string;
  objects: HierarchyObject[];
  onAddObject?: () => void;
  page?: number;
  onPageChange?: (page: number) => void;
  totalPages?: number;
};

const EXPLORER_HEIGHT = '70vh'; // 잠정 vh — 고정 높이 위젯(펼침/접힘에 카드 크기 불변). Modal 85vh 선례와 동류 명시 예외.
const LEFT_WIDTH = 280;          // Explorer 좌측 고정폭(Unity/VSCode 관습) — 비율이 아니라 고정이라 내용 변동에도 폭 불변.
const PANE = { overflowY: 'auto', scrollbarGutter: 'stable' } as const; // 스크롤바 자리 미리 확보 → 폭 jitter 차단.

export function HierarchyExplorer(props: Props) {
  const {
    title, description, status, actions,
    nodes, selectedId, expandedIds, onSelect, onToggle, treeTitle, editable,
    onAddRoot, onAddChild, onRename, onDelete,
    selectedLabel, objects, onAddObject, page, onPageChange, totalPages,
  } = props;

  const hasPagination = typeof page === 'number' && typeof totalPages === 'number' && !!onPageChange;

  const right = () => {
    // 디렉토리 미선택: 헤더 없이 가운데 안내.
    if (selectedId == null) {
      return <div style={{ margin: 'auto' }}><EmptyState icon="folder" title="디렉토리를 선택하세요" description="왼쪽 트리에서 디렉토리를 고르면 품목이 표시됩니다." /></div>;
    }
    // 디렉토리 선택됨: 헤더 = 인터랙티브 브레드크럼(현재 위치 + 상위로 이동) + 액션(영속, 빈 상태에도 유지).
    //  · 정적 제목 헤더 대신 브레드크럼 행 자체가 헤더(SectionHeader titleNode로 주입 — 좌/우 헤더 밴드 정렬 공유).
    const path = findPath(nodes, selectedId);
    const crumbs = path.length
      ? path.map((n) => ({ label: n.label, onClick: () => onSelect(n.id) }))
      : [{ label: selectedLabel ?? '품목' }];
    return (
      <Stack gap="md">
        <SectionHeader
          titleNode={<Breadcrumb items={crumbs} />}
          divider
          actions={onAddObject ? [{ label: '품목 추가', variant: 'primary', icon: 'plus', onClick: onAddObject }] : undefined}
        />
        {objects.length === 0 ? (
          <EmptyState icon="box" title="이 디렉토리에 품목이 없습니다" description="위 ‘품목 추가’ 버튼으로 첫 품목을 더하세요." />
        ) : (
          <>
            {/* 반응형 auto-fill 그리드 — 폭 따라 열 수 자동. 한 행 카드 높이는 stretch+ObjectCard fill로 통일. */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--mantine-spacing-md)', alignItems: 'stretch' }}>
              {objects.map((o) => (
                <ObjectCard key={o.id} title={o.title} subtitle={o.subtitle} badge={o.badge} thumbnail={o.thumbnail} fields={o.fields} actions={o.actions} onClick={o.onClick} />
              ))}
            </div>
            {hasPagination && (
              <Group justify="center" align="center">
                <Pagination total={totalPages!} value={page!} onChange={onPageChange!} />
              </Group>
            )}
          </>
        )}
      </Stack>
    );
  };

  return (
    // 페이지 템플릿: Container wide + 고정 PageHeader + 단일 elevated 카드(좌/우 구획).
    <Container maxWidth="wide">
      <Stack gap="lg">
        <PageHeader title={title} description={description} status={status} actions={actions} />
        <Card variant="elevated" padding="none">
          <div style={{ display: 'flex', alignItems: 'stretch', height: EXPLORER_HEIGHT }}>
            {/* 좌: 고정폭 트리 패널, 내부 스크롤 */}
            <div style={{ width: LEFT_WIDTH, flexShrink: 0, padding: 'var(--mantine-spacing-md)', ...PANE }}>
              <Tree
                nodes={nodes} selectedId={selectedId} expandedIds={expandedIds} onSelect={onSelect} onToggle={onToggle}
                title={treeTitle ?? '디렉토리'} editable={editable}
                onAddRoot={onAddRoot} onAddChild={onAddChild} onRename={onRename} onDelete={onDelete}
              />
            </div>
            {/* 우: 가변폭 품목 영역, 내부 스크롤. 패딩은 좌측과 동일(md)로 두 패널 헤더의 세로 시작점을 맞춘다. */}
            <div style={{ flex: 1, minWidth: 0, padding: 'var(--mantine-spacing-md)', borderLeft: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', ...PANE }}>
              {right()}
            </div>
          </div>
        </Card>
      </Stack>
    </Container>
  );
}
