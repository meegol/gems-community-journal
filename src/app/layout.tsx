import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeContext';

export const metadata: Metadata = {
  title: 'GEMS Community Journal - Futures Trading Log & Analytics',
  description: 'A modern futures trading journal featuring auto Risk:Reward calculations, TradeZella-style monthly calendar, screenshot attachments, and privacy-shielded community stats.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="antialiased min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
