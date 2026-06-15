'use client';
import { useState } from 'react';
import { AppShell, PageHeader, Card, Title, Text, Stack } from '@/ui';

export default function ShellDemo() {
  const [active, setActive] = useState('/orders');
  return (
    <AppShell
      logo={<Title variant="heading">kk ERP</Title>}
      logoMark={<Title variant="heading">kk</Title>}
      onLogoClick={() => setActive('/')}
      activePath={active}
      onNavigate={setActive}
      menuItems={[
        { label: '대시보드', icon: 'dots', path: '/', group: '개요' },
        { label: '발주', icon: 'upload', path: '/orders', group: '거래' },
        { label: '제품', icon: 'search', path: '/products', group: '거래' },
        { label: '설정', icon: 'refresh', path: '/settings', group: '관리' },
      ]}
      profile={{
        name: '김병준', role: '관리자', email: 'bj.kim@kk.co.kr',
        menu: [
          { label: '내 프로필', icon: 'user', onClick: () => {} },
          { label: '설정', icon: 'settings', onClick: () => {} },
          { label: '로그아웃', icon: 'logout', variant: 'danger', onClick: () => {} },
        ],
      }}
      notification={{ hasUnread: true, onClick: () => {} }}
    >
      <Stack gap="lg">
        <PageHeader title="AppShell 데모" description={`활성 경로: ${active}`} />
        <Card variant="outlined" padding="lg">
          <Text variant="body">사이드바(로고·메뉴·프로필) + 콘텐츠. 모바일 폭에선 햄버거로 접힘. AppShell은 '발주'가 뭔지 모른다.</Text>
        </Card>
      </Stack>
    </AppShell>
  );
}
