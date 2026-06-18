'use client';
// Stat (분자) — KPI 지표 타일(추세형). SummaryCard의 형제: 큰 값 + 추세 화살표·델타.
//  · 경계: 건수/금액 요약=SummaryCard, 단일 지표+추세(매출·증감률)=Stat.
//  · trend 색 고정: up=success / down=danger / flat=neutral. value는 이미 포맷된 표시값(포맷은 데이터/호출측).
import { Card } from './Card';
import { Group } from './Group';
import { Stack } from './Stack';
import { Text } from './Text';
import { Title } from './Title';
import { Badge } from './Badge';
import { Icon, type IconName } from './Icon';

type Trend = 'up' | 'down' | 'flat';
type Props = {
  label: string;
  value: string;       // 포맷된 표시값(₩·%·단위 포함)
  trend?: Trend;
  delta?: string;      // 예: '+12.4%'
  icon?: IconName;
};
const TREND: Record<Trend, { tone: 'success' | 'danger' | 'neutral'; mark: string }> = {
  up: { tone: 'success', mark: '▲' },
  down: { tone: 'danger', mark: '▼' },
  flat: { tone: 'neutral', mark: '—' },
};
export function Stat({ label, value, trend, delta, icon }: Props) {
  const t = trend ? TREND[trend] : null;
  return (
    <Card variant="elevated" padding="lg" fill>
      <Stack gap="xs">
        <Group gap="xs" align="center" wrap={false}>
          {icon && <Icon name={icon} size="sm" color="secondary" />}
          <Text variant="body" color="secondary">{label}</Text>
        </Group>
        <Title variant="display">{value}</Title>
        {(t || delta) && (
          <Group gap="xxs" align="center" wrap={false}>
            {t ? <Badge color={t.tone}>{`${t.mark}${delta ? ` ${delta}` : ''}`}</Badge> : <Text variant="caption" color="secondary">{delta}</Text>}
          </Group>
        )}
      </Stack>
    </Card>
  );
}
