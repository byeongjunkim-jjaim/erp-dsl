'use client';
// Tree (유기체) — 재귀 계층 표시. 펼침/접힘 + 선택 강조 + 노드 ⋯메뉴(하위추가·이름변경·삭제) + 제자리 편집.
//  · controlled: 선택(selectedId)·펼침(expandedIds)·쓰기(onAdd*/onRename/onDelete) 전부 콜백 위임(순수 표현).
//  · 편집 UI(어느 노드를 제자리 입력 중인가)만 Tree 내부 ephemeral 상태. 확정/취소로 콜백 호출.
//  · 깊이 = VS Code식 들여쓰기 가이드 직선(꺽쇠 앞 세로선). 선택 강조는 full-width지만 가이드선으로 깊이가 항상 보임.
//  · DnD 없음 / 더블·우클릭 편집 없음(⋯ 메뉴로만) / 보기 전용 모드(editable=false → ⋯·추가 숨김).
import { Fragment, useState } from 'react';
import { Stack } from './Stack';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { IconButton } from './IconButton';
import { Menu } from './Menu';
import { SectionHeader } from './SectionHeader';

// icon은 옵션 — 기본 아이콘 없음(라벨만). 필요 시 노드별로 지정(rule of three).
export type TreeNodeData = { id: string; label: string; icon?: IconName; children?: TreeNodeData[] };

type Props = {
  nodes: TreeNodeData[];
  selectedId?: string | null;
  expandedIds: string[];
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  title?: string;
  editable?: boolean;
  onAddRoot?: (label: string) => void;
  onAddChild?: (parentId: string, label: string) => void;
  onRename?: (id: string, label: string) => void;
  onDelete?: (id: string) => void;
};

const INDENT = 16;
// 행 높이 고정 — ⋮ 메뉴(IconButton sm) 유무로 행 높이가 달라지면 이름변경 시 상하 이동이 생긴다.
// 두 모드(노드/인라인 입력) 모두 동일 고정 높이라 모드 전환에 레이아웃 시프트 0.
const ROW_H = 36;

export function Tree({
  nodes, selectedId, expandedIds, onSelect, onToggle,
  title, editable = false, onAddRoot, onAddChild, onRename, onDelete,
}: Props) {
  const expanded = new Set(expandedIds);
  const [editing, setEditing] = useState<{ mode: 'rename' | 'addChild' | 'addRoot'; id?: string } | null>(null);
  const [draft, setDraft] = useState('');

  const startRename = (n: TreeNodeData) => { setEditing({ mode: 'rename', id: n.id }); setDraft(n.label); };
  const startAddChild = (id: string) => { setEditing({ mode: 'addChild', id }); setDraft(''); if (!expanded.has(id)) onToggle(id); };
  const startAddRoot = () => { setEditing({ mode: 'addRoot' }); setDraft(''); };
  const cancel = () => setEditing(null);
  const confirm = () => {
    if (!editing) return;            // Enter→unmount→blur 중복 호출 가드(Esc 취소 후 blur도 무효화)
    const v = draft.trim();
    if (v) {
      if (editing.mode === 'rename' && editing.id) onRename?.(editing.id, v);
      else if (editing.mode === 'addChild' && editing.id) onAddChild?.(editing.id, v);
      else if (editing.mode === 'addRoot') onAddRoot?.(v);
    }
    setEditing(null);
  };

  // 깊이별 세로 가이드선(VS Code식). 행이 붙어 있어(컨테이너 gap 0) 세그먼트가 연속선으로 이어진다.
  const guides = (depth: number) =>
    Array.from({ length: depth }).map((_, i) => (
      <span key={i} style={{ width: INDENT, flexShrink: 0, alignSelf: 'stretch', borderLeft: '1px solid var(--border-default)' }} />
    ));

  // VS Code식 제자리 인라인 편집 — 그 자리에 노드 모양(가이드선+꺽쇠칸)으로 입력. Enter=확정 / Esc=취소 / blur=확정.
  //  · **컴포넌트(<InlineRow/>)가 아니라 함수 호출**로 둔다 — 컴포넌트로 두면 매 렌더 타입이 새로 생겨 input이
  //    글자마다 remount(포커스·크기 흔들림). 함수면 같은 위치에서 재사용돼 remount 0.
  //  · 폭은 가용 영역을 채우는 고정폭(flex) — size(글자 수) 기반은 타이핑 중 폭이 변해 제외. 패널(닫힌 280)엔 영향 0.
  const renderInline = (depth: number) => (
    <div style={{ display: 'flex', alignItems: 'center', height: ROW_H, paddingLeft: 8, paddingRight: 8 }}>
      {guides(depth)}
      <span style={{ width: 16, flexShrink: 0 }} />
      {/* 스타일은 controls.css(.erpTreeEdit) — 라벨과 폰트·텍스트 위치 일치 + full 폭 + 얇은 윤곽·음영. */}
      <input
        autoFocus
        className="erpTreeEdit"
        value={draft}
        onChange={(e) => setDraft(e.currentTarget.value)}
        onFocus={(e) => e.currentTarget.select()}    /* 이름 변경 시 기존 값 전체 선택(바로 덮어쓰기) */
        onKeyDown={(e) => { if (e.key === 'Enter') confirm(); else if (e.key === 'Escape') cancel(); }}
        onBlur={confirm}
      />
    </div>
  );

  const renderNodes = (list: TreeNodeData[], depth: number): React.ReactNode =>
    list.map((node) => {
      const hasChildren = !!node.children && node.children.length > 0;
      const isOpen = expanded.has(node.id);
      const isSel = selectedId === node.id;
      const isRenaming = editing?.mode === 'rename' && editing.id === node.id;
      return (
        <Fragment key={node.id}>
          {isRenaming ? (
            renderInline(depth)
          ) : (
            <div
              onClick={() => onSelect(node.id)}
              style={{
                display: 'flex', alignItems: 'center', height: ROW_H,
                paddingLeft: 8, paddingRight: 8, cursor: 'pointer',
                background: isSel ? 'var(--mantine-color-primary-0)' : 'transparent',
              }}
            >
              {guides(depth)}
              {hasChildren ? (
                <span onClick={(e) => { e.stopPropagation(); onToggle(node.id); }} style={{ display: 'inline-flex', cursor: 'pointer', flexShrink: 0 }}>
                  <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size="sm" color="secondary" />
                </span>
              ) : (
                <span style={{ width: 16, flexShrink: 0 }} />
              )}
              {node.icon && <span style={{ display: 'inline-flex', flexShrink: 0, marginLeft: 4 }}><Icon name={node.icon} size="sm" color="secondary" /></span>}
              <div style={{ flex: 1, minWidth: 0, marginLeft: 4 }}>
                <Text variant={isSel ? 'body-strong' : 'body'}>{node.label}</Text>
              </div>
              {editable && (
                <span style={{ marginLeft: 'auto', display: 'inline-flex', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <Menu
                    trigger={<IconButton icon="dots-vertical" label="메뉴" variant="ghost" size="sm" />}
                    items={[
                      { label: '하위 디렉토리 추가', icon: 'plus', onClick: () => startAddChild(node.id) },
                      { label: '이름 변경', icon: 'edit', onClick: () => startRename(node) },
                      { label: '삭제', icon: 'trash', variant: 'danger', onClick: () => onDelete?.(node.id) },
                    ]}
                  />
                </span>
              )}
            </div>
          )}
          {/* 하위 추가 입력은 부모 바로 밑 첫 자식으로(아래 누적 아님). */}
          {editing?.mode === 'addChild' && editing.id === node.id && renderInline(depth + 1)}
          {isOpen && hasChildren && renderNodes(node.children!, depth + 1)}
        </Fragment>
      );
    });

  return (
    <Stack gap="xs">
      {(title || editable) && (
        <SectionHeader
          title={title ?? '디렉토리'}
          divider
          actions={editable ? [{ label: '최상위 디렉토리 추가', icon: 'plus', iconOnly: true, onClick: startAddRoot }] : undefined}
        />
      )}
      {/* 노드 컨테이너 gap 0 → 가이드선 세그먼트가 행 사이 끊김 없이 연속. */}
      <div>
        {/* 최상위 추가 입력은 헤더 바로 밑(상단, + 버튼 근처) — 아래 누적 아님. */}
        {editing?.mode === 'addRoot' && renderInline(0)}
        {renderNodes(nodes, 0)}
      </div>
    </Stack>
  );
}
