// TotalRow (분자) — 리스트 하단 합계 행. 구분선 + [라벨] ──── [금액].
//  · 시공비·사용내역서·청구·정산 4곳 반복(rule of three 충족)으로 추출.
//  · 분자 본질(고정): 위 Divider(마감선) + Group(justify=between)[라벨][금액 강조]를 한 단위로 결합(01 §4-C).
//    → 페이지에서 Divider+Group을 매번 조립하던 것을 분자가 흡수(조립 차단 → 합계 패턴 비통일 차단).
//  · 통화 포맷은 _cells의 단일 진실(fmtCurrency) 재사용.
import { Stack } from './Stack';
import { Divider } from './Divider';
import { Group } from './Group';
import { Text } from './Text';
import { fmtCurrency } from './_cells';

type TotalRowProps = {
  label?: string;     // 기본 '합계'
  amount: number;     // ₩ + 콤마
};

export function TotalRow({ label = '합계', amount }: TotalRowProps) {
  return (
    <Stack gap="xs">
      <Divider />
      <Group justify="between" align="center">
        <Text variant="body" color="secondary">{label}</Text>
        <Text variant="body-strong">{fmtCurrency(amount)}</Text>
      </Group>
    </Stack>
  );
}
