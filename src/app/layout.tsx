import type { ReactNode } from 'react';
// 바깥(앱)은 오직 @/ui 배럴만 import 한다 (헌법 7).
import { Providers, ColorSchemeScript, mantineHtmlProps } from '@/ui';

export const metadata = { title: 'ERP DSL' };

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
