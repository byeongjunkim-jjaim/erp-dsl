'use client';
// ObjectCard (분자) — 계층 안 "오브젝트 한 칸"의 닫힌 표현. HierarchyExplorer 우측 그리드가 쓴다.
//  · 미리보기/티저가 아니다 — 오브젝트가 그 자리에서 갖는 완결된 표현(상세로 떠넘기지 않음).
//  · 자유 render 구멍 대신 닫힌 스키마({title, subtitle?, badge?, thumbnail?, fields?, actions?})로 결정적 렌더
//    (DataTable·DescriptionList 셀 타입과 동형 — 헌법 정합). 도메인 무지.
//  · 도메인 규칙(무엇이 수정 가능/컨펌 대상인가)은 카드가 모른다. 위(페이지)가 actions로 의도를,
//    fields[].note로 "이 필드가 지금 비정상 상태(예: 변경요청중)"를 국소로 먹인다.
import type { ReactNode } from 'react';
import { Card } from './Card';
import { Stack } from './Stack';
import { Group } from './Group';
import { Text } from './Text';
import { Badge } from './Badge';
import { Divider } from './Divider';
import { Image } from './Image';
import { renderAction, renderCell, type Action, type BadgeColor, type CellType } from './_cells';

// 카드가 본문에 나열하는 "라벨 — 값" 한 줄. 값 표현은 셀 어휘(_cells) 재사용(통화/날짜 등 동형 포맷).
//  · note: 그 필드에 국소된 상태 배지(예: '변경요청중'). 페이지가 워크플로에 따라 달았다 뗀다.
export type ObjectField = {
  label: string;
  value: unknown;
  type: CellType;
  note?: { label: string; tone: BadgeColor };
};

type Props = {
  title: string;
  subtitle?: string;
  badge?: { label: string; tone: BadgeColor };
  thumbnail?: string;        // 이미지 src
  fields?: ObjectField[];    // 오브젝트 본문 데이터(라벨—값 행). 미리보기 아님 → 개수 캡 없음.
  actions?: Action[];
  onClick?: () => void;      // 카드 클릭(선택/열기) — actions는 전파 차단
};

export function ObjectCard({ title, subtitle, badge, thumbnail, fields, actions, onClick }: Props) {
  const card = (
    <Card variant="outlined" padding="md" fill>
      <Stack gap="sm">
        {thumbnail && <Image src={thumbnail} alt={title} fit="cover" />}
        <Stack gap="xxs">
          <Group gap="xs" align="center" justify="between" wrap={false}>
            <Text variant="body-strong">{title}</Text>
            {badge && <Badge color={badge.tone}>{badge.label}</Badge>}
          </Group>
          {subtitle && <Text variant="caption" color="secondary">{subtitle}</Text>}
        </Stack>
        {fields && fields.length > 0 && (
          <>
            <Divider />
            {/* 라벨(caption·보조) — 값(셀 렌더) [note 배지]. note는 값 옆에 두어 "어느 필드"가 비정상인지 국소로 보인다. */}
            <Stack gap="xxs">
              {fields.map((f, i) => (
                <Group key={i} gap="xs" align="center" justify="between" wrap={false}>
                  <Text variant="caption" color="secondary">{f.label}</Text>
                  <Group gap="xs" align="center" wrap={false}>
                    {renderCell(f.type, f.value)}
                    {f.note && <Badge color={f.note.tone}>{f.note.label}</Badge>}
                  </Group>
                </Group>
              ))}
            </Stack>
          </>
        )}
        {actions && actions.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            <Group gap="xs" justify="end">{actions.map((a, i) => renderAction(a, i, 'sm'))}</Group>
          </div>
        )}
      </Stack>
    </Card>
  );
  const wrap = (node: ReactNode) => (onClick ? <div onClick={onClick} style={{ cursor: 'pointer', height: '100%' }}>{node}</div> : node);
  return wrap(card);
}
