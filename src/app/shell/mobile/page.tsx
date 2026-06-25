'use client';
// 모바일 AppShell 프리뷰 — 셸의 모바일 거동(상단 로고+아바타·하단 탭바·아바타-only 프로필·본문 스크롤)을
//  브라우저를 줄이지 않고 본다. 핵심: iframe은 *자체 뷰포트*라 그 안의 미디어쿼리·useMediaQuery가
//  iframe 폭을 기준으로 평가된다 → /shell을 폰 폭으로 띄우면 데스크탑 화면에서도 진짜 모바일로 렌더된다.
import { useState } from 'react';
import { Container, Stack, Group, Title, Text, SegmentedControl, Anchor } from '@/ui';

const DEVICES: Record<string, { label: string; w: number; h: number }> = {
  se:  { label: 'iPhone SE',         w: 375, h: 667 },
  std: { label: 'iPhone 14',         w: 390, h: 844 },
  max: { label: 'iPhone 14 Pro Max', w: 430, h: 932 },
};

export default function MobileShellPreview() {
  const [dev, setDev] = useState('std');
  const d = DEVICES[dev];

  return (
    <Container maxWidth="wide">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title variant="heading">모바일 AppShell 프리뷰</Title>
          <Text variant="body" color="secondary">
            iframe(자체 뷰포트)에 <code>/shell</code>을 폰 크기로 띄운다 — 미디어쿼리·useMediaQuery가 iframe 폭 기준이라
            브라우저를 줄이지 않고 진짜 모바일 레이아웃(상단 로고+아바타 · 하단 탭바 · 아바타-only 프로필 · 본문만 스크롤)을 본다.
          </Text>
          <Text variant="caption" color="secondary">
            ※ 홈 인디케이터 safe-area(env())는 실제 기기에서만 채워진다 — 프리뷰에선 0. 셸 데모 원본은 <Anchor href="/shell">/shell</Anchor>.
          </Text>
        </Stack>

        {/* 기기 폭 프리셋 — 좁은(SE)·표준·큰 폰에서 하단 탭 분배·프로필 거동 비교. */}
        <SegmentedControl
          options={Object.entries(DEVICES).map(([v, x]) => ({ value: v, label: `${x.label} · ${x.w}×${x.h}` }))}
          value={dev}
          onChange={setDev}
          size="sm"
        />

        {/* 폰 베젤 + iframe. 높이 고정이라 셸이 그 안에서 100dvh를 채우고 하단 탭이 바닥에 붙는다. */}
        <Group justify="center">
          <div
            style={{
              width: d.w,
              height: d.h,
              border: '10px solid var(--text-primary)',
              // eslint-disable-next-line no-restricted-syntax -- 폰 프레임 베젤 곡률(디바이스 목업), DSL UI radius 아님(스케일 밖 명시 예외)
              borderRadius: 44,
              overflow: 'hidden',
              boxShadow: 'var(--mantine-shadow-xl)',
              background: 'var(--bg-primary)',
            }}
          >
            <iframe
              key={`${d.w}x${d.h}`}   /* 기기 바꾸면 iframe 재마운트 → 셸이 새 폭으로 재평가 */
              src="/shell"
              title="모바일 AppShell"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          </div>
        </Group>
      </Stack>
    </Container>
  );
}
