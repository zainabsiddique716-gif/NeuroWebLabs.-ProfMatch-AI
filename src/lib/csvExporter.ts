import { Professor } from './types';

export function exportProfessorsToCSV(professors: Professor[], filename = 'matched_professors.csv') {
  if (typeof window === 'undefined') return;

  const headers = [
    'Alignment Score (%)',
    'Professor Name',
    'University',
    'University Rank',
    'Department',
    'Country',
    'Email Address',
    'Email Verified',
    'Funding Status',
    'Accepting Students',
    'Research Areas',
    'Top Paper Title',
    'Top Paper Citations',
    'AI Justification',
    'Profile URL'
  ];

  const rows = professors.map(prof => [
    `${prof.alignmentScore || 0}%`,
    `"${prof.name.replace(/"/g, '""')}"`,
    `"${prof.university.replace(/"/g, '""')}"`,
    prof.universityRank || 'N/A',
    `"${prof.department.replace(/"/g, '""')}"`,
    `"${prof.country.replace(/"/g, '""')}"`,
    prof.email,
    prof.emailVerified ? 'Yes' : 'No',
    prof.fundingStatus,
    prof.acceptingStudents ? 'Yes' : 'No',
    `"${prof.researchAreas.join(', ').replace(/"/g, '""')}"`,
    `"${(prof.recentPublications[0]?.title || '').replace(/"/g, '""')}"`,
    prof.recentPublications[0]?.citations || 0,
    `"${(prof.alignmentJustification || '').replace(/"/g, '""')}"`,
    prof.profileUrl || ''
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
