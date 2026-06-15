// DescriptionList 유기체 — "라벨: 값" 쌍 나열, 읽기 전용, 도메인 무관. value 표현은 셀 타입 enum 공유.
import { Grid } from './Grid';
import { Stack } from './Stack';
import { Text } from './Text';
import { renderCell, type CellType, type BadgeColor } from './_cells';

type Item = {
  label: string;
  value: unknown;
  type: CellType;
  badgeColors?: Record<string, BadgeColor>;
};
type Props = { items: Item[]; columns?: 1 | 2 | 3 };

export function DescriptionList({ items, columns = 2 }: Props) {
  return (
    <Grid columns={columns} gap="md">
      {items.map((it, i) => (
        <Grid.Col span={1} key={i}>
          <Stack gap="xxs">
            {/* 정보 라벨 = caption + secondary (폼 라벨의 body-strong과 다름 — 맥락이 단계를 고름) */}
            <Text variant="caption" color="secondary">{it.label}</Text>
            {/* 값 줄 높이를 토큰으로 통일 + 세로 중앙 → 텍스트/배지 등 이종 콘텐츠가 baseline을 맞춘다.
                (프리미티브는 "박스 간격"을 맞추지만, 박스 "안" 콘텐츠 높이(텍스트 줄 vs 배지 알약)는 자동으로 안 맞음) */}
            <div style={{ display: 'flex', alignItems: 'center', minHeight: 'var(--mantine-spacing-lg)' }}>
              {renderCell(it.type, it.value, { badgeColors: it.badgeColors })}
            </div>
          </Stack>
        </Grid.Col>
      ))}
    </Grid>
  );
}
