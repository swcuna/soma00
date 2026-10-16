import type { Metadata, Viewport } from 'next';
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

// Render the desktop layout on phones and let the browser scale it to fit.
// Omit Next.js's default initial-scale=1 so the full width is visible on load.
export const viewport: Viewport = {
  width: 1280,
  initialScale: undefined,
  userScalable: true,
};

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
