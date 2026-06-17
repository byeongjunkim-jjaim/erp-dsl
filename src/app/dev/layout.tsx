'use client';
// 박물관 dev 셸 — 좌측 분류 내비를 우리 Tree(보기 전용 모드)로 도그푸드.
//  · dev 환경은 ERP가 아니므로 AppShell(전역 셸)로 교체하지 않는다. 좌측만 Tree로 정리.
//  · Tree에 editable·onAdd*·onRename·onDelete를 안 넘김 = 수정 0. 남는 건 분류 + 펼침/접힘 + 선택 강조(보기 편함).
//  · 분류 체계 = DSL 계층 사다리(토큰→…→템플릿) + 페이지 레이아웃 + 슬라이스 데모 + 편집기.
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { CATALOG, LAYERS } from '@/ui/_catalog';
import { Tree, type TreeNodeData } from '@/ui';

// 부품 외 정적 섹션 — 카탈로그와 합쳐 단일 트리로. id가 '/'로 시작하면 라우트(이동), 아니면 폴더(토글).
const STATIC_TAIL: TreeNodeData[] = [
  { id: '__pages', label: '페이지 레이아웃', children: [
    { id: '/dev/grid', label: '위젯 그리드 시범' },
    { id: '/customers', label: '고객 관리' },
  ] },
  { id: '__tools', label: '도구', children: [{ id: '/dev/import', label: '초기 등록 (엑셀)' }] },
  { id: '__editor', label: '편집기', children: [{ id: '/playground', label: 'SummaryCard 편집기' }] },
];

// 카탈로그를 계층(전시실)→부품 2단 트리로. 단일 출처(_catalog)에서 파생 → 드리프트 0.
//  · 셸(AppShell)은 앱의 최외곽 프레임이라 부품 아래가 아닌 최상위로 노출.
const NODES: TreeNodeData[] = [
  { id: '/dev/tokens', label: '토큰' },
  { id: '/shell', label: '셸' },
  {
    id: '__parts', label: '부품',
    children: LAYERS.map((layer) => ({
      id: `__layer:${layer}`, label: layer,
      children: CATALOG.filter((e) => e.layer === layer).map((e) => ({ id: `/dev/part/${e.name}`, label: e.name })),
    })),
  },
  ...STATIC_TAIL,
];

// 첫 펼침: 상위 그룹 + (부품 상세면) 그 부품이 속한 계층만 펼쳐 선택을 보이게.
function initialExpanded(path: string): string[] {
  const base = ['__parts', '__pages', '__tools', '__editor'];
  const m = path.match(/^\/dev\/part\/(.+)$/);
  if (m) {
    const entry = CATALOG.find((e) => e.name === m[1]);
    if (entry) base.push(`__layer:${entry.layer}`);
  }
  return base;
}

export default function DevLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [expanded, setExpanded] = useState<string[]>(() => initialExpanded(path));
  const toggle = (id: string) => setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  // 행 클릭: 라우트면 이동, 폴더면 펼침/접힘.
  const select = (id: string) => { if (id.startsWith('/')) router.push(id); else toggle(id); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-tertiary)' }}>
      <nav style={{ width: 248, flexShrink: 0, background: 'var(--bg-primary)', borderRight: '1px solid var(--border-default)', padding: 12, position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh', overflowY: 'auto' }}>
        {/* 워드마크 — ERP-DSL. dev 셸 정체성(클릭 시 박물관 홈). */}
        <Link href="/dev" style={{ display: 'inline-block', padding: '2px 8px 14px', textDecoration: 'none' }}>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            ERP<span style={{ color: 'var(--mantine-color-primary-6)' }}>-DSL</span>
          </span>
        </Link>
        <Tree nodes={NODES} selectedId={path} expandedIds={expanded} onSelect={select} onToggle={toggle} />
      </nav>
      <main style={{ flex: 1, padding: 32, minWidth: 0 }}>{children}</main>
    </div>
  );
}
