'use client';
// Accordion (분자) — 여러 [헤더+본문] 섹션을 하나로 묶어 펼침을 *조율*한다.
//  · Collapsible(단일 단위)이 명시적으로 거부한 "여러 개 중 하나만 열림"(§Collapsible 경계)을 가진다.
//    → Collapsible을 직접 쌓아 구성하던 패턴을 대체(공유 open-state 조율).
//  · Mantine Accordion(접힘 애니메이션 + 단일/다중 조율 엔진)을 격리 래핑(헌법 7,
//    Collapsible이 Collapse를, MultiSelect가 Combobox를 래핑한 것과 동형).
//  · 닫힌 props만: items(섹션 배열)·multiple(다중 펼침)·defaultOpen. className/style 비노출.
import { Accordion as MAccordion } from '@mantine/core';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

export type AccordionItem = {
  value: string;        // 섹션 식별자(열림 상태 키)
  label: ReactNode;     // 항상 보이는 헤더(요약 분자 슬롯 가능 — 단 인터랙티브 요소 금지: 헤더 전체가 토글)
  children: ReactNode;  // 접힘 대상 상세
};

type Props = {
  items: AccordionItem[];
  multiple?: boolean;     // true=여러 개 동시 펼침 / false(기본)=하나만(조율)
  defaultOpen?: string[]; // 처음 펼친 섹션 value들(multiple=false면 첫 값만)
};

export function Accordion({ items, multiple = false, defaultOpen = [] }: Props) {
  const common = {
    chevron: <Icon name="chevron-down" size="sm" color="secondary" />,
    variant: 'separated' as const,
    radius: 'md' as const,
  };
  const body = items.map((it) => (
    <MAccordion.Item key={it.value} value={it.value}>
      <MAccordion.Control>{it.label}</MAccordion.Control>
      <MAccordion.Panel>{it.children}</MAccordion.Panel>
    </MAccordion.Item>
  ));
  return multiple ? (
    <MAccordion multiple defaultValue={defaultOpen} {...common}>{body}</MAccordion>
  ) : (
    <MAccordion defaultValue={defaultOpen[0] ?? null} {...common}>{body}</MAccordion>
  );
}
