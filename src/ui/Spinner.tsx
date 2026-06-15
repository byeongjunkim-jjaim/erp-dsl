// Spinner 원자 — 페이지/영역 로딩용(Button loading과 별개). 색 고정(primary).
import { Loader } from '@mantine/core';

type SpinnerProps = { size?: 'sm' | 'md' | 'lg' };

export function Spinner({ size = 'md' }: SpinnerProps) {
  return <Loader color="primary" size={size} />;
}
