import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tilawatif — Listen. Learn. Reflect.',
  description: 'A calm space to explore Quran recitations, reciters, playlists, and your listening journey.',
  applicationName: 'Tilawatif',
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
