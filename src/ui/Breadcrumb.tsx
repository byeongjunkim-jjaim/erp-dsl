'use client';
// Breadcrumb (분자) — 위치 경로(a › b › c). 앞 단계는 이동 가능(onClick), 마지막=현재(강조·비링크).
//  · 항목 사이 chevron-right 구분. HierarchyExplorer 우측 헤더처럼 "현재 위치 + 상위로 이동"에 쓴다.
//  · 인터랙티브라 그 자체가 헤더 역할 — 별도 정적 제목 헤더를 두지 않는다(SectionHeader titleNode로 주입).
//  · 한 줄 고정(nowrap) + **마지막(현재) 크럼 우선**: 폭이 모자라면 *앞쪽 조상*을 클립하고 현재 위치는 끝까지 남긴다
//    (앞을 가려 "부자재 ›"만 남는 잘못 방지 — 헤더 좁아져도 "내가 지금 어디"는 항상 보인다). 두 줄/글자쪼갬은 차단(divider 유격).
import { Fragment } from 'react';
import { Text } from './Text';
import { Icon } from './Icon';

export type BreadcrumbItem = { label: string; onClick?: () => void };
type Props = { items: BreadcrumbItem[] };

export function Breadcrumb({ items }: Props) {
  const crumb = (it: BreadcrumbItem, last: boolean) => {
    const text = <Text variant={last ? 'body-strong' : 'body'} color={last ? 'primary' : 'secondary'}>{it.label}</Text>;
    return !last && it.onClick ? (
      <span role="button" tabIndex={0} onClick={it.onClick} style={{ cursor: 'pointer' }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); it.onClick!(); } }}>
        {text}
      </span>
    ) : text;
  };
  const chevron = <Icon name="chevron-right" size="sm" color="secondary" />;
  const lastIdx = items.length - 1;
  const prefix = items.slice(0, lastIdx); // 조상들(클립 대상)
  return (
    <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, whiteSpace: 'nowrap' }}>
      {/* 조상 영역 — 공간 부족 시 여기가 먼저 줄어 클립(현재 위치 앞 구분선까지 함께). */}
      {prefix.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden', flexShrink: 1 }}>
          {prefix.map((it, i) => (
            <Fragment key={i}>
              {i > 0 && chevron}
              {crumb(it, false)}
            </Fragment>
          ))}
          {chevron}
        </div>
      )}
      {/* 현재(마지막) 크럼 — 고정(flexShrink:0). 끝까지 남는다. */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {crumb(items[lastIdx], true)}
      </div>
    </div>
  );
}
