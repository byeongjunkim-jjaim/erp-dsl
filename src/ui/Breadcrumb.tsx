'use client';
// Breadcrumb (분자) — 위치 경로(a › b › c). 앞 단계는 이동 가능(onClick), 마지막=현재(강조·비링크).
//  · 항목 사이 chevron-right 구분. HierarchyExplorer 우측 헤더처럼 "현재 위치 + 상위로 이동"에 쓴다.
//  · 인터랙티브라 그 자체가 헤더 역할 — 별도 정적 제목 헤더를 두지 않는다(SectionHeader titleNode로 주입).
import { Fragment } from 'react';
import { Group } from './Group';
import { Text } from './Text';
import { Icon } from './Icon';

export type BreadcrumbItem = { label: string; onClick?: () => void };
type Props = { items: BreadcrumbItem[] };

export function Breadcrumb({ items }: Props) {
  return (
    // nowrap — 헤더에서 경로가 두 줄/글자단위로 접히면 헤더 밴드가 높아져 좌/우 패널 divider가 어긋난다(유격).
    //  white-space:nowrap이 Text(span)에 상속돼 한글 글자쪼갬을 막는다. flex nowrap과 합쳐 항상 한 줄.
    <div style={{ whiteSpace: 'nowrap', minWidth: 0 }}>
    <Group gap="xxs" align="center" wrap={false}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const text = <Text variant={last ? 'body-strong' : 'body'} color={last ? 'primary' : 'secondary'}>{it.label}</Text>;
        return (
          <Fragment key={i}>
            {i > 0 && <Icon name="chevron-right" size="sm" color="secondary" />}
            {!last && it.onClick ? (
              <span role="button" tabIndex={0} onClick={it.onClick} style={{ cursor: 'pointer' }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); it.onClick!(); } }}>
                {text}
              </span>
            ) : text}
          </Fragment>
        );
      })}
    </Group>
    </div>
  );
}
