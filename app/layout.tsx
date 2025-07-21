import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Haven Calmi',
  description: 'Clone of calmi.so with #40b2f5 brand color',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
