'use client';
// TreeSelect (분자) — 계층에서 노드 하나를 '입력칸'으로 고른다(Tree를 드롭다운에 임베드).
//  · Select 형 트리거(선택 노드 라벨) + Popover 안 Tree. 펼침은 내부 상태(UI 표현, controlled 데이터 아님).
//  · 단일 선택(노드 id). 부모/자식 어느 깊이든 선택 가능 ↔ Cascader(경로 드릴).
import { useState } from 'react';
import { Popover } from './Popover';
import { Tree, type TreeNodeData } from './Tree';
import { Button } from './Button';
import { Icon } from './Icon';

type Props = {
  nodes: TreeNodeData[];
  value: string | null;
  onChange: (id: string) => void;
  placeholder?: string;
};
function findLabel(nodes: TreeNodeData[], id: string | null): string | null {
  if (!id) return null;
  for (const n of nodes) {
    if (n.id === id) return n.label;
    if (n.children) { const f = findLabel(n.children, id); if (f) return f; }
  }
  return null;
}
export function TreeSelect({ nodes, value, onChange, placeholder = '선택' }: Props) {
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const label = findLabel(nodes, value);
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom"
      width="md"
      content={
        <Tree
          nodes={nodes}
          selectedId={value}
          expandedIds={expanded}
          onSelect={(id) => { onChange(id); setOpened(false); }}
          onToggle={(id) => setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]))}
        />
      }
    >
      <Button variant="secondary" rightIcon={<Icon name="chevron-down" size="sm" />} onClick={() => setOpened((o) => !o)}>
        {label ?? placeholder}
      </Button>
    </Popover>
  );
}
