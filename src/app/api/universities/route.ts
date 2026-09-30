// app/api/universities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchUniversitiesByCountry } from '@/lib/openalex';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');

  if (!country) {
    return NextResponse.json({ error: 'Country code is required' }, { status: 400 });
  }

  const universities = await fetchUniversitiesByCountry(country);
  return NextResponse.json({ universities });
}
