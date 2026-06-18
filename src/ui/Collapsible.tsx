'use client';
// Collapsible (분자) — 헤더(항상 보임) + 본문(접힘/펼침) 한 단위. 헤더 클릭으로 토글.
//  · 헤더·본문은 raw 슬롯(임의 내용) — Modal children / Popover content 동형(방식 A, 새 예외 아님).
//    헤더엔 보통 StatusRow·TotalRow 같은 요약 분자를 꽂는다(요약행 재사용). 스타일 우회는 인지+hex 린트가 차단.
//  · 펼침/접힘은 도메인 데이터가 아니라 UI 표현 상태 → 내부 상태(uncontrolled, defaultOpen).
//    입력군 "controlled 전용"은 *데이터* 규칙이라 무관(뷰 토글·Tree 인라인편집 상태와 동류).
//  · 경계: 헤더+본문 한 단위까지만. "여러 개 중 하나만 열림(accordion)"은 이 부품 일이 아니다 —
//    여러 개를 세로로 쌓아 구성한다(§11-3 "옵션 쌓지 말고"). 필요해지면(rule of three) opened/onChange를 그때 연다.
//  · Mantine Collapse(애니메이션 엔진)를 격리 래핑(MultiSelect가 Combobox 래핑한 것과 동형, 헌법 7).
import { Collapse } from '@mantine/core';
import { useState, type ReactNode } from 'react';
import { Card } from './Card';
import { Divider } from './Divider';
import { Group } from './Group';
import { Icon } from './Icon';

type Props = {
  header: ReactNode;     // 항상 보이는 요약 슬롯(클릭 시 토글)
  children: ReactNode;   // 접힘 대상 상세 슬롯
  defaultOpen?: boolean; // 처음 상태(기본 false=접힘)
};

export function Collapsible({ header, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => setOpen((o) => !o);
  return (
    <Card variant="outlined" padding="none">
      {/* 헤더 — 행 전체가 토글 대상(role=button). 헤더 슬롯 안 인터랙티브 요소는 호출측이 전파 차단(ObjectCard actions 동형). */}
      <div
        className="erp-collapsible-header"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
      >
        <Group justify="between" align="center" wrap={false}>
          <div style={{ flex: 1, minWidth: 0 }}>{header}</div>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size="sm" color="secondary" />
        </Group>
      </div>
      <Collapse in={open}>
        <Divider />
        <div style={{ padding: 'var(--mantine-spacing-md)' }}>{children}</div>
      </Collapse>
    </Card>
  );
}
