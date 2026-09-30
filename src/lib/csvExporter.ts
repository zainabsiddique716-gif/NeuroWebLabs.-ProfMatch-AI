// lib/csvExporter.ts
import { ProfessorProfile } from '@/types/academic';

export function exportProfessorsToCSV(professors: ProfessorProfile[]) {
  if (!professors || professors.length === 0) return;

  const headers = [
    'Professor Name',
    'University',
    'Country',
    'Department',
    'Email Status',
    'Research Areas',
    'Recent Papers',
    'Alignment Score',
    'Match Reason',
    'Data Source',
    'Profile URL',
    'Scholar URL',
  ];

  const rows = professors.map((p) => [
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.university.replace(/"/g, '""')}"`,
    `"${p.country.replace(/"/g, '""')}"`,
    `"${p.department || ''}"`,
    `"${p.emailStatus}"`,
    `"${(p.researchInterests || []).join('; ')}"`,
    `"${(p.recentPublications || []).map((pub) => pub.title).join('; ').replace(/"/g, '""')}"`,
    `"${p.matchScore || 0}%"`,
    `"${(p.matchReason || '').replace(/"/g, '""')}"`,
    `"${p.dataSource}"`,
    `"${p.profileUrl || ''}"`,
    `"${p.scholarUrl || ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ProfMatch_AI_Results_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
