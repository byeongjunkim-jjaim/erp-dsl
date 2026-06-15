// Callout (분자) — 인라인 문맥 메시지. 그 자리에 머무는 비휘발 안내(중복 연락처 경고·레거시 주소 힌트 등).
//  · 토스트(휘발·우상단)와 의미가 다르다 — Callout은 폼/구획 안에 박혀 사라지지 않는다.
//  · tone이 (배경·보더·아이콘)을 함께 고정. 색은 의미색 스케일 토큰(Mantine color var)만 참조 — raw hex 없음.
//  · 텍스트는 가독성 위해 primary/secondary 역할 통로 유지(연한 tone 배경 위 틴트 텍스트는 대비 저하). tone은 배경·보더·아이콘이 전달.
import { Group as MGroup } from '@mantine/core';
import { Stack } from './Stack';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

type Tone = 'info' | 'warning' | 'danger' | 'neutral'; // Badge와 동형(primary 제외). success는 토스트 몫.

type Props = {
  tone?: Tone;
  title?: string;
  icon?: IconName;          // 생략 시 tone별 기본 아이콘
  children: string;         // 본문(raw 노드 금지 — string만)
};

// tone → (의미색 스케일 키, 기본 아이콘). 색은 var(--mantine-color-{key}-{n}) 토큰으로 참조.
const MAP: Record<Tone, { key: string; icon: IconName }> = {
  info:    { key: 'info',    icon: 'info' },
  warning: { key: 'warning', icon: 'alert-triangle' },
  danger:  { key: 'danger',  icon: 'alert-circle' },
  neutral: { key: 'neutral', icon: 'info' },
};

export function Callout({ tone = 'info', title, icon, children }: Props) {
  const m = MAP[tone];
  return (
    <div
      style={{
        background: `var(--mantine-color-${m.key}-0)`,
        border: `1px solid var(--mantine-color-${m.key}-2)`,
        borderRadius: 'var(--mantine-radius-md)',
        padding: 'var(--mantine-spacing-md)',
      }}
    >
      <MGroup gap="sm" align="flex-start" wrap="nowrap">
        <span style={{ color: `var(--mantine-color-${m.key}-7)`, display: 'inline-flex', flexShrink: 0, transform: 'translateY(2px)' }}>
          <Icon name={icon ?? m.icon} size="sm" />
        </span>
        <Stack gap="xxs">
          {title && <Text variant="body-strong">{title}</Text>}
          <Text variant="body">{children}</Text>
        </Stack>
      </MGroup>
    </div>
  );
}
