'use client';
// PeriodNavigator (분자) — 기간 한 칸 이동(‹ 라벨 ›). 돈 화면(정산·매출…)의 기간 스코프 컨트롤.
//  · controlled·도메인 무지 — 라벨은 *포맷된 문자열*(예: '2026년 6월')만 받는다. 월/분기/연 단위는 호출측이 정함.
//  · 손으로 IconButton+Text를 매번 조립하던 월 네비를 부품화(Calendar 월 이동과 동형 — 한 곳으로 통일).
//  · 양 끝 IconButton(ghost)은 disabled로 경계(첫/마지막 기간) 표현. 가운데 라벨은 body-strong.
import { Group } from './Group';
import { Text } from './Text';
import { IconButton } from './IconButton';

type Props = {
  label: string;            // 포맷된 기간 라벨(예: '2026년 6월')
  onPrev: () => void;
  onNext: () => void;
  disabledPrev?: boolean;   // 첫 기간이면 이전 비활성
  disabledNext?: boolean;   // 마지막 기간이면 다음 비활성
};

export function PeriodNavigator({ label, onPrev, onNext, disabledPrev, disabledNext }: Props) {
  return (
    <Group gap="sm" align="center" wrap={false}>
      <IconButton icon="chevron-left" label="이전 기간" variant="ghost" size="sm" onClick={onPrev} disabled={disabledPrev} />
      <Text variant="body-strong">{label}</Text>
      <IconButton icon="chevron-right" label="다음 기간" variant="ghost" size="sm" onClick={onNext} disabled={disabledNext} />
    </Group>
  );
}
