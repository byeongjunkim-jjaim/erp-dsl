// Pagination 분자 — 목록을 페이지로 나눠 이동. 번호형 단일(이전다음·더보기 미포함).
// 축약(양끝+현재 주변 …) 고정. 화살표 = Icon 원자.
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
      nextIcon={() => <Icon name="chevron-right" size="sm" />}
      previousIcon={() => <Icon name="chevron-left" size="sm" />}
    />
  );
}
