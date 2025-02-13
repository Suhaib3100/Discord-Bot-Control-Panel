import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Navigation from '@/components/navigation'; // Import the client-side navigation component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discord Bot Dashboard',
  description: 'Professional Discord Bot Management Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navigation Bar (Client Component) */}
          <Navigation />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}