'use client';
// HierarchyExplorer (템플릿) — 계층(디렉토리) 기반 마스터-디테일 표준. 멘탈모델: Unity Hierarchy / Figma Layers / VSCode Explorer.
//  · 페이지 템플릿(ListPage·DetailPage 동급): Container wide + 고정 PageHeader + 단일 elevated 카드(좌/우 구획).
//    "AppShell + PageHeader 모든 화면 고정"을 구조로 보장 — 페이지 파일은 데이터·콜백만 주입. (카드 안은 수직 경계로 좌/우, 카드 2개 아님.)
//  · 좌: Tree(디렉토리 탐색·수정, 고정폭) / 우: 선택된 디렉토리의 품목(추가·나열·페이지·빈상태, 가변폭).
//  · 고정 높이 위젯 + 패널 내부 스크롤 → 펼침/접힘에 카드 크기 불변(jitter 0). scrollbar-gutter로 스크롤바 폭 변동 차단.
//  · 순수 표현 — 데이터·렌더는 닫힌 스키마 주입, 모든 쓰기·선택은 콜백 위임. 오브젝트는 닫힌 ObjectCard 스키마(자유 render 0).
//  · 불변식: 오브젝트는 정확히 한 디렉토리 / 직속만(하위 끌어올림 없음) / 단일 트리·단일 스코프.
import { useState, type ReactNode } from 'react';
import { Card } from './Card';
import { Container } from './Container';
import { Stack } from './Stack';
import { Group } from './Group';
import { Text } from './Text';
import { SegmentedControl } from './SegmentedControl';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import { SectionHeader } from './SectionHeader';
import { PageHeader } from './PageHeader';
import { Breadcrumb } from './Breadcrumb';
import { Tree, type TreeNodeData } from './Tree';
import { ObjectCard, type ObjectField, type ObjectCardLayout } from './ObjectCard';
import { InputGroup } from './InputGroup';
import { TextInput } from './TextInput';
import { Icon } from './Icon';
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

// 전역 검색 결과 = 오브젝트 + 그것이 속한 디렉토리 경로(루트→집, 마지막=집 디렉토리).
//  불변식상 오브젝트는 한 디렉토리에만 속하므로 결과 중복은 0 — 동명 결과는 경로(조상)로 구분한다.
export type HierarchySearchResult = HierarchyObject & {
  path: { id: string; label: string }[];
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
  // 우측 전역 검색 (controlled — 필터의 진실은 소비처. onSearchChange 주면 검색 바 노출, 쿼리 있으면 결과 모드 전환).
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchResults?: HierarchySearchResult[];
};

const EXPLORER_HEIGHT = '70vh'; // 잠정 vh — 고정 높이 위젯(펼침/접힘에 카드 크기 불변). Modal 85vh 선례와 동류 명시 예외.
const LEFT_WIDTH = 280;          // Explorer 좌측 고정폭(Unity/VSCode 관습) — 비율이 아니라 고정이라 내용 변동에도 폭 불변.
const PANE = { overflowY: 'auto', scrollbarGutter: 'stable' } as const; // 스크롤바 자리 미리 확보 → 폭 jitter 차단.
// 상세(카드) 뷰 배치 — 12-span 체제(토큰)에서 **각 칸 = span 3 → 4열**. span 3이 이 grid 위치의 가로 최소 footprint다.
//  아이템 수와 무관하게 항상 4열(2개면 좌측 2칸만, 나머지 빈 채 — "아이템 수로 동적 분할" 아님).
//  높이는 ROW_UNIT 고정이 아니라 내용 기준(alignItems:start) — 위젯 내부 grid는 가로만 분할, 그 아래 헌법 폭분배 복원.
//  ObjectCard는 폭을 갖지 않는다 — 폭은 여기 grid가 분배(「01」 "부품은 자기 폭을 정하지 않는다").
const GRID = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--mantine-spacing-md)', alignItems: 'start' } as const;
// 폴더(하위 분류) 타일 그리드 — 품목 카드와 *같은 footprint*(4열)로 통일. (이전 6열=1x1은 라벨이 줄바꿈돼 너무 좁았다.)
//  품목·폴더가 같은 가로폭이라 폴더↔품목 전환 시 칸 크기가 안 바뀐다.
const FOLDER_GRID = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--mantine-spacing-md)', alignItems: 'start' } as const;

export function HierarchyExplorer(props: Props) {
  const {
    title, description, status, actions,
    nodes, selectedId, expandedIds, onSelect, onToggle, treeTitle, editable,
    onAddRoot, onAddChild, onRename, onDelete,
    selectedLabel, objects, onAddObject, page, onPageChange, totalPages,
    searchQuery, onSearchChange, searchResults,
  } = props;

  // 뷰 모드(카드/목록) — 순수 표현 토글이라 내부 상태(도메인 아님, Tree 인라인편집 상태와 동류). 기본 card.
  const [view, setView] = useState<ObjectCardLayout>('card');
  const hasPagination = typeof page === 'number' && typeof totalPages === 'number' && !!onPageChange;

  // 우측 패널 탐색(폴더 타일·브레드크럼·검색결과)에서 노드로 점프 — 좌측 트리에서 그 노드가 보이도록
  //  경로 상 접힌 조상(및 폴더인 대상)을 자동으로 펼친 뒤 선택. onToggle은 *접힌 것만*(현재 expandedIds 기준) 펼친다
  //  (이미 펼친 노드는 안 건드림 — 토글이라 그냥 부르면 접혀버리므로 가드). 펼침 상태 주인은 소비처(controlled).
  const navigateTo = (id: string) => {
    findPath(nodes, id).forEach((n) => {
      if (n.children && n.children.length > 0 && !expandedIds.includes(n.id)) onToggle(n.id);
    });
    onSelect(id);
  };

  // 컬렉션 — 뷰에 따라 카드는 auto-fill 그리드(세로 갤러리), 목록은 세로 풀폭 행 나열.
  const collection = (children: ReactNode) =>
    view === 'row' ? <Stack gap="sm">{children}</Stack> : <div style={GRID}>{children}</div>;
  const objCard = (o: HierarchyObject) => (
    <ObjectCard key={o.id} title={o.title} subtitle={o.subtitle} badge={o.badge} thumbnail={o.thumbnail}
      fields={o.fields} actions={o.actions} onClick={o.onClick} layout={view} />
  );
  // 하위 분류 타일 — 폴더 아이콘(노드가 icon을 주면 그걸, 아니면 보편 folder) + 라벨. 클릭=드릴다운(onSelect).
  const folderTile = (c: TreeNodeData) => (
    <div key={c.id} onClick={() => navigateTo(c.id)} style={{ cursor: 'pointer' }}>
      <Card variant="outlined" padding="sm">
        <Group gap="sm" align="center" wrap={false}>
          <Icon name={c.icon ?? 'folder'} size="lg" color="secondary" />
          <Text variant="body-strong">{c.label}</Text>
        </Group>
      </Card>
    </div>
  );

  // 우측 패널 = [헤더 바(브레드크럼/제목 + 검색·뷰토글 + 액션, 한 줄 병합, 고정)] / [본문 스크롤] / [pagination 풋터(고정)].
  const right = () => {
    const searching = !!onSearchChange && (searchQuery ?? '').trim() !== '';
    // 선택 노드 상태(폴더/잎) 선계산 — 토글 노출·+추가 판정에 쓴다.
    const path = selectedId != null ? findPath(nodes, selectedId) : [];
    const selectedNode = path.length ? path[path.length - 1] : undefined;
    const isLeaf = selectedNode ? !(selectedNode.children && selectedNode.children.length > 0) : false;
    // 뷰 토글은 object 카드를 보여줄 때만 의미(검색결과·잎). 폴더 타일/미선택 안내엔 card/list 개념이 없어 숨긴다.
    const showsObjects = searching || (selectedId != null && isLeaf);
    // '+ 추가' 가능 = 잎 + 추가가능. (헤더 우측 액션 vs 빈상태 CTA로 갈린다 — 아래 headerActions/EmptyState.)
    const canAdd = !searching && isLeaf && !!onAddObject;

    // 헤더 좌측 도구 — **검색이 좌측 앵커(항상)**, seg는 그 오른쪽에 showsObjects일 때만 → seg가 생겨도/사라져도
    //  검색 위치가 안 변한다. 우측은 액션 존이라 도구(검색·토글)는 좌측(제목 옆)에 둔다.
    const controls = (
      <Group gap="sm" align="center" wrap={false}>
        {onSearchChange && (
          <div style={{ width: 220 }}>
            <InputGroup leftAddon={<Icon name="search" size="sm" />}>
              <TextInput value={searchQuery ?? ''} onChange={onSearchChange} placeholder="품목 검색" />
            </InputGroup>
          </div>
        )}
        {showsObjects && (
          <SegmentedControl
            options={[{ label: '카드', value: 'card' }, { label: '목록', value: 'row' }]}
            value={view} onChange={(v) => setView(v as ObjectCardLayout)} size="sm"
          />
        )}
      </Group>
    );

    // 품목 추가 = 헤더 *우측* 액션 존. 단 **품목이 있을 때만** 노출 — 빈 잎은 EmptyState의 추가 CTA가 대신한다
    //  (배타: 채워짐→헤더 버튼 / 빔→EmptyState CTA). 둘 다 같은 onAddObject. +타일·이중 노출 중복 제거.
    const headerActions: Action[] | undefined =
      canAdd && objects.length > 0
        ? [{ label: '품목 추가', variant: 'primary', icon: 'plus', onClick: onAddObject! }]
        : undefined;

    let headerTitleNode: ReactNode;
    let headerTitle: string | undefined;
    let headerDesc: string | undefined;
    let bodyNode: ReactNode;

    if (searching) {
      // 검색 모드: 결과(각 결과에 경로 Breadcrumb). 트리 불변, 결과 클릭=집 점프+검색 해제. 중복은 불변식상 0.
      const results = searchResults ?? [];
      headerTitle = '검색 결과';
      headerDesc = `${results.length}건`;
      bodyNode = results.length === 0
        ? <EmptyState icon="search" title="검색 결과가 없습니다" description={`‘${searchQuery}’와(과) 일치하는 품목이 없습니다.`} />
        : collection(results.map((r) => (
            <Stack key={r.id} gap="xxs">
              <Breadcrumb items={r.path.map((n) => ({ label: n.label, onClick: () => { navigateTo(n.id); onSearchChange!(''); } }))} />
              {objCard(r)}
            </Stack>
          )));
    } else if (selectedId == null) {
      // 미선택: 헤더엔 컨트롤만, 본문은 가운데 안내.
      bodyNode = <div style={{ margin: 'auto' }}><EmptyState icon="folder" title="디렉토리를 선택하세요" description="왼쪽 트리에서 디렉토리를 고르면 품목이 표시됩니다." /></div>;
    } else {
      // 디렉토리 선택: 헤더 = 브레드크럼. 본문 = 폴더면 하위 분류 타일, 잎이면 +타일 + 품목 컬렉션/빈상태.
      const crumbs = path.length
        ? path.map((n) => ({ label: n.label, onClick: () => navigateTo(n.id) }))
        : [{ label: selectedLabel ?? '품목' }];
      headerTitleNode = <Breadcrumb items={crumbs} />;
      if (!isLeaf) {
        // 폴더: 하위 분류를 클릭 가능한 폴더 타일로(빈 상태 텍스트 대신 — 폴더는 하위를 드러내야 로직상 맞다). 품목 추가 없음.
        const children = selectedNode?.children ?? [];
        bodyNode = children.length === 0
          ? <EmptyState icon="folder" title="비어 있는 분류입니다" />
          : <div style={FOLDER_GRID}>{children.map((c) => folderTile(c))}</div>;
      } else {
        // 잎: 품목 컬렉션 / 빈상태. 추가가능+빈 → EmptyState 추가 CTA(헤더 액션은 숨고 여기로). 읽기전용+빈 → 안내만.
        bodyNode = objects.length > 0
          ? collection(objects.map((o) => objCard(o)))
          : canAdd
            ? <EmptyState icon="box" title="품목이 없습니다" description="첫 품목을 추가하세요." action={{ label: '품목 추가', variant: 'primary', icon: 'plus', onClick: onAddObject! }} />
            : <EmptyState icon="box" title="등록된 품목이 없습니다" />;
      }
    }

    return (
      <>
        {/* 헤더 바(고정) — 좌: 브레드크럼/제목 + 검색·뷰토글(좌측 앵커) / 우: 품목추가(액션 존, 품목 있을 때만). */}
        <div style={{ flexShrink: 0, padding: 'var(--mantine-spacing-md) var(--mantine-spacing-md) 0' }}>
          <SectionHeader titleNode={headerTitleNode} title={headerTitle} description={headerDesc} controls={controls} actions={headerActions} divider />
        </div>
        {/* 본문(스크롤) — 헤더 아래 컬렉션/빈상태만 스크롤. */}
        <div style={{ flex: 1, minHeight: 0, padding: 'var(--mantine-spacing-md)', ...PANE }}>
          {bodyNode}
        </div>
        {/* pagination 풋터(고정, 스크롤과 분리). 상단 구분선으로 표↔페이지 경계. */}
        {hasPagination && (
          <div style={{ flexShrink: 0, borderTop: '1px solid var(--border-default)', padding: 'var(--mantine-spacing-sm) var(--mantine-spacing-md)' }}>
            <Group justify="center" align="center"><Pagination total={totalPages!} value={page!} onChange={onPageChange!} /></Group>
          </div>
        )}
      </>
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
            {/* 우: 가변폭 품목 영역. 스크롤은 내부 "중단"이 소유(컨트롤 스트립·pagination 풋터는 고정).
                패딩도 각 구간이 직접 가져 좌측 패널 헤더와 세로 시작점을 맞춘다. */}
            <div style={{ flex: 1, minWidth: 0, borderLeft: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {right()}
            </div>
          </div>
        </Card>
      </Stack>
    </Container>
  );
}
