import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScholarMatch AI — Professor & Scholarship Matching Platform',
  description: 'AI-Powered University & Faculty Discovery, LLM Research Fit Scoring, and Automated Outreach Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 min-h-screen antialiased font-serif">
        {children}
      </body>
    </html>
  );
}
