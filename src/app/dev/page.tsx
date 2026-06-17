'use client';
// 박물관 인덱스 — 계층별 부품 나열(하이퍼링크). 라이브 예시는 각 부품 상세에.
import Link from 'next/link';
import { CATALOG, LAYERS } from '@/ui/_catalog';
import { Stack, Group, Title, Text, Card, Badge } from '@/ui';

export default function DevIndex() {
  const groups = LAYERS.map((layer) => ({ layer, items: CATALOG.filter((e) => e.layer === layer) }));
  return (
    <Stack gap="xl">
      <Stack gap="xxs">
        <Title variant="display">ERP-DSL</Title>
        <Text variant="body" color="secondary">
          닫힌 부품 DSL을 계층별로 나열한다. 부품을 누르면 라이브 예시 · 닫힌 props · 구성요소(하이퍼링크) · 쓰인 곳을 본다.
        </Text>
      </Stack>
      {groups.map((g) => (
        <Stack key={g.layer} gap="sm">
          <Group gap="xs" align="center"><Title variant="heading">{g.layer}</Title><Badge color="neutral">{String(g.items.length)}</Badge></Group>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--mantine-spacing-sm)' }}>
            {g.items.map((e) => (
              <Link key={e.name} href={`/dev/part/${e.name}`} style={{ textDecoration: 'none' }}>
                <Card variant="outlined" padding="md" fill>
                  <Stack gap="xxs">
                    <Text variant="body-strong">{e.name}</Text>
                    <Text variant="caption" color="secondary">{e.role}</Text>
                  </Stack>
                </Card>
              </Link>
            ))}
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
