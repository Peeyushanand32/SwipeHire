import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SwipeHire — Effortless Career & Candidate Matching',
  description: 'Swipe right on your next job or hire top talent instantly. A modern Tinder-style recruitment platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FCF8FF] text-[#1A1A2E] antialiased">
        {children}
      </body>
    </html>
  );
}
