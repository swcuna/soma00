import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const spartan = localFont({
  src: [
    { path: '../public/fonts/Spartan-400.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Spartan-600.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-spartan',
  display: 'swap',
});

export const metadata: Metadata = {
  icons: { icon: '/soma-logo.png' },
  title: 'SOMA00 — Dexterity for the real world',
  description: 'State-of-the-art control frequency and human-like dexterous manipulation. Powering robotics with the intelligence they need to navigate the real world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spartan.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
