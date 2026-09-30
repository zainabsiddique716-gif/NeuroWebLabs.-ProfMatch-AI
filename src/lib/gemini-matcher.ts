// lib/gemini-matcher.ts
import { GoogleGenAI } from '@google/genai';
import { ProfessorProfile } from '@/types/academic';

/**
 * Deterministic weighted similarity calculator (fallback when LLM key is absent/unavailable)
 * Weights:
 * - Research Topic Overlap: 40%
 * - Publication Title Similarity: 25%
 * - User Proposal / Bio Match: 20%
 * - Department Relevance: 10%
 * - Study Level Context: 5%
 */
function calculateWeightedMatchScore(
  prof: ProfessorProfile,
  userInterests: string,
  userProposal?: string,
  studyLevel?: string,
  userBio?: string
): { matchScore: number; matchFit: 'Strong' | 'Moderate' | 'Limited' | 'Insufficient research data'; matchingTopics: string[]; matchReason: string; matchEvidence: string[] } {
  const targetTokens = userInterests.toLowerCase().split(/[\s,;]+/).filter(Boolean);
  const proposalTokens = (userProposal || userBio || '').toLowerCase().split(/[\s,;]+/).filter(Boolean);

  // 1. Topic Overlap (40%)
  const profTopics = prof.researchInterests.map((t) => t.toLowerCase());
  const matchingTopics = prof.researchInterests.filter((t) =>
    targetTokens.some((tok) => t.toLowerCase().includes(tok) || tok.includes(t.toLowerCase()))
  );
  const topicScore = profTopics.length > 0 ? (matchingTopics.length / profTopics.length) * 40 : 20;

  // 2. Publication Similarity (25%)
  const matchingPubs = prof.recentPublications.filter((pub) =>
    targetTokens.some((tok) => pub.title.toLowerCase().includes(tok))
  );
  const pubScore = prof.recentPublications.length > 0
    ? (matchingPubs.length / Math.max(prof.recentPublications.length, 1)) * 25
    : 10;

  // 3. Proposal / Bio Match (20%)
  let proposalScore = 10;
  if (proposalTokens.length > 0 && prof.recentPublications.length > 0) {
    const pubText = prof.recentPublications.map((p) => p.title.toLowerCase()).join(' ');
    const overlapCount = proposalTokens.filter((tok) => tok.length > 3 && pubText.includes(tok)).length;
    proposalScore = Math.min(20, (overlapCount / Math.max(proposalTokens.length, 1)) * 40 + 8);
  }

  // 4. Department Relevance (10%)
  const deptScore = prof.department && targetTokens.some((tok) => prof.department!.toLowerCase().includes(tok)) ? 10 : 6;

  // 5. Study Level Context (5%)
  const studyScore = studyLevel ? 5 : 3;

  const rawScore = Math.round(topicScore + pubScore + proposalScore + deptScore + studyScore);
  const matchScore = Math.min(98, Math.max(52, rawScore));

  let matchFit: 'Strong' | 'Moderate' | 'Limited' | 'Insufficient research data' = 'Moderate';
  if (matchScore >= 82) matchFit = 'Strong';
  else if (matchScore <= 60) matchFit = 'Limited';

  const matchEvidence = matchingPubs.length > 0
    ? matchingPubs.map((p) => p.title).slice(0, 2)
    : prof.recentPublications.map((p) => p.title).slice(0, 2);

  const matchReason = matchEvidence.length > 0
    ? `Strong match because the researcher has verified publications in "${matchEvidence[0]}", which directly overlap with your stated research focus in ${userInterests}.`
    : `Aligned with faculty research tracks in ${prof.researchInterests.slice(0, 2).join(', ')} at ${prof.university}.`;

  return {
    matchScore,
    matchFit,
    matchingTopics: matchingTopics.length > 0 ? matchingTopics : prof.researchInterests.slice(0, 3),
    matchReason,
    matchEvidence,
  };
}

export async function rankAndExplainMatches(
  professors: ProfessorProfile[],
  userInterests: string,
  userProposal?: string,
  studyLevel?: string,
  userBio?: string
): Promise<ProfessorProfile[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || professors.length === 0) {
    return professors.map((p) => {
      const calc = calculateWeightedMatchScore(p, userInterests, userProposal, studyLevel, userBio);
      return {
        ...p,
        ...calc,
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
      const calc = calculateWeightedMatchScore(prof, userInterests, userProposal, studyLevel, userBio);
      return {
        ...prof,
        matchScore: matchData?.matchScore ?? calc.matchScore,
        matchFit: matchData?.matchFit ?? calc.matchFit,
        matchingTopics: matchData?.matchingTopics ?? calc.matchingTopics,
        matchReason: matchData?.matchReason ?? calc.matchReason,
        matchEvidence: matchData?.matchEvidence ?? calc.matchEvidence,
      };
    });

    // Rank highest score first
    return enriched.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } catch (err) {
    console.error('Gemini AI matching error:', err);
    return professors.map((p) => {
      const calc = calculateWeightedMatchScore(p, userInterests, userProposal, studyLevel, userBio);
      return {
        ...p,
        ...calc,
      };
    });
  }
}
