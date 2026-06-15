// SummaryCard (분자) — KPI/요약 타일. [틴트 아이콘] + 라벨 + 큰 수치(건수) + 보조 수치(금액).
//  · 정산 요약(승인대기 N건·₩, 확정 N건·₩) 같은 대시보드 통계 타일. 도메인 무관(어떤 ERP에도 있음).
//  · 분자 본질(고정): Card + 틴트 Icon + Title(count) + Text(label/amount) 결합. tone이 아이콘 강조색을 고정.
//  · count·amount는 둘 다 선택 — 건수만/금액만/둘 다 가능. 토글 prop 아님(값 유무로 결정 — 03 §11-3).
//  · 아이콘 틴트는 Callout 선례와 동일: 의미색 스케일 토큰 var(--mantine-color-{tone}-{n})만 참조(raw hex 0).
//  · 통화·숫자 포맷은 _cells의 단일 진실(fmtCurrency/fmtNumber) 재사용.
import { Card } from './Card';
import { Group } from './Group';
import { Stack } from './Stack';
import { Text } from './Text';
import { Title } from './Title';
import { Icon, type IconName } from './Icon';
import { fmtCurrency, fmtNumber, type BadgeColor } from './_cells';

type SummaryCardProps = {
  label: string;                 // 콘텐츠 prop(텍스트)
  icon?: IconName;               // 닫힌 enum
  tone?: BadgeColor;             // 아이콘 틴트(기본 neutral). 닫힌 enum 5종
  count?: number;                // 건수(천단위 콤마). 없으면 표시 안 함
  amount?: number;               // 금액(₩ + 콤마). 없으면 표시 안 함
};

export function SummaryCard({ label, icon, tone = 'neutral', count, amount }: SummaryCardProps) {
  return (
    // fill: equalRows 그리드 셀 높이를 채워 KPI 타일이 균일해진다(그리드 밖에선 height:100%→auto, 무해).
    <Card variant="elevated" padding="lg" fill>
      <Group gap="md" align="center" wrap={false}>
        {icon && (
          <span
            style={{
              color: `var(--mantine-color-${tone}-7)`,
              background: `var(--mantine-color-${tone}-0)`,
              borderRadius: 'var(--mantine-radius-md)',
              padding: 'var(--mantine-spacing-xs)',
              display: 'inline-flex',
              flexShrink: 0,
            }}
          >
            <Icon name={icon} size="md" />
          </span>
        )}
        <Stack gap="xxs">
          <Text variant="body" color="secondary">{label}</Text>
          {count != null && <Title variant="heading">{fmtNumber(count)}건</Title>}
          {amount != null && <Text variant="body-strong">{fmtCurrency(amount)}</Text>}
        </Stack>
      </Group>
    </Card>
  );
}
