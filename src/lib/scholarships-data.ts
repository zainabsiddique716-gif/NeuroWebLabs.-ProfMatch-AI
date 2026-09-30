// lib/scholarships-data.ts

export interface ScholarshipItem {
  id: string;
  title: string;
  organization: string;
  country: string;
  countryCode: string;
  coverage: string;
  degreeLevels: ('MS' | 'PhD' | 'Postdoc' | 'Research Assistant')[];
  domains: string[];
  deadline: string;
  applicationUrl: string;
  eligibility: string;
  description: string;
}

export const SCHOLARSHIPS_DATABASE: ScholarshipItem[] = [
  {
    id: 'fulbright_us',
    title: 'Fulbright Foreign Student Program',
    organization: 'United States Department of State',
    country: 'United States',
    countryCode: 'US',
    coverage: 'Full Tuition + Monthly Living Stipend + Health Insurance + Airfare',
    degreeLevels: ['MS', 'PhD'],
    domains: ['Computer Science & AI', 'Engineering', 'Energy & Environment', 'Biomedical & Health', 'Natural Sciences', 'Business, Economics & Management', 'Social Sciences'],
    deadline: 'October 2026 / May 2027 (Varies by country)',
    applicationUrl: 'https://fulbrightonline.org/',
    eligibility: 'International students with strong academic records and leadership potential.',
    description: 'Premier merit-based scholarship enabling graduate research and degree study at accredited US universities.',
  },
  {
    id: 'chevening_uk',
    title: 'Chevening Postgraduate Scholarship',
    organization: 'UK Foreign, Commonwealth & Development Office',
    country: 'United Kingdom',
    countryCode: 'GB',
    coverage: 'Full University Tuition + Monthly Stipend + Travel Costs',
    degreeLevels: ['MS'],
    domains: ['Computer Science & AI', 'Engineering', 'Energy & Environment', 'Business, Economics & Management', 'Law & Policy', 'Social Sciences'],
    deadline: 'November 2026',
    applicationUrl: 'https://www.chevening.org/',
    eligibility: 'Requires 2+ years of work experience and an offer from a UK university.',
    description: 'Fully-funded master’s scholarship program for future global leaders studying in the UK.',
  },
  {
    id: 'daad_germany',
    title: 'DAAD Research Grants & Master Scholarships',
    organization: 'Deutscher Akademischer Austauschdienst (DAAD)',
    country: 'Germany',
    countryCode: 'DE',
    coverage: '€934-€1,200/month Stipend + Health Insurance + Travel Allowance',
    degreeLevels: ['MS', 'PhD', 'Postdoc'],
    domains: ['Computer Science & AI', 'Engineering', 'Natural Sciences', 'Biomedical & Health', 'Energy & Environment'],
    deadline: 'Rolling / November 2026',
    applicationUrl: 'https://www.daad.de/en/',
    eligibility: 'Graduates with bachelor or master degree in STEM or related disciplines.',
    description: 'Supports international doctoral students and postdocs conducting research at German universities and institutes.',
  },
  {
    id: 'mext_japan',
    title: 'MEXT Japanese Government Research Scholarship',
    organization: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT)',
    country: 'Japan',
    countryCode: 'JP',
    coverage: 'Full Tuition Waiver + ¥143,000-¥145,000/month Stipend + Roundtrip Flight',
    degreeLevels: ['MS', 'PhD'],
    domains: ['Computer Science & AI', 'Engineering', 'Natural Sciences', 'Biomedical & Health', 'Agriculture & Food'],
    deadline: 'May - June (Embassy Recommendation)',
    applicationUrl: 'https://www.mext.go.jp/en/',
    eligibility: 'Applicants under 35 years old willing to study and conduct research in Japan.',
    description: 'Comprehensive government scholarship for graduate research at top Japanese universities.',
  },
  {
    id: 'commonwealth_uk',
    title: 'Commonwealth PhD & Master’s Scholarships',
    organization: 'Commonwealth Scholarship Commission',
    country: 'United Kingdom',
    countryCode: 'GB',
    coverage: 'Full Tuition + £1,347/month Stipend + Airfare + Thesis Grant',
    degreeLevels: ['MS', 'PhD'],
    domains: ['Computer Science & AI', 'Engineering', 'Energy & Environment', 'Biomedical & Health', 'Agriculture & Food'],
    deadline: 'December 2026',
    applicationUrl: 'https://cscuk.fcdo.gov.uk/',
    eligibility: 'Citizens of Commonwealth countries applying for full-time master or doctoral study.',
    description: 'Targeted at high-achieving candidates focused on sustainable development goals in the UK.',
  },
  {
    id: 'hec_overseas_pk',
    title: 'HEC Overseas PhD Scholarships',
    organization: 'Higher Education Commission Pakistan (HEC)',
    country: 'Pakistan',
    countryCode: 'PK',
    coverage: 'Full Tuition + Monthly Allowance + Roundtrip Airfare',
    degreeLevels: ['PhD'],
    domains: ['Computer Science & AI', 'Engineering', 'Natural Sciences', 'Biomedical & Health', 'Agriculture & Food'],
    deadline: 'Announced Periodically via HEC Portal',
    applicationUrl: 'https://www.hec.gov.pk/',
    eligibility: 'Pakistani/AJ&K nationals holding 16/18 years of education with valid HAT test score.',
    description: 'Government funding for high-caliber Pakistani scholars pursuing PhD at top ranked global universities.',
  },
  {
    id: 'singa_singapore',
    title: 'Singapore International Graduate Award (SINGA)',
    organization: 'A*STAR, NTU, NUS & SUTD',
    country: 'Singapore',
    countryCode: 'SG',
    coverage: 'Full Tuition + S$2,700-S$3,200/month Stipend + Airfare + Settlement Allowance',
    degreeLevels: ['PhD'],
    domains: ['Computer Science & AI', 'Engineering', 'Biomedical & Health', 'Natural Sciences'],
    deadline: 'December 2026',
    applicationUrl: 'https://www.a-star.edu.sg/singa',
    eligibility: 'International students with passion for research and excellent academic achievements.',
    description: 'Provides 4 years of PhD research training at A*STAR research institutes, NTU, NUS, or SUTD.',
  },
  {
    id: 'kaust_fellowship_sa',
    title: 'KAUST Fellowship',
    organization: 'King Abdullah University of Science and Technology',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    coverage: 'Full Tuition + $20,000-$30,000/year Stipend + Housing + Medical Insurance',
    degreeLevels: ['MS', 'PhD'],
    domains: ['Computer Science & AI', 'Engineering', 'Energy & Environment', 'Natural Sciences', 'Biomedical & Health'],
    deadline: 'January / October Rolling',
    applicationUrl: 'https://www.kaust.edu.sa/',
    eligibility: 'Admitted graduate students to KAUST science and engineering degree programs.',
    description: 'All admitted students receive the KAUST Fellowship supporting full study and research living costs.',
  },
];
