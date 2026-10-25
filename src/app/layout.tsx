import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { homeContent } from '@/lib/content';
import { themeBootstrap } from '@/lib/theme/bootstrap';
import '@/styles/globals.css';
const archivo = localFont({
  src: '../../public/assets/fonts/archivo_expanded-s.p.2_qy8wb4tup4i.woff2',
  weight: '600 800',
  display: 'swap',
  variable: '--font-display',
});
const inter = localFont({
  src: '../../public/assets/fonts/inter-s.p.392mse19q3cb2.woff2',
  weight: '400 600',
  display: 'swap',
  variable: '--font-body',
});
const mono = localFont({
  src: '../../public/assets/fonts/effe91970fc4db64-s.p.28xcb7557rbh2.woff2',
  weight: '500',
  display: 'swap',
  variable: '--font-mono',
});
export default function RootLayout({ children }: { children: ReactNode }) {
  const head = homeContent.head;
  return (
    <html
      lang={head.lang}
      suppressHydrationWarning
      className={[archivo.variable, inter.variable, mono.variable].join(' ')}
    >
      <head>
        <title>{head.title}</title>
        {head.meta
          .filter((m) => !('charset' in m) && m.name !== 'viewport')
          .map((m, i) => (
            <meta key={i} {...m} />
          ))}
        {head.links.map((l, i) => (
          <link key={i} {...l} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        {children}
        {head.structuredData.map((d, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(d).replace(/</g, '\u003c'),
            }}
          />
        ))}
      </body>
    </html>
  );
}
