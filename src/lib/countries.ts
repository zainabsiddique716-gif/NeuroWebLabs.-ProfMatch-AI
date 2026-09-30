// lib/countries.ts
import { UniversityOption } from '@/types/academic';

export interface CountryItem {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  flag: string;
}

export const SUPPORTED_COUNTRIES: CountryItem[] = [
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
];

/**
 * Top universities fallback directory to guarantee fast UI populating
 */
export const COUNTRY_UNIVERSITIES_FALLBACK: Record<string, UniversityOption[]> = {
  PK: [
    { id: 'I95457486', name: 'National University of Sciences and Technology', displayName: 'National University of Sciences & Technology (NUST)', city: 'Islamabad', countryCode: 'PK' },
    { id: 'I158487737', name: 'Lahore University of Management Sciences', displayName: 'Lahore University of Management Sciences (LUMS)', city: 'Lahore', countryCode: 'PK' },
    { id: 'I123795552', name: 'National University of Computer and Emerging Sciences', displayName: 'FAST-NUCES (National University of Computer & Emerging Sciences)', city: 'Islamabad', countryCode: 'PK' },
    { id: 'I887064364', name: 'COMSATS University Islamabad', displayName: 'COMSATS University Islamabad (CUI)', city: 'Islamabad', countryCode: 'PK' },
    { id: 'I189447475', name: 'Quaid-i-Azam University', displayName: 'Quaid-i-Azam University (QAU)', city: 'Islamabad', countryCode: 'PK' },
    { id: 'I137452391', name: 'University of Engineering and Technology, Lahore', displayName: 'UET Lahore (University of Engineering & Technology)', city: 'Lahore', countryCode: 'PK' },
    { id: 'I905663677', name: 'Ghulam Ishaq Khan Institute', displayName: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (GIKI)', city: 'Topi', countryCode: 'PK' },
    { id: 'I4210091386', name: 'Pakistan Institute of Engineering and Applied Sciences', displayName: 'PIEAS (Pakistan Institute of Engineering & Applied Sciences)', city: 'Islamabad', countryCode: 'PK' },
    { id: 'I87994464', name: 'University of the Punjab', displayName: 'University of the Punjab', city: 'Lahore', countryCode: 'PK' },
    { id: 'I72719266', name: 'Aga Khan University', displayName: 'Aga Khan University', city: 'Karachi', countryCode: 'PK' },
  ],
  US: [
    { id: 'I63966007', name: 'Massachusetts Institute of Technology', displayName: 'Massachusetts Institute of Technology (MIT)', city: 'Cambridge', countryCode: 'US' },
    { id: 'I97018004', name: 'Stanford University', displayName: 'Stanford University', city: 'Stanford', countryCode: 'US' },
    { id: 'I136199984', name: 'Harvard University', displayName: 'Harvard University', city: 'Cambridge', countryCode: 'US' },
    { id: 'I95457486', name: 'University of California, Berkeley', displayName: 'University of California, Berkeley (UC Berkeley)', city: 'Berkeley', countryCode: 'US' },
    { id: 'I74801974', name: 'Carnegie Mellon University', displayName: 'Carnegie Mellon University (CMU)', city: 'Pittsburgh', countryCode: 'US' },
  ],
  GB: [
    { id: 'I40120149', name: 'University of Oxford', displayName: 'University of Oxford', city: 'Oxford', countryCode: 'GB' },
    { id: 'I241749', name: 'University of Cambridge', displayName: 'University of Cambridge', city: 'Cambridge', countryCode: 'GB' },
    { id: 'I4210137308', name: 'Imperial College London', displayName: 'Imperial College London', city: 'London', countryCode: 'GB' },
    { id: 'I45129253', name: 'University College London', displayName: 'University College London (UCL)', city: 'London', countryCode: 'GB' },
  ],
};
