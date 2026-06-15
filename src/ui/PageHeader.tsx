// PageHeader 유기체 — 상단 제목/설명(좌) + 액션(우). 도메인 무관 골격.
// 관습: 액션 버튼은 size=sm 고정 — 제목(heading)이 페이지 주인공이므로 버튼 세로를 낮춰 위계를 잡는다.
// 확장: 제목 우측 inline 상태배지(status, optional). ghost 버튼류는 기존 actions(variant='ghost')로 충분.
import { Group } from './Group';
import { Stack } from './Stack';
import { Title } from './Title';
import { Text } from './Text';
import { Badge } from './Badge';
import type { Action, BadgeColor } from './_cells';
import { renderAction } from './_cells';

type Props = {
  title: string;
  description?: string;
  status?: { label: string; tone: BadgeColor }; // 제목 우측 inline Badge(optional — 회귀 없음, 안 주면 미조립)
  actions?: Action[];
};

export function PageHeader({ title, description, status, actions }: Props) {
  return (
    <Group justify="between" align="center">
      <Group gap="sm" align="center" wrap={false}>
        <Stack gap="xxs">
          <Title variant="heading">{title}</Title>
          {description && <Text variant="body" color="secondary">{description}</Text>}
        </Stack>
        {status && <Badge color={status.tone}>{status.label}</Badge>}
      </Group>
      {actions && actions.length > 0 && (
        <Group gap="xs">
          {actions.map((a, i) => renderAction(a, i, 'sm'))}
        </Group>
      )}
    </Group>
  );
}
