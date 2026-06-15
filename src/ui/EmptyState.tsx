// EmptyState 유기체 — empty 전용. 아이콘+제목+설명+[action] 세로 중앙. 내용 스키마 주입, 배치 고정.
import { Stack } from './Stack';
import { Title } from './Title';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import type { Action } from './_cells';
import { renderAction } from './_cells';

type Props = {
  icon?: IconName;
  title: string;
  description?: string;
  action?: Action; // 없으면 버튼 미조립(숨김 아님)
};

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    // 바깥(묶음 ↔ action): lg / 안(아이콘 ↔ 제목·설명 묶음): sm / 제목 ↔ 설명: xxs(한 단계 작게)
    <Stack gap="lg" align="center" justify="center">
      <Stack gap="sm" align="center">
        {icon && <Icon name={icon} size="lg" color="secondary" />}
        <Stack gap="xxs" align="center">
          <Title variant="subheading">{title}</Title>
          {description && <Text variant="body" color="secondary">{description}</Text>}
        </Stack>
      </Stack>
      {action && renderAction({ ...action, variant: action.variant ?? 'primary' }, 'a')}
    </Stack>
  );
}
