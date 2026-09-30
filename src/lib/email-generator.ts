// lib/email-generator.ts
import { GoogleGenAI } from '@google/genai';
import { ProfessorProfile } from '@/types/academic';

export interface EmailDraftResponse {
  subject: string;
  body: string;
  tone: 'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise';
}

export async function generateOutreachEmail(params: {
  professor: ProfessorProfile;
  userInterest: string;
  userProposal?: string;
  studyLevel?: string;
  userBio?: string;
  tone?: 'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise';
}): Promise<EmailDraftResponse> {
  const { professor, userInterest, userProposal, studyLevel = 'PhD', userBio, tone = 'Academic Professional' } = params;

  const apiKey = process.env.GEMINI_API_KEY;
  const recentPaper = professor.recentPublications[0]?.title || professor.researchInterests[0] || 'your recent publications';
  const lastName = professor.name.split(' ').pop() || professor.name;

  if (!apiKey) {
    // High-quality fallback template
    return {
      subject: `Inquiry Regarding ${studyLevel} Research Opportunities in ${userInterest} — ${professor.name}`,
      body: `Dear Professor ${lastName},

I hope this email finds you well.

I am writing to express my strong interest in joining your research team at ${professor.university} as a prospective ${studyLevel} student. I have been following your faculty group's research in ${professor.researchInterests.slice(0, 2).join(' and ')}, particularly your recent work on "${recentPaper}".

${userProposal ? `My research background and proposal focus on ${userProposal}. ` : `My background aligns closely with ${userInterest}. `}${userBio ? `Specifically, ${userBio}.` : ''}

I would welcome the opportunity to discuss any open research assistantships or lab positions under your supervision. I have attached my CV for your reference and look forward to hearing from you.

Sincerely,
[Your Name]
[Your Contact Information]`,
      tone,
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Write a highly personalized, concise academic outreach email from a student to a professor.

PROFESSOR DETAILS:
- Name: ${professor.name}
- Title: ${professor.title}
- University: ${professor.university} (${professor.country})
- Department: ${professor.department || 'Academic Faculty'}
- Key Topics: ${professor.researchInterests.join(', ')}
- Featured Recent Paper: "${recentPaper}"

STUDENT DETAILS:
- Target Research Interest: "${userInterest}"
- Target Study Level: "${studyLevel}"
- Student Proposal / Abstract: "${userProposal || 'Not specified'}"
- Student Background / CV: "${userBio || 'Strong academic background'}"
- Selected Email Tone: "${tone}"

REQUIREMENTS:
1. Address the professor respectfully as "Dear Professor ${lastName}".
2. Specifically cite their paper "${recentPaper}" or exact research track.
3. Express genuine academic alignment with the student's research proposal.
4. Keep the email body clean, professional, and within 150-220 words.
5. Provide a compelling, concise subject line.

Return ONLY a valid JSON object:
{
  "subject": "string",
  "body": "string"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      subject: parsed.subject || `Inquiry Regarding ${studyLevel} Opportunities — ${professor.name}`,
      body: parsed.body || `Dear Professor ${lastName},\n\nI am writing to express my interest in your research at ${professor.university}...`,
      tone,
    };
  } catch (err) {
    console.error('Email generation error:', err);
    return {
      subject: `Inquiry Regarding ${studyLevel} Opportunities in ${userInterest} — ${professor.name}`,
      body: `Dear Professor ${lastName},\n\nI am deeply interested in your research at ${professor.university} in ${recentPaper}...`,
      tone,
    };
  }
}
