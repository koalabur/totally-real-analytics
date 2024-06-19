import './globals.css';

import type { Metadata } from 'next';
import { Overpass } from 'next/font/google';

import Header from '@/components/Header';

const overpass = Overpass({ subsets: ['latin'], variable: '--primary-font' });

export const metadata: Metadata = {
  title: 'TOTALLY REAL analytics',
  description: 'Small analytics dashboard created using D3 and React/Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={overpass.variable}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
