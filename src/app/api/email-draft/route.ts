import { NextRequest, NextResponse } from 'next/server';
import { generateColdEmailWithGemini } from '@/lib/gemini';
import { Professor, StudentProfile } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { professor, profile, tone = 'Academic Professional' } = body as {
      professor: Professor;
      profile: StudentProfile;
      tone: 'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise';
    };

    if (!professor || !profile) {
      return NextResponse.json({ error: 'Missing professor or profile object' }, { status: 400 });
    }

    const emailDraft = await generateColdEmailWithGemini(professor, profile, tone);

    return NextResponse.json({
      success: true,
      emailDraft
    });
  } catch (error: any) {
    console.error('Email Draft API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to draft email' }, { status: 500 });
  }
}
