// StatusRow (분자) — 한 항목의 "현재 상태 + 지금 할 수 있는 행동"을 한 줄로 묶는다.
//  · 골격: [아이콘?] 라벨 [상태배지] ──(spacer)── [액션 0~2개].
//  · 분자 본질(고정): Group(justify=between) + Badge(상태) + renderAction(액션)을 한 단위로 결합(01 §4-C).
//  · 도메인 무지(헌법 1): 상태→배지/버튼 판단은 위(페이지)가 정해 status·actions로 먹인다. 분자는 모름.
//  · 버튼 0/1/2개는 토글 prop이 아니라 actions 배열 길이로 표현(옵션 쌓기 금지 — 03 §11-3).
//  · 배지는 좌측(라벨 옆)에 둔다 → action 개수(0/1/2)가 변해도 배지 위치가 밀리지 않는다(고정).
//  · 라벨 = Text body-strong(14px 굵게). 위계: 페이지 heading > 카드 subheading > 행 body-strong(한 단계씩).
//    (한때 subheading으로 올렸으나 카드 섹션 제목과 같은 단계가 되어 위계가 무너져 되돌림.)
//  · 행 높이는 action 유무와 무관하게 통일 — sm 버튼 높이만큼 reserve해 여러 행이 세로로 정렬되게.
import { Group } from './Group';
import { Text } from './Text';
import { Badge } from './Badge';
import { Icon, type IconName } from './Icon';
import { renderAction, type Action, type BadgeColor } from './_cells';

// sm Button 실제 높이 ≈ 36px(2.25rem). 스페이싱 토큰은 '높이'용이 아니고(컨트롤 높이는 도출),
// 시스템에 '버튼 높이 토큰'이 없어 격리 구역 px 상수로 둔다(AppShell LOGO_HEIGHT 선례). 잠정 — 화면 검증 후 확정.
const ROW_MIN_HEIGHT = 36;

type StatusRowProps = {
  label: string;
  icon?: IconName;                                 // 닫힌 enum(아이콘 카탈로그)
  status: { label: string; tone: BadgeColor };     // BadgeColor enum 5종(neutral/success/warning/danger/info)
  actions?: Action[];                              // 0~2개 권장. 기존 Action 재사용(renderAction sm)
};

export function StatusRow({ label, icon, status, actions }: StatusRowProps) {
  return (
    // 행 높이 reserve — 버튼 있는 행(36)과 없는 행이 같은 높이로 정렬. Group은 style 미노출이라 래퍼 div로.
    <div style={{ minHeight: ROW_MIN_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Group justify="between" align="center" wrap={false}>
        {/* 좌측: 아이콘 + 라벨 + 상태배지 (배지 위치 고정 — actions와 분리) */}
        <Group gap="sm" align="center" wrap={false}>
          {icon && <Icon name={icon} size="sm" />}
          <Text variant="body-strong">{label}</Text>
          <Badge color={status.tone}>{status.label}</Badge>
        </Group>
        {/* 우측: 액션만 (0개면 미조립) */}
        {actions && actions.length > 0 && (
          <Group gap="xs" align="center" wrap={false}>
            {actions.map((a, i) => renderAction(a, i, 'sm'))}
          </Group>
        )}
      </Group>
    </div>
  );
}
