// lib/institution-pipeline.ts
import { ProfessorProfile } from '@/types/academic';
import { resolveUniversityAlias } from '@/lib/normalization';
import { SUPPORTED_COUNTRIES } from '@/lib/countries';

const OPENALEX_BASE_URL = 'https://api.openalex.org';

function getHeaders() {
  const mailto = process.env.OPENALEX_MAILTO || 'researcher@profmatch.ai';
  return {
    'User-Agent': `ProfMatchAI/2.0 (mailto:${mailto})`,
  };
}

export interface PipelineDebugInfo {
  country: string;
  countryCode: string;
  universityInput: string;
  resolvedInstitutionId?: string;
  resolvedInstitutionName: string;
  researchQuery: string;
  openAlexInstitutionsFound: number;
  openAlexWorksFound: number;
  authorsExtracted: number;
  facultyVerified: number;
  finalMatchedResearchers: number;
  executionTimeMs: number;
}

export interface InstitutionPipelineResult {
  professors: ProfessorProfile[];
  debugInfo: PipelineDebugInfo;
}

/**
 * Institution-First Academic Discovery Pipeline
 */
export async function executeInstitutionPipeline(params: {
  countryCode: string;
  universityInput?: string;
  selectedTopics?: string[];
  customInterest?: string;
  domainCategory?: string;
}): Promise<InstitutionPipelineResult> {
  const startTime = Date.now();
  const { countryCode, universityInput = 'all', selectedTopics = [], customInterest, domainCategory } = params;

  const countryObj = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode.toUpperCase());
  const countryName = countryObj ? countryObj.name : countryCode.toUpperCase();

  // Combine research topic keywords for work search
  const topicQueries = [...selectedTopics];
  if (customInterest && customInterest.trim().length > 0) {
    topicQueries.unshift(customInterest.trim());
  }

  const primaryTopic = topicQueries[0] || domainCategory || 'Academic Research';

  // STEP 1 & 2: Resolve University & OpenAlex Institution ID
  let resolvedInst = resolveUniversityAlias(universityInput, countryCode);
  let openAlexInstId = resolvedInst.openAlexId;
  let resolvedInstName = resolvedInst.canonicalName;
  let institutionsFound = 0;

  if (!openAlexInstId && universityInput && universityInput !== 'all') {
    try {
      const instUrl = `${OPENALEX_BASE_URL}/institutions?filter=country_code:${countryCode.toUpperCase()}&search=${encodeURIComponent(
        universityInput
      )}`;
      const instRes = await fetch(instUrl, { headers: getHeaders() });
      if (instRes.ok) {
        const instData = await instRes.json();
        const results = instData.results || [];
        institutionsFound = results.length;
        if (results.length > 0) {
          openAlexInstId = results[0].id.replace('https://openalex.org/', '');
          resolvedInstName = results[0].display_name;
        }
      }
    } catch (err) {
      console.warn('Institution resolution API warning:', err);
    }
  } else if (openAlexInstId) {
    institutionsFound = 1;
  }

  // STEP 3: Query Academic Works Scoped to Institution or Country
  let worksFilter = openAlexInstId
    ? `institutions.id:${openAlexInstId}`
    : `institutions.country_code:${countryCode.toUpperCase()}`;

  let works: any[] = [];
  let totalWorksFound = 0;

  try {
    const worksUrl = `${OPENALEX_BASE_URL}/works?filter=${worksFilter}&search=${encodeURIComponent(
      primaryTopic
    )}&per-page=40&sort=cited_by_count:desc`;
    const worksRes = await fetch(worksUrl, { headers: getHeaders(), cache: 'no-store' });
    if (worksRes.ok) {
      const worksData = await worksRes.json();
      works = worksData.results || [];
      totalWorksFound = worksData.meta?.count || works.length;
    }
  } catch (err) {
    console.error('Works fetch error:', err);
  }

  // Fallback: If primary topic returned < 5 works, query institution works sorted by citation count
  if (works.length < 5) {
    try {
      const fallbackWorksUrl = `${OPENALEX_BASE_URL}/works?filter=${worksFilter}&per-page=40&sort=cited_by_count:desc`;
      const fallbackRes = await fetch(fallbackWorksUrl, { headers: getHeaders(), cache: 'no-store' });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const fallbackWorks = fallbackData.results || [];
        works = [...works, ...fallbackWorks];
        totalWorksFound += fallbackData.meta?.count || 0;
      }
    } catch (err) {
      console.error('Fallback works fetch error:', err);
    }
  }

  // STEP 4 & 5: Extract Authors from Scoped Works & Verify Affiliation
  const authorMap = new Map<string, {
    id: string;
    name: string;
    institution: string;
    country: string;
    papers: Array<{ id: string; title: string; year?: number; citedByCount?: number }>;
    totalCitations: number;
    isVerified: boolean;
  }>();

  for (const w of works) {
    const authorships = w.authorships || [];
    for (const a of authorships) {
      if (!a.author || !a.author.id) continue;

      const authorId = a.author.id.replace('https://openalex.org/', '');
      const authorName = a.author.display_name;
      const instAffils = a.institutions || [];

      // Verify that author belongs to target institution / country
      const matchedInst = instAffils.find((i: any) =>
        openAlexInstId ? i.id?.includes(openAlexInstId) : i.country_code === countryCode.toUpperCase()
      );

      const isVerified = Boolean(matchedInst) || instAffils.length === 0;
      const primaryInstName = matchedInst?.display_name || instAffils[0]?.display_name || resolvedInstName;

      if (!authorMap.has(authorId)) {
        authorMap.set(authorId, {
          id: authorId,
          name: authorName,
          institution: primaryInstName,
          country: countryName,
          papers: [],
          totalCitations: 0,
          isVerified,
        });
      }

      const entry = authorMap.get(authorId)!;
      // Deduplicate papers for this author
      if (!entry.papers.some((p) => p.title === w.title)) {
        entry.papers.push({
          id: w.id,
          title: w.title,
          year: w.publication_year,
          citedByCount: w.cited_by_count,
        });
        entry.totalCitations += w.cited_by_count || 0;
      }
    }
  }

  const extractedList = Array.from(authorMap.values());
  const verifiedList = extractedList.filter((a) => a.isVerified);

  // Sort candidates by paper relevance count & citation count
  const rankedCandidates = (verifiedList.length > 0 ? verifiedList : extractedList)
    .sort((a, b) => b.papers.length - a.papers.length || b.totalCitations - a.totalCitations)
    .slice(0, 20);

  // STEP 6: Map to Normalized ProfessorProfile objects
  const professors: ProfessorProfile[] = rankedCandidates.map((candidate) => ({
    id: candidate.id,
    name: candidate.name,
    title: candidate.totalCitations > 250 ? 'Senior Faculty Researcher' : 'Faculty Researcher',
    university: candidate.institution,
    universityId: openAlexInstId || 'INST_REF',
    country: candidate.country,
    countryCode: countryCode.toUpperCase(),
    department: primaryTopic ? `${primaryTopic} Division` : 'Academic Faculty',
    researchInterests: topicQueries.length > 0 ? topicQueries.slice(0, 4) : ['Academic Research'],
    recentPublications: candidate.papers.slice(0, 4),
    citationCount: candidate.totalCitations,
    profileUrl: `https://openalex.org/A${candidate.id}`,
    scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(candidate.name)}`,
    emailStatus: 'Email not publicly available',
    dataSource: 'OpenAlex',
    fundingSignal: candidate.papers.length > 2 ? 'Active Research Group' : 'Recent Publications',
  }));

  const debugInfo: PipelineDebugInfo = {
    country: countryName,
    countryCode: countryCode.toUpperCase(),
    universityInput,
    resolvedInstitutionId: openAlexInstId,
    resolvedInstitutionName: resolvedInstName,
    researchQuery: primaryTopic,
    openAlexInstitutionsFound: institutionsFound,
    openAlexWorksFound: totalWorksFound,
    authorsExtracted: extractedList.length,
    facultyVerified: verifiedList.length,
    finalMatchedResearchers: professors.length,
    executionTimeMs: Date.now() - startTime,
  };

  return { professors, debugInfo };
}
