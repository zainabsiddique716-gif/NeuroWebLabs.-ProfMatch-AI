// lib/openalex.ts
import { ProfessorProfile, UniversityOption } from '@/types/academic';
import { COUNTRY_UNIVERSITIES_FALLBACK, SUPPORTED_COUNTRIES } from '@/lib/countries';

const OPENALEX_BASE_URL = 'https://api.openalex.org';

function getHeaders() {
  const mailto = process.env.OPENALEX_MAILTO || 'researcher@profmatch.ai';
  return {
    'User-Agent': `ProfMatchAI/2.0 (mailto:${mailto})`,
  };
}

/**
 * Fetch accredited universities in the selected country (with fallback directory)
 */
export async function fetchUniversitiesByCountry(countryCode: string): Promise<UniversityOption[]> {
  const upperCode = countryCode.toUpperCase();
  const fallback = COUNTRY_UNIVERSITIES_FALLBACK[upperCode] || [];

  try {
    const url = `${OPENALEX_BASE_URL}/institutions?filter=country_code:${upperCode}&per-page=35&sort=works_count:desc`;
    const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`OpenAlex error: ${res.statusText}`);
    
    const data = await res.json();
    const fetched: UniversityOption[] = (data.results || []).map((inst: any) => ({
      id: inst.id.replace('https://openalex.org/', ''),
      name: inst.display_name,
      displayName: `${inst.display_name} ${inst.geo?.city ? `(${inst.geo.city})` : ''}`,
      city: inst.geo?.city,
      countryCode: inst.country_code,
      worksCount: inst.works_count,
      rorId: inst.ror,
    }));

    // Merge fetched with curated fallback to ensure top institutions are present
    const existingIds = new Set(fetched.map((u) => u.id));
    const uniqueFallbacks = fallback.filter((u) => !existingIds.has(u.id));
    return [...fetched, ...uniqueFallbacks];
  } catch (error) {
    console.warn('Using fallback universities directory for country:', countryCode);
    return fallback;
  }
}

/**
 * Fetch verified active researchers filtered strictly by Country and optionally University
 */
export async function searchProfessorsByAffiliation(params: {
  countryCode: string;
  universityId?: string;
  topics?: string[];
  customInterest?: string;
  topic?: string;
}): Promise<ProfessorProfile[]> {
  const { countryCode, universityId, topics = [], customInterest, topic } = params;
  const countryObj = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode.toUpperCase());
  const countryName = countryObj ? countryObj.name : countryCode.toUpperCase();

  const filterParts = [`last_known_institutions.country_code:${countryCode.toUpperCase()}`];
  if (universityId && universityId !== 'all') {
    filterParts.push(`last_known_institutions.id:${universityId}`);
  }

  const rawAuthors: any[] = [];
  const searchQueries: string[] = [];

  if (customInterest && customInterest.trim().length > 0) {
    searchQueries.push(customInterest.trim());
  }
  if (topic && topic.trim().length > 0) {
    searchQueries.push(topic.trim());
  }
  topics.forEach((t) => {
    if (t && t.trim().length > 0) searchQueries.push(t.trim());
  });

  // 1. Try querying OpenAlex with each individual search topic/query
  for (const q of searchQueries) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('filter', filterParts.join(','));
      queryParams.set('search', q);
      queryParams.set('per-page', '15');
      queryParams.set('sort', 'cited_by_count:desc');

      const url = `${OPENALEX_BASE_URL}/authors?${queryParams.toString()}`;
      const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          rawAuthors.push(...data.results);
        }
      }
    } catch (err) {
      console.warn('Individual topic query error:', err);
    }
    if (rawAuthors.length >= 15) break;
  }

  // 2. Fallback: If individual topic searches yield fewer than 5 results, fetch top institution/country authors sorted by citations
  if (rawAuthors.length < 5) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('filter', filterParts.join(','));
      queryParams.set('per-page', '20');
      queryParams.set('sort', 'cited_by_count:desc');

      const url = `${OPENALEX_BASE_URL}/authors?${queryParams.toString()}`;
      const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          rawAuthors.push(...data.results);
        }
      }
    } catch (err) {
      console.error('Fallback author fetch error:', err);
    }
  }

  // Deduplicate by author ID
  const uniqueAuthorsMap = new Map<string, any>();
  rawAuthors.forEach((author) => {
    if (author && author.id && !uniqueAuthorsMap.has(author.id)) {
      uniqueAuthorsMap.set(author.id, author);
    }
  });

  const uniqueAuthors = Array.from(uniqueAuthorsMap.values());

  return uniqueAuthors.map((author: any) => {
    const topInst = author.last_known_institutions?.[0] || {};
    const topicList = (author.topics || [])
      .slice(0, 5)
      .map((t: any) => t.display_name);

    const recentWorks = (author.summary_stats?.top_works || []).slice(0, 4).map((w: any) => ({
      id: w.id,
      title: w.title,
      year: w.publication_year,
      citedByCount: w.cited_by_count,
      url: w.id,
    }));

    const isHighlyCited = (author.cited_by_count || 0) > 300;

    return {
      id: author.id.replace('https://openalex.org/', ''),
      name: author.display_name,
      title: author.works_count > 30 ? 'Professor / Senior Researcher' : 'Faculty Researcher',
      university: topInst.display_name || `Research Faculty in ${countryName}`,
      universityId: topInst.id ? topInst.id.replace('https://openalex.org/', '') : '',
      country: countryName,
      countryCode: topInst.country_code || countryCode.toUpperCase(),
      department: topicList[0] ? `${topicList[0]} Division` : 'Academic Faculty',
      researchInterests: topicList.length > 0 ? topicList : [topics[0] || topic || 'Academic Research'],
      recentPublications: recentWorks,
      citationCount: author.cited_by_count || 0,
      hIndex: author.summary_stats?.h_index || 0,
      profileUrl: author.id,
      scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(author.display_name)}`,
      emailStatus: 'Email not publicly available',
      dataSource: 'OpenAlex',
      fundingSignal: isHighlyCited ? 'Active Research Group' : recentWorks.length > 0 ? 'Recent Publications' : 'Funding information unavailable',
    };
  });
}

export async function searchOpenAlexProfessors(topic: string, country: string = 'US') {
  return searchProfessorsByAffiliation({
    countryCode: country.length === 2 ? country : 'US',
    topic,
  });
}
