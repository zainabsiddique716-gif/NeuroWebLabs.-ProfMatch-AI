export interface Publication {
  title: string;
  year: number;
  citations: number;
  journalOrVenue: string;
  url?: string;
  abstractSnippet?: string;
}

export interface Professor {
  id: string;
  name: string;
  title: string;
  university: string;
  universityRank?: number;
  department: string;
  country: string;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string;
  profileUrl?: string;
  googleScholarUrl?: string;
  researchSummary: string;
  researchAreas: string[];
  fundingStatus: 'Active Grants' | 'High Sponsorship' | 'Moderate' | 'Unknown';
  acceptingStudents: boolean;
  recentPublications: Publication[];
  alignmentScore?: number; // 0 to 100
  alignmentJustification?: string;
  matchingKeywords?: string[];
}

export interface StudentProfile {
  domain: string;
  country: string;
  studyLevel: 'PhD' | 'Master / MS' | 'Research Assistant' | 'Postdoc';
  statementOfPurpose: string;
  cvText?: string;
  resumeFileName?: string;
}

export interface DiscoveryRequest {
  domain: string;
  country: string;
  studyLevel: string;
  statementOfPurpose: string;
}

export interface DiscoveryResult {
  professors: Professor[];
  totalUniversities: number;
  totalProfessors: number;
  timestamp: string;
}

export interface EmailDraft {
  professorId: string;
  professorName: string;
  professorEmail: string;
  subject: string;
  body: string;
  tone: 'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise';
  status: 'Drafted' | 'Scheduled' | 'Sent' | 'Opened' | 'Replied';
  createdAt: string;
}

export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  country: string;
  coverage: string; // e.g. "Full Tuition + $2,500/mo Stipend"
  degreeLevel: string[];
  eligibleDomains: string[];
  deadline: string;
  applicationUrl: string;
  matchScore: number;
  description: string;
}
