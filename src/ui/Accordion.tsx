'use client';
// Accordion (분자) — 여러 [헤더+본문] 섹션을 하나로 묶어 펼침을 *조율*한다.
//  · Collapsible(단일 단위)이 명시적으로 거부한 "여러 개 중 하나만 열림"(§Collapsible 경계)을 가진다.
//    → Collapsible을 직접 쌓아 구성하던 패턴을 대체(공유 open-state 조율).
//  · Mantine Accordion(접힘 애니메이션 + 단일/다중 조율 엔진)을 격리 래핑(헌법 7,
//    Collapsible이 Collapse를, MultiSelect가 Combobox를 래핑한 것과 동형).
//  · 닫힌 props만: items(섹션 배열)·multiple(다중 펼침)·defaultOpen·clearAttentionOnOpen. className/style 비노출.
import { Accordion as MAccordion } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export type AccordionItem = {
  value: string;        // 섹션 식별자(열림 상태 키)
  label: ReactNode;     // 항상 보이는 헤더(요약 분자 슬롯 가능 — 단 인터랙티브 요소 금지: 헤더 전체가 토글)
  children: ReactNode;  // 접힘 대상 상세
  // tone='attention' = "지금 네 행동이 필요한 행" — 좌측 색 띠 + 은은한 틴트로 펼치기 전에 "내 차례"가 한눈에.
  //  행동요구 색축(CountBadge·Callout과 동일 빨강) 공유. 행동 불필요(진행중·완료)엔 안 준다(중립). 남발 금지(소수만).
  tone?: 'attention';
};

type Props = {
  items: AccordionItem[];
  multiple?: boolean;     // true=여러 개 동시 펼침 / false(기본)=하나만(조율)
  defaultOpen?: string[]; // 처음 펼친 섹션 value들(multiple=false면 첫 값만)
  // clearAttentionOnOpen — 펼침(=봤음)을 트리거로 attention 틴트를 *부드럽게 해제(영구)*. 큐/인박스용(읽지않은 메일 모델):
  //  같은 목록의 모든 행이 처리대기라 다 틴트면 대비가 죽는다 → 본 것은 빠지고 "아직 안 본 것"만 남아 의미가 산다.
  //  '봤음'은 ephemeral(컴포넌트 수명) 표현 상태 — 도메인 상태 아님. 끄면(기본 false) tone은 순수 정적(예: '필수 미완' 의미엔 안 해제).
  clearAttentionOnOpen?: boolean;
};

export function Accordion({ items, multiple = false, defaultOpen = [], clearAttentionOnOpen = false }: Props) {
  const reduce = useReducedMotion();
  // 펼쳐서 본 value 누적(영구 — 접어도 유지). clearAttentionOnOpen일 때만 의미.
  const [seen, setSeen] = useState<string[]>([]);
  const markSeen = (v: string | string[] | null) => {
    if (!clearAttentionOnOpen) return;
    const opened = Array.isArray(v) ? v : v ? [v] : [];
    if (opened.length) setSeen((prev) => Array.from(new Set([...prev, ...opened])));
  };

  const common = {
    chevron: <Icon name="chevron-down" size="sm" color="secondary" />,
    variant: 'separated' as const,
    radius: 'md' as const,
  };
  // attention 활성 = tone 지정 && (해제옵션 꺼짐 || 아직 안 봄). 본 순간 false로 → 아래 transition으로 페이드아웃.
  const active = (it: AccordionItem) =>
    it.tone === 'attention' && !(clearAttentionOnOpen && seen.includes(it.value));
  // 좌측 띠는 inset box-shadow로(보더 폭 점프 없이 색만 전이 → 매끈한 페이드). reduced-motion이면 전이 생략.
  const styleFor = (it: AccordionItem) =>
    it.tone === 'attention'
      ? {
          background: active(it) ? 'var(--mantine-color-danger-0)' : 'var(--bg-primary)',
          boxShadow: active(it) ? 'inset 3px 0 0 var(--mantine-color-danger-6)' : 'inset 3px 0 0 transparent',
          transition: reduce ? undefined : 'background-color 350ms ease, box-shadow 350ms ease',
        }
      : undefined;

  const body = items.map((it) => (
    <MAccordion.Item key={it.value} value={it.value} style={styleFor(it)}>
      <MAccordion.Control>{it.label}</MAccordion.Control>
      <MAccordion.Panel>{it.children}</MAccordion.Panel>
    </MAccordion.Item>
  ));
  return multiple ? (
    <MAccordion multiple defaultValue={defaultOpen} onChange={markSeen} {...common}>{body}</MAccordion>
  ) : (
    <MAccordion defaultValue={defaultOpen[0] ?? null} onChange={markSeen} {...common}>{body}</MAccordion>
  );
}
