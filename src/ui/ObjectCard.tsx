'use client';
// ObjectCard (분자) — 계층 안 "오브젝트 한 칸"의 닫힌 표현. HierarchyExplorer 우측 그리드/목록이 쓴다.
//  · 미리보기/티저가 아니다 — 오브젝트가 그 자리에서 갖는 완결된 표현(상세로 떠넘기지 않음).
//  · 자유 render 구멍 대신 닫힌 스키마({title, subtitle?, badge?, thumbnail?, fields?, actions?})로 결정적 렌더
//    (DataTable·DescriptionList 셀 타입과 동형 — 헌법 정합). 도메인 무지.
//  · 도메인 규칙(무엇이 수정 가능/컨펌 대상인가)은 카드가 모른다. 위(페이지)가 actions로 의도를,
//    fields[].note로 "이 필드가 지금 비정상 상태(예: 변경요청중)"를 국소로 먹인다.
//  · layout — 같은 오브젝트의 두 표현(Finder식 뷰): card(세로 갤러리) / row(가로 목록, 밀도↑). 닫힌 enum(§11-3 별개 변형).
//    내용은 동일, 배치만 다름(데이터 무손실). 어느 뷰인지는 위(Explorer)가 정한다.
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
  // true면 목록(brief) 뷰에도 노출되는 "핵심 값"(예: 금액·상태). 미표시 필드는 카드(detail) 뷰에서만 보인다.
  //  → 두 뷰의 의의: 목록=요약(summary 필드만, 빠른 스캔) / 카드=상세(전체 필드). 정보량이 갈린다.
  summary?: boolean;
};

export type ObjectCardLayout = 'card' | 'row';

type Props = {
  title: string;
  subtitle?: string;
  badge?: { label: string; tone: BadgeColor };
  thumbnail?: string;        // 이미지 src
  fields?: ObjectField[];    // 오브젝트 본문 데이터(라벨—값 행). 미리보기 아님 → 개수 캡 없음.
  actions?: Action[];
  onClick?: () => void;      // 카드 클릭(선택/열기) — actions는 전파 차단
  layout?: ObjectCardLayout; // 기본 card
};

export function ObjectCard({ title, subtitle, badge, thumbnail, fields, actions, onClick, layout = 'card' }: Props) {
  const titleRow = (
    <Group gap="xs" align="center" justify="between" wrap={false}>
      <Text variant="body-strong">{title}</Text>
      {badge && <Badge color={badge.tone}>{badge.label}</Badge>}
    </Group>
  );
  // 액션 — 전파 차단(카드 클릭과 분리). 카드 뷰는 좁아 wrap(클리핑 차단), 목록 뷰는 폭 여유라 nowrap.
  const actionBar = (wrap: boolean) =>
    actions && actions.length > 0 ? (
      <div onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0 }}>
        <Group gap="xs" justify="end" wrap={wrap}>{actions.map((a, i) => renderAction(a, i, 'sm'))}</Group>
      </div>
    ) : null;
  const fieldPair = (f: ObjectField, i: number) => (
    <Group key={i} gap="xs" align="center" wrap={false}>
      <Text variant="caption" color="secondary">{f.label}</Text>
      <Group gap="xs" align="center" wrap={false}>
        {renderCell(f.type, f.value)}
        {f.note && <Badge color={f.note.tone}>{f.note.label}</Badge>}
      </Group>
    </Group>
  );

  // 내용 높이로 둔다(fill 제거) — 그리드 alignItems:start와 합쳐 행 높이로 늘어나며 생기던 void 차단.
  const card =
    layout === 'row' ? (
      // 목록(가로): [썸네일 sm] [제목·부제·필드 inline, flex] [액션]. 폭 여유라 버튼 안 잘림.
      <Card variant="outlined" padding="md">
        <Group gap="md" align="center" wrap={false}>
          {thumbnail && <Image src={thumbnail} alt={title} size="sm" />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Stack gap="xxs">
              {titleRow}
              {/* brief = 핵심(summary) 필드만 inline. 미표시 필드는 카드 뷰에서만. */}
              {(() => {
                const briefFields = (fields ?? []).filter((f) => f.summary);
                return (subtitle || briefFields.length > 0) ? (
                  <Group gap="md" align="center" wrap>
                    {subtitle && <Text variant="caption" color="secondary">{subtitle}</Text>}
                    {briefFields.map((f, i) => fieldPair(f, i))}
                  </Group>
                ) : null;
              })()}
            </Stack>
          </div>
          {actionBar(false)}
        </Group>
      </Card>
    ) : (
      // 상세(정석): 풀폭 배너 썸네일 위, 제목·부제, 전체 필드(라벨—값, 안 잘림), 액션. 풍부한 제품카드.
      <Card variant="outlined" padding="md">
        <Stack gap="sm">
          {thumbnail && <Image src={thumbnail} alt={title} fit="cover" size="full" />}
          <Stack gap="xxs">
            {titleRow}
            {subtitle && <Text variant="caption" color="secondary">{subtitle}</Text>}
          </Stack>
          {fields && fields.length > 0 && (
            <>
              <Divider />
              <Stack gap="xxs">{fields.map((f, i) => fieldPair(f, i))}</Stack>
            </>
          )}
          {actionBar(true)}
        </Stack>
      </Card>
    );
  const wrap = (node: ReactNode) => (onClick ? <div onClick={onClick} style={{ cursor: 'pointer' }}>{node}</div> : node);
  return wrap(card);
}
