'use client';
// ObjectCard (분자) — 계층 안 "오브젝트 한 칸"의 닫힌 표현. HierarchyExplorer '카드' 뷰의 12×6 벤토가 쓴다.
//  · 자유 render 구멍 대신 *역할 슬롯*으로 닫는다 — 평면 fields[] 자루가 아니라 각 조각에 이름(역할)을 준다.
//    역할: media(썸네일/폴백) · title(이름, 필수) · subtitle(식별자) · status(상태 배지 1개) ·
//          headline(핵심값 단 하나 — 도메인이 주입) · attributes(보조 라벨—값) · actions(케밥 메뉴에 N개 수납).
//  · **단일 사진 카드**. 밀도 비교는 카드를 줄이는 게 아니라 Explorer '목록'(DataTable)이 맡는다.
//  · 레이아웃 규약(끔찍한 여백 방지 — 전부 DSL 프리미티브·토큰으로):
//    - Card padding=sm → media가 카드 가장자리에서 **인셋**(상·좌·우·하 여백). media radius=md로 둥근 모서리(풀블리드 금지).
//    - media는 **flex:1로 footer 다음의 남은 높이만 차지**(고정 최소 MEDIA_MIN). footer는 절대 안 줄어(flexShrink:0) → 속성 잘림 0.
//      (예전 MEDIA_MIN을 크게 잡아 footer를 밀어내 "재질" 등이 잘리던 버그를 역전: 데이터가 우선, media가 양보.)
//    - 오버레이 칩 없음 — status·kebab는 이미지 위 흰 칩이 아니라 **footer 안**에 둔다(이미지 대비/흰 테두리 문제 원천 제거).
//    - 모든 한 줄 값은 nowrap+ellipsis(라벨은 flexShrink:0) → "단/가" 같은 라벨 깨짐·헤드라인 줄바꿈 차단.
//  · 도메인 무지: 무엇이 status인지/headline인지는 위(페이지)가 매핑. note=그 값이 지금 비정상 상태(예: 변경요청중).
import type { ReactNode } from 'react';
import { Card } from './Card';
import { Stack } from './Stack';
import { Group } from './Group';
import { Text } from './Text';
import { Badge } from './Badge';
import { Image } from './Image';
import { Icon, type IconName } from './Icon';
import { IconButton } from './IconButton';
import { Menu } from './Menu';
import { renderCell, type Action, type BadgeColor, type CellType } from './_cells';

// "라벨 — 값" 한 줄(headline·attributes 공용). 값 표현은 셀 어휘 재사용(통화/날짜 등 동형 포맷).
//  · note: 그 값에 국소된 상태 배지(예: '변경요청중'). 페이지가 워크플로에 따라 달았다 뗀다.
export type ObjectField = {
  label: string;
  value: unknown;
  type: CellType;
  note?: { label: string; tone: BadgeColor };
};

type Props = {
  title: string;                      // 이름 — 필수
  subtitle?: string;                  // 식별자(SKU·코드·번호)
  status?: { label: string; tone: BadgeColor }; // 상태 배지 1개(라이프사이클)
  thumbnail?: string;                 // media 이미지 src
  icon?: IconName;                    // 썸네일 부재 시 폴백 글리프(기본 'package' — 도메인이 바꿀 수 있음)
  headline?: ObjectField;             // 핵심값 단 하나(오브젝트를 한눈에 정의하는 지표)
  attributes?: ObjectField[];         // 보조 라벨—값
  actions?: Action[];                 // 케밥 메뉴에 N개 수납(onClick에 모달 열기 등 배선). 전파 차단.
  onClick?: () => void;               // 카드 클릭(선택/열기)
};

const MEDIA_MIN = 40; // media가 양보할 수 있는 하한 — footer(데이터)가 우선, 작은 창에서도 안 잘리게 작게. 남는 높이는 media가 채워 photo-forward.

export function ObjectCard({
  title, subtitle, status, thumbnail, icon, headline, attributes, actions, onClick,
}: Props) {
  // 라벨 — 값 한 줄. 라벨=flexShrink 0(안 깨짐) / 값=ellipsis / note=값 뒤 배지.
  const fieldPair = (f: ObjectField, i: number) => (
    <Group key={i} gap="xs" align="center" justify="between" wrap={false}>
      <Text variant="caption" color="secondary"><span style={{ whiteSpace: 'nowrap' }}>{f.label}</span></Text>
      <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{renderCell(f.type, f.value)}</div>
        {f.note && <Badge color={f.note.tone}>{f.note.label}</Badge>}
      </div>
    </Group>
  );

  // media — 인셋(카드 padding) + 둥근 모서리. flex:1로 footer 다음 남은 높이만 차지. 썸네일 cover / 폴백 글리프.
  //  케밥(⋯)은 **media 우상단 모서리**(Material 카드 오버플로 관례) — 제목 옆(리스트-행 관례) 아님. 사각 흰 칩 대신
  //  **원형 버튼**(scrim)으로 이미지 위 대비 확보(애매한 흰 테두리 제거). 전파 차단.
  const media = (
    <div style={{ position: 'relative', flex: 1, minHeight: MEDIA_MIN, borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
      {thumbnail ? (
        <Image src={thumbnail} alt={title} fit="cover" size="fill" />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon ?? 'package'} size="lg" color="secondary" />
        </div>
      )}
      {actions && actions.length > 0 && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 6, right: 6 }}>
          <div style={{ borderRadius: 'var(--mantine-radius-full)', background: 'var(--bg-primary)', boxShadow: 'var(--mantine-shadow-sm)', display: 'inline-flex', alignItems: 'center' }}>
            <Menu trigger={<IconButton icon="dots-vertical" label="더보기" variant="ghost" size="sm" />} items={actions} position="bottom" />
          </div>
        </div>
      )}
    </div>
  );

  // footer(데이터 본문, 안 줄어듦) — 제목 / 코드+상태 / headline / 속성. 케밥은 media 우상단으로 이동(제목줄은 제목만, full width).
  const footer = (
    <Stack gap="xxs">
      <div style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <Text variant="body-strong">{title}</Text>
      </div>
      {(subtitle || status) && (
        <Group justify="between" align="center" wrap={false} gap="xs">
          <div style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {subtitle && <Text variant="caption" color="secondary">{subtitle}</Text>}
          </div>
          {status && <Badge color={status.tone}>{status.label}</Badge>}
        </Group>
      )}
      {headline && fieldPair(headline, -1)}
      {/* 구분선 없이 바로 — 작은 셀에서 한 줄이라도 더 확보(데이터 안 잘림 우선). */}
      {attributes && attributes.length > 0 && attributes.map((f, i) => fieldPair(f, i))}
    </Stack>
  );

  const card = (
    <Card variant="outlined" padding="sm" fill>
      {/* media(양보) 위, footer(우선) 아래 — gap은 토큰. height:100%로 셀을 채우되 footer는 절대 안 잘림. */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--mantine-spacing-xxs)' }}>
        {media}
        {/* footer는 안 줄어듦(flexShrink:0) → media(flex:1)가 양보, 데이터는 절대 안 잘림. */}
        <div style={{ flexShrink: 0 }}>{footer}</div>
      </div>
    </Card>
  );

  const wrap = (node: ReactNode) =>
    onClick ? <div onClick={onClick} style={{ cursor: 'pointer', height: '100%' }}>{node}</div> : node;
  return wrap(card);
}
