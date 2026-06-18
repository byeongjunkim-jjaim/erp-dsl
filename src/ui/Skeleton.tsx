'use client';
// Skeleton 원자 — 콘텐츠 로드 전 자리표시(레이아웃 유지). Spinner(점 하나)와 달리 '형태'를 보존한다.
//  · 정석은 레이아웃 부품 안에 박아 실제 구조를 흉내내는 것(DataTable status='loading' 등) — 자유 배치로
//    띄우면 Mantine을 직접 쓸 때처럼 실제와 어긋난다(드리프트). 모양은 '같은 자리'에서 도출.
//  · 닫힌 props: variant(text/block/circle)·lines·size·radius. 임의 px 노출 안 함(부모 레이아웃이 크기 결정,
//    circle/block 크기만 size 토큰으로 단계화). 내부 px는 격리 구역(Modal maxHeight와 동류).
//  · Mantine Skeleton 격리 래핑(헌법 7).
import { Skeleton as S } from '@mantine/core';
import { Stack } from './Stack';

type Props = {
  variant?: 'text' | 'block' | 'circle';
  lines?: number;                  // text 전용(기본 3). 마지막 줄은 짧게(문단 끝 흉내).
  size?: 'sm' | 'md' | 'lg';       // circle 지름 / block 높이 단계
  radius?: 'sm' | 'md';
};

const CIRCLE = { sm: 32, md: 40, lg: 56 } as const;
const BLOCK_H = { sm: 80, md: 140, lg: 220 } as const;

export function Skeleton({ variant = 'text', lines = 3, size = 'md', radius = 'sm' }: Props) {
  if (variant === 'circle') return <S circle height={CIRCLE[size]} />;
  if (variant === 'block') return <S height={BLOCK_H[size]} radius={radius} />;
  return (
    <Stack gap="xs">
      {Array.from({ length: lines }).map((_, i) => (
        <S key={i} height={12} radius={radius} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </Stack>
  );
}
