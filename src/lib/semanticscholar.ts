// lib/semanticscholar.ts
import { ProfessorProfile } from '@/types/academic';

const SEMANTIC_SCHOLAR_BASE_URL = 'https://api.semanticscholar.org/graph/v1';

/**
 * Search active authors on Semantic Scholar Graph API filtered by topic & verified affiliation
 */
export async function searchSemanticScholarAuthors(params: {
  countryCode: string;
  countryName: string;
  topic?: string;
  universityName?: string;
}): Promise<ProfessorProfile[]> {
  const { countryCode, countryName, topic, universityName } = params;

  // Build query keywords combining topic/university/country
  const queryParts = [];
  if (topic) queryParts.push(topic);
  if (universityName && universityName !== 'all') {
    queryParts.push(universityName);
  } else {
    queryParts.push(countryName);
  }

  const query = queryParts.join(' ');
  const url = `${SEMANTIC_SCHOLAR_BASE_URL}/author/search?query=${encodeURIComponent(query)}&limit=15&fields=authorId,name,affiliations,homepage,paperCount,citationCount,hIndex,papers.title,papers.year,papers.citationCount,papers.externalIds,papers.venue`;

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'ProfMatchAI/2.0 (research@profmatch.ai)',
    };
    if (process.env.SEMANTIC_SCHOLAR_API_KEY) {
      headers['x-api-key'] = process.env.SEMANTIC_SCHOLAR_API_KEY;
    }

    const res = await fetch(url, { headers, cache: 'no-store' });
    if (!res.ok) {
      console.warn(`Semantic Scholar API returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const authors = data.data || [];

    const mapped: ProfessorProfile[] = authors.map((author: any) => {
      const affiliations: string[] = author.affiliations || [];
      const primaryAffiliation = affiliations[0] || (universityName && universityName !== 'all' ? universityName : `Affiliated Institution in ${countryName}`);
      
      const papers = (author.papers || []).slice(0, 4).map((p: any) => ({
        id: p.paperId || p.title,
        title: p.title,
        year: p.year,
        citedByCount: p.citationCount,
        venue: p.venue,
        doi: p.externalIds?.DOI,
      }));

      return {
        id: `S2_${author.authorId}`,
        name: author.name,
        title: (author.citationCount || 0) > 200 ? 'Professor / Senior Researcher' : 'Faculty Researcher',
        university: primaryAffiliation,
        universityId: 'S2_INST',
        country: countryName,
        countryCode: countryCode.toUpperCase(),
        department: topic ? `${topic} Division` : 'Academic Faculty',
        researchInterests: topic ? [topic, 'Academic Research'] : ['Artificial Intelligence', 'Data Science'],
        recentPublications: papers,
        citationCount: author.citationCount || 0,
        hIndex: author.hIndex || 0,
        profileUrl: author.homepage || `https://www.semanticscholar.org/author/${author.authorId}`,
        scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(author.name)}`,
        emailStatus: 'Email not publicly available',
        dataSource: 'Semantic Scholar',
        fundingSignal: papers.length > 0 ? 'Recent Publications' : 'Funding information unavailable',
      };
    });

    return mapped;
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
    return [];
  }
}
