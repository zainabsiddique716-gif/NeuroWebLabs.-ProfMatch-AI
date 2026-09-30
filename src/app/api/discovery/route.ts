import { NextRequest, NextResponse } from 'next/server';
import { searchOpenAlexProfessors } from '@/lib/openalex';
import { scoreProfessorWithGemini } from '@/lib/gemini';
import { StudentProfile } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain = 'Artificial Intelligence', country = 'United States', studyLevel = 'PhD', statementOfPurpose = '' } = body;

    const studentProfile: StudentProfile = {
      domain,
      country,
      studyLevel,
      statementOfPurpose
    };

    // 1. Discover Professors
    const rawProfessors = await searchOpenAlexProfessors(domain, country);

    // 2. Score Alignment using Gemini / AI Engine
    const scoredProfessors = await Promise.all(
      rawProfessors.map(async (prof) => {
        const aiResult = await scoreProfessorWithGemini(prof, studentProfile);
        return {
          ...prof,
          alignmentScore: aiResult.score,
          alignmentJustification: aiResult.justification,
          matchingKeywords: aiResult.keywords
        };
      })
    );

    // 3. Sort by Alignment Score descending
    scoredProfessors.sort((a, b) => (b.alignmentScore || 0) - (a.alignmentScore || 0));

    return NextResponse.json({
      success: true,
      domain,
      country,
      professors: scoredProfessors,
      totalUniversities: new Set(scoredProfessors.map(p => p.university)).size,
      totalProfessors: scoredProfessors.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Discovery API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process discovery pipeline' },
      { status: 500 }
    );
  }
}
