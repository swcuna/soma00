import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: '/soma-logo.png' },
  title: 'SOMA00 — Dexterity for the real world',
  description: 'Human-like dexterity for a world built for people. See SOMA00 translate human movement into robotic possibility.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="inter_fe8b9d92-module__LINzvG__variable antialiased">{children}</body></html>;
}
