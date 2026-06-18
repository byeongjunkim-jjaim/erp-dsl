'use client';
// Progress 원자 — 결정형 진행률(0~100, 끝이 보임). 끝 모르는 로딩은 Spinner.
//  · tone=의미색(기본 primary). 업로드·작업 진척·달성률. Mantine Progress 격리 래핑.
import { Progress as M } from '@mantine/core';
type Tone = 'primary' | 'success' | 'warning' | 'danger';
type Props = { value: number; tone?: Tone; size?: 'sm' | 'md' | 'lg' };
export function Progress({ value, tone = 'primary', size = 'md' }: Props) {
  return <M value={value} color={tone} size={size} radius="sm" />;
}
