// types/academic.ts
import { PipelineDebugInfo } from '@/lib/institution-pipeline';

export interface UniversityOption {
  id: string;
  name: string;
  displayName: string;
  city?: string;
  countryCode: string;
  worksCount?: number;
  rorId?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  year?: number;
  doi?: string;
  citedByCount?: number;
  venue?: string;
  url?: string;
}

export interface ProfessorProfile {
  id: string;
  name: string;
  title: string;
  university: string;
  universityId: string;
  country: string;
  countryCode: string;
  department?: string;
  researchInterests: string[];
  recentPublications: PublicationItem[];
  citationCount: number;
  hIndex?: number;
  profileUrl: string;
  scholarUrl?: string;
  imageUrl?: string;
  email?: string;
  emailStatus: 'Verified Email' | 'Publicly Listed' | 'Email not publicly available';
  dataSource: 'OpenAlex' | 'Semantic Scholar' | 'University Faculty Directory';
  matchScore?: number;
  matchFit?: 'Strong' | 'Moderate' | 'Limited' | 'Insufficient research data';
  matchingTopics?: string[];
  matchReason?: string;
  matchEvidence?: string[];
  fundingSignal?: 'Active Research Group' | 'Recent Publications' | 'Funding information unavailable';
}

export interface SearchFilters {
  countryCode: string;
  universityId?: string;
  domainCategory?: string;
  selectedTopics: string[];
  customInterest?: string;
  studyLevel?: string;
  userBio?: string;
  cvText?: string;
}

export interface SearchPipelineResult {
  professors: ProfessorProfile[];
  sourcesSearched: string[];
  totalUniversities: number;
  totalProfessors: number;
  debugInfo?: PipelineDebugInfo;
  searchParamsUsed: {
    country: string;
    domain?: string;
    topics?: string[];
    customInterest?: string;
    university?: string;
  };
}
