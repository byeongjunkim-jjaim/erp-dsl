'use client';
// SectionHeader (분자) — 카드/구획의 표준 헤더. 제목(subheading = 본문보다 한 단계 위) + 설명? + 액션?.
//  · "헤더 ≥ content + 1 tier" 규칙의 부품화 — 모든 카드/패널이 재사용해 위계·좌우 정렬·'헤더감'을 통일.
//    (디자인 시스템 합의: 카드 헤더는 정의된 heading 스케일, 본문은 body 스케일 — Material/Carbon/Polaris.)
//  · divider=true → 하단 구분선(elevated 위젯의 '헤더 밴드'). 액션은 섹션 스코프(영속 — 빈 상태에도 유지).
//  · 페이지 최상위 제목은 PageHeader(heading), 카드 안 구획 제목은 SectionHeader(subheading)로 티어 분리.
import type { ReactNode } from 'react';
import { Stack } from './Stack';
import { Group } from './Group';
import { Title } from './Title';
import { Text } from './Text';
import { Divider } from './Divider';
import { renderAction, type Action } from './_cells';

type Props = {
  title?: string;
  titleNode?: ReactNode;   // title 대신 헤더 좌측에 임의 헤더 콘텐츠(예: 인터랙티브 Breadcrumb). 둘 중 하나.
  description?: string;
  actions?: Action[];
  divider?: boolean;
};

export function SectionHeader({ title, titleNode, description, actions, divider }: Props) {
  return (
    <Stack gap="xs">
      <Group justify="between" align="center" wrap={false}>
        <Stack gap="xxs">
          {titleNode ?? <Title variant="subheading">{title}</Title>}
          {description && <Text variant="caption" color="secondary">{description}</Text>}
        </Stack>
        {actions && actions.length > 0 && (
          <Group gap="xs" align="center" wrap={false}>{actions.map((a, i) => renderAction(a, i, 'sm'))}</Group>
        )}
      </Group>
      {divider && <Divider />}
    </Stack>
  );
}
