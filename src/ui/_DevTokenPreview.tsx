'use client';

// ─────────────────────────────────────────────────────────────
// 0단계 시각 검증용 dev 프리뷰. DSL 부품이 아니라 "화면 확인 도구"다.
// 격리 구역(src/ui) 안이라 Mantine을 직접 만질 수 있고, 토큰을 *읽어서*
// 그리기만 한다(hex 리터럴 없음 — gate 2는 여기서도 켜져 있음).
// ─────────────────────────────────────────────────────────────

import { useMantineTheme, Box, Group, Stack, Text, Title } from '@mantine/core';
import { Button } from './Button';
import { Title as UiTitle } from './Title';
import { Text as UiText } from './Text';
import { Divider } from './Divider';

const COLOR_NAMES = ['primary', 'neutral', 'success', 'warning', 'danger', 'info'] as const;
const SHADES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const TYPO = ['display', 'heading', 'subheading', 'body', 'body-strong', 'caption'] as const;
const SPACING = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="sm">
      <Text fw={700} style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
        {title}
      </Text>
      {children}
    </Stack>
  );
}

export function DevTokenPreview() {
  const theme = useMantineTheme();
  return (
    <Stack gap="xl" p="xl" style={{ background: 'var(--bg-tertiary)', minHeight: '100vh' }}>
      <Title order={1} style={{ color: 'var(--text-primary)' }}>ERP DSL — 0단계 토큰 프리뷰</Title>
      <Text style={{ color: 'var(--text-secondary)' }}>
        아래 값은 전부 화면 검증에서 조정할 잠정값입니다. 구조·관계만 확정.
      </Text>

      <Section title="색 사다리 (10칸 · index 6 = 메인)">
        <Stack gap="xs">
          {COLOR_NAMES.map((name) => (
            <Group gap={0} key={name} wrap="nowrap">
              <Text w={90} style={{ color: 'var(--text-primary)' }} fw={600}>{name}</Text>
              {SHADES.map((i) => (
                <Box key={i} style={{
                  background: theme.colors[name][i],
                  width: 48, height: 40,
                  outline: i === 6 ? '2px solid var(--text-primary)' : 'none',
                  outlineOffset: -2,
                }} />
              ))}
            </Group>
          ))}
        </Stack>
      </Section>

      <Section title="시맨틱 역할 (모드 분기 지점)">
        <Group gap="lg">
          <Stack gap={4}>
            <Text style={{ color: 'var(--text-primary)' }}>text.primary</Text>
            <Text style={{ color: 'var(--text-secondary)' }}>text.secondary</Text>
            <Text style={{ color: 'var(--text-danger)' }}>text.danger</Text>
            <Text style={{ color: 'var(--text-disabled)' }}>text.disabled</Text>
          </Stack>
          <Group gap="xs">
            {(['primary', 'secondary', 'tertiary'] as const).map((k) => (
              <Box key={k} style={{ background: `var(--bg-${k})`, width: 80, height: 56, border: 'var(--border-width) solid var(--border-default)', borderRadius: theme.radius.sm }} />
            ))}
          </Group>
        </Group>
      </Section>

      <Section title="타이포 6단계">
        <Stack gap="xs">
          {TYPO.map((t) => {
            const spec = theme.other.typography[t];
            return (
              <Text key={t} style={{ color: 'var(--text-primary)', fontSize: spec.fontSize, fontWeight: spec.fontWeight, lineHeight: spec.lineHeight }}>
                {t} — 발주서 가나다 ABC 123
              </Text>
            );
          })}
        </Stack>
      </Section>

      <Section title="타이포 조합 시안 (6단계가 함께 놓였을 때)">
        <Box style={{ background: 'var(--bg-primary)', border: 'var(--border-width) solid var(--border-default)', borderRadius: theme.radius.md, padding: theme.spacing.lg }}>
          <Stack gap="md">
            {/* display + caption: 큰 수치 + 메타 */}
            <Stack gap="xxs">
              <UiTitle variant="display">₩12,840,000</UiTitle>
              <UiText variant="caption" color="secondary">이번 달 총 발주액 · 전월 대비 +8.2%</UiText>
            </Stack>
            <Divider />
            {/* heading + body + 인라인 body-strong */}
            <Stack gap="xs">
              <UiTitle variant="heading">최근 발주</UiTitle>
              <UiText variant="body">
                합판 200장 발주가 <UiText variant="body-strong">승인 대기</UiText> 상태입니다. 납기는 6월 20일이며, 단가는 확정되었습니다.
              </UiText>
            </Stack>
            {/* subheading + body + caption: 하위 구획 */}
            <Stack gap="xs">
              <UiTitle variant="subheading">담당자 메모</UiTitle>
              <UiText variant="body">단가 재확인이 필요합니다. 공급처 변경 가능성이 있어 다음 주 회의에서 논의 예정.</UiText>
              <UiText variant="caption" color="secondary">2026-06-15 오전 11:40 · 김병준</UiText>
            </Stack>
          </Stack>
        </Box>
      </Section>

      <Section title="간격 (4px 베이스)">
        <Stack gap="xs">
          {SPACING.map((s) => (
            <Group gap="xs" key={s} align="center">
              <Text w={48} style={{ color: 'var(--text-primary)' }}>{s}</Text>
              <Box style={{ background: theme.colors.primary[6], height: 16, width: theme.spacing[s] }} />
              <Text style={{ color: 'var(--text-secondary)' }}>{theme.spacing[s]}</Text>
            </Group>
          ))}
        </Stack>
      </Section>

      <Section title="radius · 그림자">
        <Group gap="lg">
          {(['sm', 'md', 'full'] as const).map((r) => (
            <Box key={r} style={{ background: theme.colors.primary[6], width: 72, height: 56, borderRadius: theme.radius[r] }} />
          ))}
          {(['sm', 'md'] as const).map((sh) => (
            <Box key={sh} style={{ background: 'var(--bg-primary)', width: 72, height: 56, boxShadow: theme.shadows[sh], borderRadius: theme.radius.md }} />
          ))}
        </Group>
      </Section>

      <Section title="Button 원자 (variant 4 × size 2 + 상태)">
        <Group gap="md">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </Group>
        <Group gap="md">
          <Button size="sm">sm</Button>
          <Button size="md">md</Button>
          <Button loading>loading</Button>
          <Button disabled>disabled</Button>
        </Group>
      </Section>
    </Stack>
  );
}
