'use client';

import React, { useState } from 'react';
import { Professor } from '@/lib/types';
import ProfessorCard from './ProfessorCard';
import { exportProfessorsToCSV } from '@/lib/csvExporter';
import { 
  Search, 
  Download, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Sparkles, 
  Building2, 
  Award, 
  TrendingUp, 
  Mail,
  Send
} from 'lucide-react';

interface DashboardProps {
  professors: Professor[];
  domain: string;
  country: string;
  onSelectProfessor: (prof: Professor) => void;
  onDraftEmail: (prof: Professor) => void;
  onNewSearch: () => void;
}

export default function Dashboard({
  professors,
  domain,
  country,
  onSelectProfessor,
  onDraftEmail,
  onNewSearch
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'rank' | 'citations'>('score');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [minScore, setMinScore] = useState<number>(0);

  // Filter logic
  const filteredProfessors = professors.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.researchAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prof.recentPublications[0]?.title || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesScore = (prof.alignmentScore || 0) >= minScore;
    return matchesSearch && matchesScore;
  });

  // Sorting logic
  filteredProfessors.sort((a, b) => {
    if (sortBy === 'score') return (b.alignmentScore || 0) - (a.alignmentScore || 0);
    if (sortBy === 'rank') return (a.universityRank || 999) - (b.universityRank || 999);
    if (sortBy === 'citations') return (b.recentPublications[0]?.citations || 0) - (a.recentPublications[0]?.citations || 0);
    return 0;
  });

  // Calculate statistics
  const avgScore = professors.length > 0 
    ? Math.round(professors.reduce((acc, p) => acc + (p.alignmentScore || 0), 0) / professors.length) 
    : 0;
  const activeLabs = professors.filter(p => p.fundingStatus === 'High Sponsorship' || p.fundingStatus === 'Active Grants').length;
  const topUniCount = new Set(professors.map(p => p.university)).size;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#06122b] via-brand-950 to-[#102a43] p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-brand-800/60 relative overflow-hidden font-serif">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Match Results • {domain || "Computer Science"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Top Ranked Matched Faculty in {country || "Target Universities"}
          </h2>
          <p className="text-slate-300 text-sm max-w-xl">
            Ranked by LLM paper alignment score, research lab funding status, and student sponsorship availability.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 z-10 sm:min-w-[340px]">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl font-extrabold text-amber-300">{avgScore}%</span>
            <span className="block text-[10px] text-slate-300 font-medium">Avg Fit Score</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl font-extrabold text-emerald-400">{activeLabs}</span>
            <span className="block text-[10px] text-slate-300 font-medium">Active Funded Labs</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl font-extrabold text-slate-100">{topUniCount}</span>
            <span className="block text-[10px] text-slate-300 font-medium">Top Universities</span>
          </div>
        </div>

      </div>

      {/* Control Bar: Search, Filters, View Modes, Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by professor, university, paper title, or topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Min Score Filter */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Min Score:</span>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
            >
              <option value={0}>All Fits (&gt; 0%)</option>
              <option value={85}>High Fits (&gt; 85%)</option>
              <option value={90}>Ultra Fits (&gt; 90%)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
          >
            <option value="score">Sort by: Fit Score</option>
            <option value="rank">Sort by: University Rank</option>
            <option value="citations">Sort by: Paper Citations</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-400'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={() => exportProfessorsToCSV(filteredProfessors as any)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

        </div>

      </div>

      {/* Grid or Table Results View */}
      {filteredProfessors.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Matched Professors Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Try adjusting your search filter or start a new search wizard to discover more researchers.
          </p>
          <button
            onClick={onNewSearch}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-amber-100 bg-brand-800 hover:bg-brand-900 border border-brand-700 shadow-md transition-colors font-serif"
          >
            Start New Search
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessors.map((prof: any) => (
            <ProfessorCard
              key={prof.id}
              professor={{
                id: prof.id,
                name: prof.name,
                title: prof.title || 'Faculty Researcher',
                university: prof.university,
                universityId: prof.university || '',
                country: prof.country,
                countryCode: prof.country || 'US',
                researchInterests: prof.researchAreas || [],
                recentPublications: (prof.recentPublications || []).map((p: any) => ({
                  id: p.title,
                  title: p.title,
                  year: p.year,
                  citedByCount: p.citations,
                })),
                citationCount: prof.recentPublications?.[0]?.citations || 0,
                profileUrl: prof.profileUrl || '',
                scholarUrl: prof.googleScholarUrl || '',
                matchScore: prof.alignmentScore,
                matchReason: prof.alignmentJustification,
                emailStatus: 'Email not publicly available',
                dataSource: 'OpenAlex',
              }}
              onOpenDetails={(p) => onSelectProfessor(prof)}
            />
          ))}
        </div>

      ) : (
        /* Data Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm font-serif">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Match Fit</th>
                  <th className="py-3.5 px-4">Professor Name</th>
                  <th className="py-3.5 px-4">University & Country</th>
                  <th className="py-3.5 px-4">Funding Signal</th>
                  <th className="py-3.5 px-4">Top Paper Title</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProfessors.map((prof) => (
                  <tr key={prof.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-extrabold text-sm text-brand-800 dark:text-amber-300">
                      {prof.alignmentScore}%
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{prof.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{prof.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{prof.university}</div>
                      <div className="text-[11px] text-slate-500">{prof.country} • Rank #{prof.universityRank}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[11px]">
                        {prof.fundingStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate text-slate-700 dark:text-slate-300">
                      {prof.recentPublications[0]?.title || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectProfessor(prof)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => onDraftEmail(prof)}
                        className="px-2.5 py-1.5 rounded-lg bg-brand-800 text-amber-100 font-semibold hover:bg-brand-900 transition-colors border border-brand-700/50"
                      >
                        Draft Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
