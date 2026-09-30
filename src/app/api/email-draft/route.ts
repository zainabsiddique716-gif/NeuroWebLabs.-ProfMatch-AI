// app/api/email-draft/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateOutreachEmail } from '@/lib/email-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { professor, userInterest, userProposal, studyLevel, userBio, tone } = body;

    if (!professor || !userInterest) {
      return NextResponse.json({ error: 'Professor details and user interest are required.' }, { status: 400 });
    }

    const emailDraft = await generateOutreachEmail({
      professor,
      userInterest,
      userProposal,
      studyLevel,
      userBio,
      tone,
    });

    return NextResponse.json({ emailDraft });
  } catch (error: any) {
    console.error('Email draft route error:', error);
    return NextResponse.json({ error: 'Failed to generate personalized email draft.' }, { status: 500 });
  }
}
