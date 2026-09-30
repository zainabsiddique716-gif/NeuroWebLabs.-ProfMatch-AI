// lib/gemini-matcher.ts
import { GoogleGenAI } from '@google/genai';
import { ProfessorProfile } from '@/types/academic';

export async function rankAndExplainMatches(
  professors: ProfessorProfile[],
  userInterests: string,
  userProposal?: string,
  studyLevel?: string,
  userBio?: string
): Promise<ProfessorProfile[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || professors.length === 0) {
    // Graceful fallback score calculation if API key is not yet set
    return professors.map((p) => {
      const matchScore = p.recentPublications.length > 0 ? 82 : 72;
      return {
        ...p,
        matchScore,
        matchFit: matchScore >= 80 ? 'Strong' : 'Moderate',
        matchingTopics: p.researchInterests.slice(0, 3),
        matchReason: `Matched based on research in ${p.researchInterests.slice(0, 2).join(', ')} at ${p.university}.`,
        matchEvidence: p.recentPublications.map((pub) => pub.title).slice(0, 2),
      };
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  const candidateSummaries = professors.map((p, idx) => ({
    index: idx,
    id: p.id,
    name: p.name,
    university: p.university,
    topics: p.researchInterests,
    publications: p.recentPublications.map((pub) => pub.title),
  }));

  const prompt = `
You are an expert academic research advisor system evaluating thesis/lab fit.

STUDENT RESEARCH INTENT & BACKGROUND:
- Target Research Area/Keywords: "${userInterests}"
- Detailed Proposal / Abstract: "${userProposal || 'Not provided'}"
- Study Level Target: "${studyLevel || 'Graduate/PhD Research'}"
- Student Bio / Background: "${userBio || 'Not provided'}"

FACULTY CANDIDATE PROFILES:
${JSON.stringify(candidateSummaries, null, 2)}

INSTRUCTIONS:
1. Carefully compare the student's research interests with each candidate's verified publication titles and research topics.
2. If there is genuine overlap in publications or topics, assign an objective matchScore (50-98) and matchFit ("Strong" | "Moderate" | "Limited").
3. If there is insufficient evidence or zero topic overlap, set matchFit to "Insufficient research data" and matchScore to 55.
4. Write a concise 1-2 sentence matchReason explaining WHY they fit, citing exact topics or paper titles.
5. Provide a 1-3 item matchEvidence array referencing specific matching papers or field tags.

Return ONLY a valid JSON array of objects with the structure:
[
  {
    "index": number,
    "matchScore": number,
    "matchFit": "Strong" | "Moderate" | "Limited" | "Insufficient research data",
    "matchingTopics": string[],
    "matchReason": string,
    "matchEvidence": string[]
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '[]';
    const parsed: Array<{
      index: number;
      matchScore: number;
      matchFit: 'Strong' | 'Moderate' | 'Limited' | 'Insufficient research data';
      matchingTopics: string[];
      matchReason: string;
      matchEvidence: string[];
    }> = JSON.parse(responseText);

    const matchMap = new Map<number, typeof parsed[0]>();
    parsed.forEach((item) => matchMap.set(item.index, item));

    const enriched = professors.map((prof, idx) => {
      const matchData = matchMap.get(idx);
      return {
        ...prof,
        matchScore: matchData?.matchScore ?? 78,
        matchFit: matchData?.matchFit ?? 'Moderate',
        matchingTopics: matchData?.matchingTopics ?? prof.researchInterests.slice(0, 3),
        matchReason: matchData?.matchReason ?? `Aligned with faculty research tracks at ${prof.university}.`,
        matchEvidence: matchData?.matchEvidence ?? prof.recentPublications.map((p) => p.title).slice(0, 2),
      };
    });

    // Rank highest score first
    return enriched.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } catch (err) {
    console.error('Gemini AI matching error:', err);
    return professors.map((p) => ({
      ...p,
      matchScore: 80,
      matchFit: 'Moderate',
      matchingTopics: p.researchInterests.slice(0, 3),
      matchReason: `Active researcher in ${p.researchInterests.join(', ')} at ${p.university}.`,
      matchEvidence: p.recentPublications.map((pub) => pub.title).slice(0, 2),
    }));
  }
}
