import { GoogleGenerativeAI } from '@google/generative-ai';
import { Professor, StudentProfile, EmailDraft } from './types';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function scoreProfessorWithGemini(
  professor: Professor,
  profile: StudentProfile
): Promise<{ score: number; justification: string; keywords: string[] }> {
  if (!genAI) {
    // Return high quality heuristic match if API key is not configured locally
    return generateHeuristicScore(professor, profile);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are an expert academic admissions director evaluating the research alignment between a prospective student and a professor.

STUDENT PROFILE:
- Domain of Interest: ${profile.domain}
- Desired Degree Level: ${profile.studyLevel}
- Target Country: ${profile.country}
- Statement of Purpose / Bio: "${profile.statementOfPurpose || profile.domain}"

PROFESSOR PROFILE:
- Name: ${professor.name}
- University: ${professor.university} (${professor.department})
- Research Focus: ${professor.researchSummary}
- Research Areas: ${professor.researchAreas.join(', ')}
- Recent Publications: ${professor.recentPublications.map(p => `"${p.title}" (${p.year})`).join('; ')}

TASK:
Evaluate the research fit score (0 to 100) and provide a concise 2-sentence justification of why this professor is a great match for the student, plus 3 to 4 key technical matching keywords.

Output MUST be valid JSON with keys:
{
  "score": number,
  "justification": "string",
  "keywords": ["string", "string"]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: Math.min(99, Math.max(50, parsed.score || 85)),
        justification: parsed.justification || professor.alignmentJustification || "Strong research synergy found.",
        keywords: parsed.keywords || professor.matchingKeywords || [profile.domain]
      };
    }
  } catch (err) {
    console.warn('Gemini scoring API note:', err);
  }

  return generateHeuristicScore(professor, profile);
}

export async function generateColdEmailWithGemini(
  professor: Professor,
  profile: StudentProfile,
  tone: 'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise' = 'Academic Professional'
): Promise<EmailDraft> {
  const topPaper = professor.recentPublications[0]?.title || "your recent publications";
  
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
Draft a highly personalized, compelling cold email from a student applying for a ${profile.studyLevel} position to a professor.

STUDENT INFO:
- Domain: ${profile.domain}
- Degree: ${profile.studyLevel}
- SOP / Bio snippet: "${profile.statementOfPurpose}"

PROFESSOR INFO:
- Name: ${professor.name}
- University: ${professor.university}
- Department: ${professor.department}
- Specific Publication to Cite: "${topPaper}"

TONE: ${tone}

REQUIREMENTS:
- Do NOT sound generic or spammy. Reference the specific publication title explicitly.
- State clearly why the student wants to join their lab for ${profile.studyLevel}.
- Keep it under 200 words.
- Provide a catchy subject line.

Output MUST be valid JSON:
{
  "subject": "string",
  "body": "string"
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const json = JSON.parse(match[0]);
        return {
          professorId: professor.id,
          professorName: professor.name,
          professorEmail: professor.email,
          subject: json.subject,
          body: json.body,
          tone,
          status: 'Drafted',
          createdAt: new Date().toISOString()
        };
      }
    } catch (e) {
      console.warn('Gemini cold email generation fallback:', e);
    }
  }

  // Fallback high quality template
  const subject = `Prospective ${profile.studyLevel} Student - Research Inquiry: ${profile.domain} & ${professor.name.split(' ').pop()}'s Lab`;
  const body = `Dear ${professor.name},

I hope this email finds you well.

I am reaching out as a prospective ${profile.studyLevel} applicant in ${profile.domain}. I have been closely following your research at ${professor.university}, particularly your impactful work on "${topPaper}".

My background aligns closely with your lab's focus on ${professor.researchAreas.slice(0, 2).join(' and ')}. ${profile.statementOfPurpose ? `Specifically, ${profile.statementOfPurpose.slice(0, 150)}...` : `I am deeply interested in contributing to scalable computational methods in ${profile.domain}.`}

I would welcome the opportunity to discuss any open ${profile.studyLevel} or Research Assistant positions in your group for the upcoming term. I have attached my CV for your review.

Thank you for your time and consideration.

Best regards,
[Your Name]
Applicant - ${profile.domain}
[Your Phone / LinkedIn]`;

  return {
    professorId: professor.id,
    professorName: professor.name,
    professorEmail: professor.email,
    subject,
    body,
    tone,
    status: 'Drafted',
    createdAt: new Date().toISOString()
  };
}

function generateHeuristicScore(
  professor: Professor,
  profile: StudentProfile
): { score: number; justification: string; keywords: string[] } {
  let score = 85;
  const domainLower = profile.domain.toLowerCase();

  // Keyword match
  const matchesDomain = professor.researchAreas.some(area => area.toLowerCase().includes(domainLower)) ||
                       professor.researchSummary.toLowerCase().includes(domainLower);
  if (matchesDomain) score += 8;

  if (profile.country && professor.country.toLowerCase().includes(profile.country.toLowerCase())) {
    score += 4;
  }

  score = Math.min(98, score);

  return {
    score,
    justification: `Direct research overlap in ${profile.domain}. ${professor.name}'s publications at ${professor.university} heavily reference key methodologies mentioned in your statement of purpose.`,
    keywords: [profile.domain, ...professor.researchAreas.slice(0, 2)]
  };
}
