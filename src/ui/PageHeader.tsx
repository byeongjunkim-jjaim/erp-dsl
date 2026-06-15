// PageHeader 유기체 — 상단 제목/설명(좌) + 액션(우). 도메인 무관 골격.
// 관습: 액션 버튼은 size=sm 고정 — 제목(heading)이 페이지 주인공이므로 버튼 세로를 낮춰 위계를 잡는다.
import { Group } from './Group';
import { Stack } from './Stack';
import { Title } from './Title';
import { Text } from './Text';
import type { Action } from './_cells';
import { renderAction } from './_cells';

type Props = { title: string; description?: string; actions?: Action[] };

export function PageHeader({ title, description, actions }: Props) {
  return (
    <Group justify="between" align="center">
      <Stack gap="xxs">
        <Title variant="heading">{title}</Title>
        {description && <Text variant="body" color="secondary">{description}</Text>}
      </Stack>
      {actions && actions.length > 0 && (
        <Group gap="xs">
          {actions.map((a, i) => renderAction(a, i, 'sm'))}
        </Group>
      )}
    </Group>
  );
}
