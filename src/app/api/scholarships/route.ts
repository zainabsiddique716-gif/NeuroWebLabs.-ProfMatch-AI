// app/api/scholarships/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SCHOLARSHIPS_DATABASE } from '@/lib/scholarships-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const degree = searchParams.get('degree');
  const query = searchParams.get('query');

  let results = [...SCHOLARSHIPS_DATABASE];

  if (country && country !== 'all') {
    results = results.filter((s) => s.countryCode.toUpperCase() === country.toUpperCase());
  }

  if (degree && degree !== 'all') {
    results = results.filter((s) => s.degreeLevels.includes(degree as any));
  }

  if (query && query.trim().length > 0) {
    const q = query.toLowerCase();
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.domains.some((d) => d.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ scholarships: results });
}
