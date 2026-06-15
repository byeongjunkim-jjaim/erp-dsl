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
    // 최소 높이 — empty가 떴을 때 elevated 카드 등이 쭈그러들지 않게(세로 중앙도 이 높이 안에서 의미). 잠정값.
    <div style={{ minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* 바깥(묶음 ↔ action): lg / 안(아이콘 ↔ 제목·설명 묶음): sm / 제목 ↔ 설명: xxs(한 단계 작게) */}
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
    </div>
  );
}
