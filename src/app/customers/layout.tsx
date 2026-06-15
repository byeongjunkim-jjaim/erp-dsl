'use client';
// 고객 탭 공통 셸 — AppShell이 목록/상세를 감싼다. (AppShell은 "고객"을 모름 — 메뉴·로고 주입)
import { useRouter, usePathname } from 'next/navigation';
import { AppShell, Title } from '@/ui';

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathname.startsWith('/customers') ? '/customers' : pathname;

  return (
    <AppShell
      logo={<Title variant="heading">kk ERP</Title>}
      onLogoClick={() => router.push('/')}
      activePath={active}
      onNavigate={(p) => router.push(p)}
      menuItems={[
        { label: '대시보드', icon: 'dots', path: '/', group: '개요' },
        { label: '고객 관리', icon: 'search', path: '/customers', group: '거래' },
        { label: '제품', icon: 'upload', path: '/products', group: '거래' },
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
      {children}
    </AppShell>
  );
}
