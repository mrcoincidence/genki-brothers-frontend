// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Outfit, Inter, BIZ_UDPGothic, Zen_Kaku_Gothic_New } from 'next/font/google';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageContext';
import CookieBanner from './components/CookieBanner';
import { Analytics } from '@vercel/analytics/react';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bizUdpGothic = BIZ_UDPGothic({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-biz-udpgothic',
  display: 'swap',
});

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-zen-kaku',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Genki Brothers',
  description: 'Creative Studio & Digital Architecture',
  icons: {
    icon: [
      { url: 'https://api.genkibrothers.co/favicon/favicon.ico' },
      { url: 'https://api.genkibrothers.co/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: 'https://api.genkibrothers.co/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: 'https://api.genkibrothers.co/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: 'https://api.genkibrothers.co/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${bizUdpGothic.variable} ${zenKaku.variable} dark`}>
      <body className="font-sans antialiased bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500">
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <CookieBanner />
            <Analytics />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}