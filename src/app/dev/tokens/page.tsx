// 토큰 전시실 — 색 역할·간격·타이포·radius·그림자(통일이 강제되는 최하위 뿌리).
import { Stack, Title, Text } from '@/ui';
import { DevTokenPreview } from '@/ui/_dev';

export default function TokensRoom() {
  return (
    <Stack gap="lg">
      <Stack gap="xxs">
        <Title variant="display">토큰</Title>
        <Text variant="body" color="secondary">값 그 자체(아원자). 모든 부품이 역할 이름만 참조하므로 여기서 통일이 강제된다.</Text>
      </Stack>
      <DevTokenPreview />
    </Stack>
  );
}
