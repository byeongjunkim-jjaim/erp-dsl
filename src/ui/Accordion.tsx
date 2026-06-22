'use client';
// Accordion (분자) — 여러 [헤더+본문] 섹션을 하나로 묶어 펼침을 *조율*한다.
//  · Collapsible(단일 단위)이 명시적으로 거부한 "여러 개 중 하나만 열림"(§Collapsible 경계)을 가진다.
//    → Collapsible을 직접 쌓아 구성하던 패턴을 대체(공유 open-state 조율).
//  · Mantine Accordion(접힘 애니메이션 + 단일/다중 조율 엔진)을 격리 래핑(헌법 7,
//    Collapsible이 Collapse를, MultiSelect가 Combobox를 래핑한 것과 동형).
//  · 닫힌 props만: items(섹션 배열)·multiple(다중 펼침)·defaultOpen·clearAttentionOnOpen. className/style 비노출.
import { Accordion as MAccordion } from '@mantine/core';
import { useState, type ReactNode, type CSSProperties } from 'react';
import { Icon } from './Icon';
import type { BadgeColor } from './_cells';
import './controls.css';

export type AccordionItem = {
  value: string;        // 섹션 식별자(열림 상태 키)
  label: ReactNode;     // 항상 보이는 헤더(요약 분자 슬롯 가능 — 단 인터랙티브 요소 금지: 헤더 전체가 토글)
  children: ReactNode;  // 접힘 대상 상세
  // tone='attention' = "지금 펼치기 전에 눈에 띄어야 하는 행" — 틴트 채움 + 얇은 틴트 윤곽(그림자는 공통). 남발 금지(소수만).
  tone?: 'attention';
  // 틴트 색(토큰 enum만) — 기본 danger(행동요구 색축, CountBadge·Callout과 공유). 의미가 다르면 success/warning/info/neutral.
  //  tone='attention'일 때만 적용. {color}-0 = 채움 / {color}-3 = 얇은 윤곽. (좌측 띠 폐기 — 윤곽 최소·그림자 위주.)
  color?: BadgeColor;
};

type Props = {
  items: AccordionItem[];
  multiple?: boolean;     // true=여러 개 동시 펼침 / false(기본)=하나만(조율)
  defaultOpen?: string[]; // 처음 펼친 섹션 value들(multiple=false면 첫 값만)
  // clearAttentionOnOpen — 펼침(=봤음)을 트리거로 attention 강조를 *부드럽게 해제(영구)*. 큐/인박스용(읽지않은 메일 모델):
  //  같은 목록의 모든 행이 처리대기라 다 강조면 대비가 죽는다 → 본 것은 빠지고 "아직 안 본 것"만 남아 의미가 산다.
  //  '봤음'은 ephemeral(컴포넌트 수명) 표현 상태 — 도메인 상태 아님. 끄면(기본 false) tone은 순수 정적(예: '필수 미완' 의미엔 안 해제).
  clearAttentionOnOpen?: boolean;
};

export function Accordion({ items, multiple = false, defaultOpen = [], clearAttentionOnOpen = false }: Props) {
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
  // attention 활성 = tone 지정 && (해제옵션 꺼짐 || 아직 안 봄). 본 순간 off로 → 클래스 transition으로 페이드.
  const active = (it: AccordionItem) =>
    it.tone === 'attention' && !(clearAttentionOnOpen && seen.includes(it.value));
  // 표현 방향: 윤곽 최소·그림자 위주. 기본=회색 카드+그림자(윤곽 없음). 강조=틴트 채움({color}-0)+얇은 틴트 윤곽({color}-3)+그림자.
  //  색(기본 danger)을 CSS 역할 변수(--erp-attn-*)로 흘린다 — controls.css가 읽어 칠한다(토큰값만 통과, 좌측 띠 폐기).
  const attnStyle = (it: AccordionItem): CSSProperties | undefined => {
    if (it.tone !== 'attention') return undefined;
    const c = it.color ?? 'danger';
    return {
      ['--erp-attn-fill']: `var(--mantine-color-${c}-0)`,
      ['--erp-attn-border']: `var(--mantine-color-${c}-3)`,
    } as CSSProperties;
  };
  // 스타일은 controls.css. erpAccordionItem=전 항목(회색+그림자), attention만 erpAccordionAttn+data-attn(off면 override 0 → 기본과 동일).
  const body = items.map((it) => (
    <MAccordion.Item
      key={it.value}
      value={it.value}
      className={it.tone === 'attention' ? 'erpAccordionItem erpAccordionAttn' : 'erpAccordionItem'}
      style={attnStyle(it)}
      {...(it.tone === 'attention' ? { 'data-attn': active(it) ? 'on' : 'off' } : {})}
    >
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
