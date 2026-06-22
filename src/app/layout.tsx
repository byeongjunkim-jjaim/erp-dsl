import type { ReactNode } from 'react';
import type { Viewport } from 'next';
// 바깥(앱)은 오직 @/ui 배럴만 import 한다 (헌법 7).
import { Providers, ColorSchemeScript, mantineHtmlProps } from '@/ui';

export const metadata = { title: 'ERP DSL' };

// viewport-fit=cover — iOS가 env(safe-area-inset-*)를 채우게 하는 필수 스위치. 없으면 env()=0이라
//  AppShell 하단 탭바의 홈 인디케이터 안전영역 예약이 작동하지 않는다(탭이 인디케이터에 가려짐).
//  ※ 소비처 앱(거래처 포탈 등)도 자기 layout에 동일하게 넣어야 한다 — 이 파일은 패키지 미포함(dev 데모·레퍼런스).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
