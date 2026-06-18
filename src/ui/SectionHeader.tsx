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
  controls?: ReactNode;    // 도구(검색·뷰 토글 등). 제목존(flex:1 말줄임) 우측에 고정 — 제목 길이와 무관하게 안 밀린다(3존).
  actions?: Action[];
  divider?: boolean;
};

// 헤더 행 안정 밴드 — sm 액션 버튼이 있을 때의 높이를 *항상* 예약해, 액션 유무로 헤더가 위아래로 흔들리지 않게 한다.
//  "그 자리에 올 수 있는 가장 큰 상태로 고정"(PageGrid ROW_UNIT·AppShell HEADER_HEIGHT와 동류). 토큰에 'sm 버튼 높이'가
//  없어 실측 px(sm 검색 InputGroup = 36 입력 + 1px 보더×2 = 38; 좌측 제목 텍스트는 이 바닥에 맞춰진다).
//  효과: 같은 카드의 좌/우 패널 헤더(Tree·Explorer)가 같은 밴드라 시작점뿐 아니라 divider(끝)까지 정렬된다.
//  (36이면 우측 InputGroup이 38로 밴드를 키워 좌측 divider보다 2px 아래로 어긋났다 — CDP 실측 확인.)
const HEADER_ROW_MIN = 38;

export function SectionHeader({ title, titleNode, description, controls, actions, divider }: Props) {
  const hasActions = !!actions && actions.length > 0;
  return (
    <Stack gap="xs">
      {/* 밴드: 3존 고정 — [제목존: flex:1 말줄임] [controls: 우측 고정] [actions: 우측 끝 고정].
          제목(breadcrumb)이 길이 변동을 전부 흡수(말줄임)해 → controls·actions는 제목 길이와 무관하게 안 밀린다.
          (좌/우 패널 헤더가 같은 minHeight라 divider도 정렬. minHeight=38=sm 컨트롤 실측.) */}
      <div style={{ minHeight: HEADER_ROW_MIN, display: 'flex', alignItems: 'center', gap: 'var(--mantine-spacing-md)' }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          {titleNode ?? (
            <Stack gap="xxs">
              {title ? <Title variant="subheading">{title}</Title> : null}
              {description && <Text variant="caption" color="secondary">{description}</Text>}
            </Stack>
          )}
        </div>
        {controls && <div style={{ flexShrink: 0 }}>{controls}</div>}
        {hasActions && (
          <div style={{ flexShrink: 0 }}>
            <Group gap="xs" align="center" wrap={false}>{actions!.map((a, i) => renderAction(a, i, 'sm'))}</Group>
          </div>
        )}
      </div>
      {divider && <Divider />}
    </Stack>
  );
}
