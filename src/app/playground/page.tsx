// 부품 편집기 PoC — 닫힌 prop을 유한 컨트롤로 라이브 편집. dev 전용(부품 아님).
import { Container } from '@/ui';
import { DevPlayground } from '@/ui/_dev';

export default function PlaygroundPage() {
  return (
    <div style={{ background: 'var(--bg-tertiary)', minHeight: '100vh', padding: '32px 0 64px' }}>
      <Container maxWidth="wide">
        <DevPlayground />
      </Container>
    </div>
  );
}
