// lib/normalization.ts

export interface UniversityAliasMap {
  canonicalName: string;
  countryCode: string;
  openAlexId?: string;
  aliases: string[];
}

export const KNOWN_UNIVERSITIES: UniversityAliasMap[] = [
  // PAKISTAN
  {
    canonicalName: 'National University of Sciences and Technology',
    countryCode: 'PK',
    openAlexId: 'I95457486',
    aliases: ['NUST', 'National University of Sciences & Technology', 'NUST Islamabad'],
  },
  {
    canonicalName: 'Lahore University of Management Sciences',
    countryCode: 'PK',
    openAlexId: 'I158487737',
    aliases: ['LUMS', 'Lahore University of Management Sciences'],
  },
  {
    canonicalName: 'National University of Computer and Emerging Sciences',
    countryCode: 'PK',
    openAlexId: 'I123795552',
    aliases: ['FAST', 'FAST-NUCES', 'FAST NUCES', 'NUCES'],
  },
  {
    canonicalName: 'COMSATS University Islamabad',
    countryCode: 'PK',
    openAlexId: 'I887064364',
    aliases: ['COMSATS', 'CUI', 'COMSATS Islamabad'],
  },
  {
    canonicalName: 'Quaid-i-Azam University',
    countryCode: 'PK',
    openAlexId: 'I189447475',
    aliases: ['QAU', 'Quaid-e-Azam University', 'Quaid i Azam University'],
  },
  {
    canonicalName: 'University of Engineering and Technology, Lahore',
    countryCode: 'PK',
    openAlexId: 'I137452391',
    aliases: ['UET Lahore', 'UET', 'University of Engineering & Technology Lahore'],
  },
  {
    canonicalName: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    countryCode: 'PK',
    openAlexId: 'I905663677',
    aliases: ['GIKI', 'GIK Institute', 'Ghulam Ishaq Khan Institute'],
  },
  {
    canonicalName: 'Pakistan Institute of Engineering and Applied Sciences',
    countryCode: 'PK',
    openAlexId: 'I4210091386',
    aliases: ['PIEAS', 'Pakistan Institute of Engineering & Applied Sciences'],
  },
  {
    canonicalName: 'University of the Punjab',
    countryCode: 'PK',
    openAlexId: 'I87994464',
    aliases: ['Punjab University', 'PU', 'University of Punjab'],
  },
  {
    canonicalName: 'Aga Khan University',
    countryCode: 'PK',
    openAlexId: 'I72719266',
    aliases: ['AKU', 'Aga Khan'],
  },

  // INDIA
  {
    canonicalName: 'Indian Institute of Technology Bombay',
    countryCode: 'IN',
    openAlexId: 'I58330752',
    aliases: ['IIT Bombay', 'IITB', 'IIT-B'],
  },
  {
    canonicalName: 'Indian Institute of Technology Delhi',
    countryCode: 'IN',
    openAlexId: 'I84884186',
    aliases: ['IIT Delhi', 'IITD', 'IIT-D'],
  },
  {
    canonicalName: 'Indian Institute of Technology Madras',
    countryCode: 'IN',
    openAlexId: 'I4210137532',
    aliases: ['IIT Madras', 'IITM', 'IIT-M'],
  },
  {
    canonicalName: 'Indian Institute of Science',
    countryCode: 'IN',
    openAlexId: 'I68510842',
    aliases: ['IISc', 'IISc Bangalore', 'Indian Institute of Science Bangalore'],
  },
  {
    canonicalName: 'Indian Institute of Technology Kanpur',
    countryCode: 'IN',
    openAlexId: 'I188210340',
    aliases: ['IIT Kanpur', 'IITK', 'IIT-K'],
  },
  {
    canonicalName: 'Indian Institute of Technology Kharagpur',
    countryCode: 'IN',
    openAlexId: 'I12555546',
    aliases: ['IIT Kharagpur', 'IITKGP', 'IIT-KGP'],
  },

  // CHINA
  {
    canonicalName: 'Tsinghua University',
    countryCode: 'CN',
    openAlexId: 'I19820366',
    aliases: ['Tsinghua', 'THU'],
  },
  {
    canonicalName: 'Peking University',
    countryCode: 'CN',
    openAlexId: 'I202381698',
    aliases: ['Peking', 'PKU'],
  },
  {
    canonicalName: 'Zhejiang University',
    countryCode: 'CN',
    openAlexId: 'I74825502',
    aliases: ['ZJU', 'Zhejiang'],
  },
  {
    canonicalName: 'Shanghai Jiao Tong University',
    countryCode: 'CN',
    openAlexId: 'I70935105',
    aliases: ['SJTU', 'Shanghai Jiao Tong'],
  },
  {
    canonicalName: 'University of Science and Technology of China',
    countryCode: 'CN',
    openAlexId: 'I126871920',
    aliases: ['USTC'],
  },

  // JAPAN
  {
    canonicalName: 'The University of Tokyo',
    countryCode: 'JP',
    openAlexId: 'I74801974',
    aliases: ['University of Tokyo', 'UTokyo', 'Todai'],
  },
  {
    canonicalName: 'Kyoto University',
    countryCode: 'JP',
    openAlexId: 'I124707621',
    aliases: ['Kyodai'],
  },
  {
    canonicalName: 'Osaka University',
    countryCode: 'JP',
    openAlexId: 'I102282034',
    aliases: ['Handai'],
  },
  {
    canonicalName: 'Tokyo Institute of Technology',
    countryCode: 'JP',
    openAlexId: 'I161296585',
    aliases: ['Tokyo Tech', 'Institute of Science Tokyo'],
  },

  // SOUTH KOREA
  {
    canonicalName: 'Korea Advanced Institute of Science and Technology',
    countryCode: 'KR',
    openAlexId: 'I114030678',
    aliases: ['KAIST'],
  },
  {
    canonicalName: 'Seoul National University',
    countryCode: 'KR',
    openAlexId: 'I138006243',
    aliases: ['SNU', 'Seoul National'],
  },
  {
    canonicalName: 'Pohang University of Science and Technology',
    countryCode: 'KR',
    openAlexId: 'I184964149',
    aliases: ['POSTECH'],
  },
  {
    canonicalName: 'Yonsei University',
    countryCode: 'KR',
    openAlexId: 'I117565747',
    aliases: ['Yonsei'],
  },
  {
    canonicalName: 'Korea University',
    countryCode: 'KR',
    openAlexId: 'I191280031',
    aliases: ['Korea University'],
  },

  // SINGAPORE
  {
    canonicalName: 'National University of Singapore',
    countryCode: 'SG',
    openAlexId: 'I165779595',
    aliases: ['NUS'],
  },
  {
    canonicalName: 'Nanyang Technological University',
    countryCode: 'SG',
    openAlexId: 'I172845890',
    aliases: ['NTU'],
  },

  // MALAYSIA
  {
    canonicalName: 'University of Malaya',
    countryCode: 'MY',
    openAlexId: 'I78964722',
    aliases: ['Universiti Malaya', 'UM'],
  },
  {
    canonicalName: 'Universiti Teknologi Malaysia',
    countryCode: 'MY',
    openAlexId: 'I73796582',
    aliases: ['UTM'],
  },
  {
    canonicalName: 'Universiti Putra Malaysia',
    countryCode: 'MY',
    openAlexId: 'I150616147',
    aliases: ['UPM'],
  },

  // HONG KONG
  {
    canonicalName: 'The University of Hong Kong',
    countryCode: 'HK',
    openAlexId: 'I889378344',
    aliases: ['University of Hong Kong', 'HKU'],
  },
  {
    canonicalName: 'The Hong Kong University of Science and Technology',
    countryCode: 'HK',
    openAlexId: 'I200895076',
    aliases: ['HKUST'],
  },
  {
    canonicalName: 'The Chinese University of Hong Kong',
    countryCode: 'HK',
    openAlexId: 'I184566092',
    aliases: ['CUHK'],
  },
];

/**
 * Resolve user query or university ID to canonical name and OpenAlex ID
 */
export function resolveUniversityAlias(
  query: string,
  countryCode: string
): { canonicalName: string; openAlexId?: string; countryCode: string } {
  if (!query || query === 'all') {
    return { canonicalName: 'All Universities', countryCode: countryCode.toUpperCase() };
  }

  const cleanQuery = query.trim().toLowerCase();
  const countryUpper = countryCode.toUpperCase();

  // 1. Direct ID match
  if (query.startsWith('I') && query.length > 5) {
    const foundById = KNOWN_UNIVERSITIES.find((u) => u.openAlexId === query);
    if (foundById) {
      return {
        canonicalName: foundById.canonicalName,
        openAlexId: foundById.openAlexId,
        countryCode: foundById.countryCode,
      };
    }
    return { canonicalName: query, openAlexId: query, countryCode: countryUpper };
  }

  // 2. Alias / Canonical name match
  const match = KNOWN_UNIVERSITIES.find((u) => {
    const isCountryMatch = u.countryCode === countryUpper;
    const isNameMatch =
      u.canonicalName.toLowerCase() === cleanQuery ||
      u.aliases.some((a) => a.toLowerCase() === cleanQuery);
    return isCountryMatch && isNameMatch;
  });

  if (match) {
    return {
      canonicalName: match.canonicalName,
      openAlexId: match.openAlexId,
      countryCode: match.countryCode,
    };
  }

  // Partial substring match
  const partialMatch = KNOWN_UNIVERSITIES.find((u) => {
    const isCountryMatch = u.countryCode === countryUpper;
    const isPartial =
      u.canonicalName.toLowerCase().includes(cleanQuery) ||
      u.aliases.some((a) => a.toLowerCase().includes(cleanQuery));
    return isCountryMatch && isPartial;
  });

  if (partialMatch) {
    return {
      canonicalName: partialMatch.canonicalName,
      openAlexId: partialMatch.openAlexId,
      countryCode: partialMatch.countryCode,
    };
  }

  return { canonicalName: query, countryCode: countryUpper };
}
