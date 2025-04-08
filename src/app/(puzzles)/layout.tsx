import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Slash Engineering Puzzles',
  description:
    'Explore engineering blog posts and tackle interesting puzzles to sharpen your skills',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
