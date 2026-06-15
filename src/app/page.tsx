import { Container, Stack, Anchor } from '@/ui';
import { DevTokenPreview, DevAtomGallery, DevMoleculeGallery, DevOrganismGallery } from '@/ui/_dev';
export default function Home() {
  return (
    <div style={{ background: 'var(--bg-tertiary)', minHeight: '100vh', paddingBottom: 48 }}>
      <DevTokenPreview />
      <Container maxWidth="default">
        <Stack gap="xl">
          <DevAtomGallery />
          <DevMoleculeGallery />
          <DevOrganismGallery />
          <Anchor href="/shell">→ AppShell 데모 (페이지 골격, 별도 라우트)</Anchor>
          <Anchor href="/customers">→ 고객 관리 (스키마 구동 수직 슬라이스)</Anchor>
        </Stack>
      </Container>
    </div>
  );
}
