// StatusRow (분자) — 한 항목의 "현재 상태 + 지금 할 수 있는 행동"을 한 줄로 묶는다.
//  · 골격: [아이콘?] 라벨 [상태배지] ──(spacer)── [액션 0~2개].
//  · 분자 본질(고정): Group(justify=between) + Badge(상태) + renderAction(액션)을 한 단위로 결합(01 §4-C).
//  · 도메인 무지(헌법 1): 상태→배지/버튼 판단은 위(페이지)가 정해 status·actions로 먹인다. 분자는 모름.
//  · 버튼 0/1/2개는 토글 prop이 아니라 actions 배열 길이로 표현(옵션 쌓기 금지 — 03 §11-3).
//  · 배지는 좌측(라벨 옆)에 둔다 → action 개수(0/1/2)가 변해도 배지 위치가 밀리지 않는다(고정).
//    (배지를 actions와 같은 우측 그룹에 두면 버튼 폭만큼 배지가 좌우로 밀려 위치가 흔들린다.)
//  · 라벨은 row의 주인공이라 subheading(16px) — sm 액션 버튼(14px)보다 한 단계 위(PageHeader 위계와 동일 논리).
//  · DataTable(동종 다수행)·DescriptionList(읽기 라벨:값)와 결과물이 달라 경쟁 경로 아님.
import { Group } from './Group';
import { Title } from './Title';
import { Badge } from './Badge';
import { Icon, type IconName } from './Icon';
import { renderAction, type Action, type BadgeColor } from './_cells';

type StatusRowProps = {
  label: string;
  icon?: IconName;                                 // 닫힌 enum(아이콘 카탈로그)
  status: { label: string; tone: BadgeColor };     // BadgeColor enum 5종(neutral/success/warning/danger/info)
  actions?: Action[];                              // 0~2개 권장. 기존 Action 재사용(renderAction sm)
};

export function StatusRow({ label, icon, status, actions }: StatusRowProps) {
  return (
    <Group justify="between" align="center" wrap={false}>
      {/* 좌측: 아이콘 + 라벨 + 상태배지 (배지 위치 고정 — actions와 분리) */}
      <Group gap="sm" align="center" wrap={false}>
        {icon && <Icon name={icon} size="md" />}
        <Title variant="subheading">{label}</Title>
        <Badge color={status.tone}>{status.label}</Badge>
      </Group>
      {/* 우측: 액션만 (0개면 미조립) */}
      {actions && actions.length > 0 && (
        <Group gap="xs" align="center" wrap={false}>
          {actions.map((a, i) => renderAction(a, i, 'sm'))}
        </Group>
      )}
    </Group>
  );
}
