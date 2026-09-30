import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProfMatch AI — Academic Research & Professor Match Engine',
  description: 'AI-Powered University & Faculty Discovery, OpenAlex Data Normalization, and Gemini Research Match Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
