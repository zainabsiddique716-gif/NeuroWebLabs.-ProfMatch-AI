import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_SCHOLARSHIPS } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country')?.toLowerCase() || '';
  const domain = searchParams.get('domain')?.toLowerCase() || '';

  const filtered = SAMPLE_SCHOLARSHIPS.filter(sch => {
    const matchCountry = !country || sch.country.toLowerCase().includes(country) || country === 'all';
    const matchDomain = !domain || sch.eligibleDomains.some(d => d.toLowerCase().includes(domain)) || domain === 'all';
    return matchCountry || matchDomain;
  });

  return NextResponse.json({
    success: true,
    scholarships: filtered.length > 0 ? filtered : SAMPLE_SCHOLARSHIPS
  });
}
