// app/api/professors/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeMultiSourceDiscovery } from '@/lib/academic-api';
import { rankAndExplainMatches } from '@/lib/gemini-matcher';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      countryCode,
      universityId,
      universityName,
      domainCategory,
      selectedTopics,
      customInterest,
      studyLevel,
      userBio,
    } = body;

    if (!countryCode) {
      return NextResponse.json({ error: 'Country selection is mandatory.' }, { status: 400 });
    }

    // 1. Execute Institution-First Multi-Source Discovery Pipeline
    const discoveryResult = await executeMultiSourceDiscovery({
      countryCode,
      universityId: universityId === 'all' ? undefined : universityId,
      universityName: universityName === 'all' ? undefined : universityName,
      domainCategory,
      selectedTopics,
      customInterest,
    });

    if (discoveryResult.professors.length === 0) {
      return NextResponse.json({
        professors: [],
        sourcesSearched: discoveryResult.sourcesSearched,
        totalProfessors: 0,
        totalUniversities: 0,
        debugInfo: discoveryResult.debugInfo,
      });
    }

    // 2. Intelligent Gemini AI Matching & Alignment Scoring
    const combinedTopicsStr =
      [...(selectedTopics || []), customInterest || ''].filter(Boolean).join(', ') ||
      domainCategory ||
      'Academic Research';

    const matchedProfessors = await rankAndExplainMatches(
      discoveryResult.professors,
      combinedTopicsStr,
      customInterest,
      studyLevel,
      userBio
    );

    return NextResponse.json({
      professors: matchedProfessors,
      sourcesSearched: discoveryResult.sourcesSearched,
      totalProfessors: matchedProfessors.length,
      totalUniversities: discoveryResult.totalUniversities,
      debugInfo: discoveryResult.debugInfo,
      searchParamsUsed: discoveryResult.searchParamsUsed,
    });
  } catch (error: any) {
    console.error('Professors Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process academic search pipeline request.' },
      { status: 500 }
    );
  }
}
