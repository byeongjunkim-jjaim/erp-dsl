// Pagination 분자 — 목록을 페이지로 나눠 이동. 번호형 단일(이전다음·더보기 미포함).
// 축약(양끝+현재 주변 …) 고정. 화살표 = Icon 원자.
// 무테 지향(01 「지향」): 페이지 버튼은 구조 구분선도 입력칸도 아니므로 윤곽을 두지 않는다.
//  · 비활성 = 무테(테두리 0, hover 톤) / 활성 = filled 톤 채움. 분리는 음영·톤으로(윤곽 최후).
import { Pagination as M } from '@mantine/core';
import { Icon } from './Icon';

type Props = {
  total: number;                       // 전체 페이지 수
  value: number;                       // 현재 페이지 (controlled)
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function Pagination({ total, value, onChange, disabled }: Props) {
  return (
    <M
      total={total}
      value={value}
      onChange={onChange}
      disabled={disabled}
      radius="sm"
      color="primary"
      styles={{ control: { border: 'none' } }}   // 무테 — 테두리 친 페이지 박스 제거(hover/active 톤만)
      nextIcon={() => <Icon name="chevron-right" size="sm" />}
      previousIcon={() => <Icon name="chevron-left" size="sm" />}
    />
  );
}
