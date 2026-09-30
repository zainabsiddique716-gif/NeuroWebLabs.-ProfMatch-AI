// lib/academic-api.ts
import { ProfessorProfile, SearchPipelineResult } from '@/types/academic';
import { executeInstitutionPipeline } from '@/lib/institution-pipeline';
import { searchSemanticScholarAuthors } from '@/lib/semanticscholar';
import { SUPPORTED_COUNTRIES } from '@/lib/countries';

export async function executeMultiSourceDiscovery(params: {
  countryCode: string;
  universityId?: string;
  universityName?: string;
  domainCategory?: string;
  selectedTopics?: string[];
  customInterest?: string;
}): Promise<SearchPipelineResult> {
  const { countryCode, universityId, universityName, selectedTopics = [], customInterest } = params;

  const countryObj = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode.toUpperCase());
  const countryName = countryObj ? countryObj.name : countryCode.toUpperCase();

  const sourcesSearched: string[] = [];

  // STEP 1: Institution-First OpenAlex Works & Authors Pipeline
  sourcesSearched.push('OpenAlex Institution-Scoped Works Pipeline');
  const pipelineResult = await executeInstitutionPipeline({
    countryCode,
    universityInput: universityName !== 'all' ? universityName : universityId,
    selectedTopics,
    customInterest,
    domainCategory: params.domainCategory,
  });

  let professors: ProfessorProfile[] = pipelineResult.professors;

  // STEP 2: Secondary Fallback to Semantic Scholar Graph API if < 5 professors discovered
  if (professors.length < 5) {
    sourcesSearched.push('Semantic Scholar Graph API');
    const primaryTopic = customInterest || selectedTopics[0] || params.domainCategory || 'Academic Research';
    const s2Professors = await searchSemanticScholarAuthors({
      countryCode,
      countryName,
      topic: primaryTopic,
      universityName: universityName !== 'all' ? universityName : undefined,
    });

    const existingNames = new Set(professors.map((p) => p.name.toLowerCase().trim()));
    const newS2Results = s2Professors.filter((p) => !existingNames.has(p.name.toLowerCase().trim()));
    professors = [...professors, ...newS2Results];
  }

  // Deduplicate results
  const uniqueProfessors = Array.from(
    new Map(professors.map((p) => [p.name.toLowerCase().trim(), p])).values()
  );

  const totalUniversities = new Set(uniqueProfessors.map((p) => p.university)).size;

  return {
    professors: uniqueProfessors,
    sourcesSearched,
    totalUniversities,
    totalProfessors: uniqueProfessors.length,
    debugInfo: pipelineResult.debugInfo,
    searchParamsUsed: {
      country: countryName,
      domain: params.domainCategory,
      topics: selectedTopics,
      customInterest,
      university: universityName,
    },
  };
}
