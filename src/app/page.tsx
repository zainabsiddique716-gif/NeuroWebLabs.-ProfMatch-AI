// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchFilterPanel } from '@/components/SearchFilterPanel';
import { ProfessorCard } from '@/components/ProfessorCard';
import { ProfessorModal } from '@/components/ProfessorModal';
import { EmailModal } from '@/components/EmailModal';
import { SearchDebugModal } from '@/components/SearchDebugModal';
import { ScholarshipRadar } from '@/components/ScholarshipRadar';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { ProfessorProfile, UniversityOption } from '@/types/academic';
import { PipelineDebugInfo } from '@/lib/institution-pipeline';
import { exportProfessorsToCSV } from '@/lib/csvExporter';
import { Sparkles, AlertCircle, SearchX, Download, Database, RefreshCw, Terminal } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'discovery' | 'scholarships' | 'outreach'>('discovery');

  // Search Controls State
  const [selectedCountry, setSelectedCountry] = useState<string>('PK');
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [isLoadingUniversities, setIsLoadingUniversities] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('cs_ai');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Artificial Intelligence', 'Machine Learning']);
  const [customInterest, setCustomInterest] = useState<string>('');
  const [studyLevel, setStudyLevel] = useState<string>('PhD Research');
  const [userBio, setUserBio] = useState<string>('');

  // Results & Pipeline State
  const [professors, setProfessors] = useState<ProfessorProfile[]>([]);
  const [sourcesSearched, setSourcesSearched] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<PipelineDebugInfo | null>(null);
  const [showDebugModal, setShowDebugModal] = useState<boolean>(false);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'citations' | 'name'>('score');

  // Modals
  const [selectedProfModal, setSelectedProfModal] = useState<ProfessorProfile | null>(null);
  const [selectedEmailProf, setSelectedEmailProf] = useState<ProfessorProfile | null>(null);

  // Synchronize country selection with live institution directory
  useEffect(() => {
    if (!selectedCountry) {
      setUniversities([]);
      setSelectedUniversity('all');
      return;
    }

    async function loadUniversities() {
      setIsLoadingUniversities(true);
      try {
        const res = await fetch(`/api/universities?country=${selectedCountry}`);
        if (!res.ok) throw new Error('Could not fetch universities.');
        const data = await res.json();
        setUniversities(data.universities || []);
        setSelectedUniversity('all');
      } catch (err) {
        setErrorMessage('Unable to load university registry.');
      } finally {
        setIsLoadingUniversities(false);
      }
    }

    loadUniversities();
  }, [selectedCountry]);

  const handleToggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Execute Institution-First Multi-Source Search & AI Ranking
  const handleSearch = async () => {
    if (!selectedCountry) return;
    setIsSearching(true);
    setHasSearched(true);
    setErrorMessage(null);

    const selectedUnivObj = universities.find((u) => u.id === selectedUniversity);

    try {
      const res = await fetch('/api/professors/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: selectedCountry,
          universityId: selectedUniversity,
          universityName: selectedUnivObj ? selectedUnivObj.name : selectedUniversity,
          domainCategory: selectedCategory,
          selectedTopics,
          customInterest,
          studyLevel,
          userBio,
        }),
      });

      if (!res.ok) {
        throw new Error('Academic search pipeline temporarily unavailable.');
      }

      const data = await res.json();
      setProfessors(data.professors || []);
      setSourcesSearched(data.sourcesSearched || ['OpenAlex Institution Works Pipeline']);
      if (data.debugInfo) {
        setDebugInfo(data.debugInfo);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing academic search pipeline.');
      setProfessors([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Filter & Sort Logic
  const filteredProfessors = professors.filter((prof) => {
    const matchesQuery =
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.researchInterests.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prof.recentPublications.some((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesScore = (prof.matchScore || 0) >= minScoreFilter;
    return matchesQuery && matchesScore;
  });

  filteredProfessors.sort((a, b) => {
    if (sortBy === 'score') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'citations') return (b.citationCount || 0) - (a.citationCount || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {activeTab === 'scholarships' ? (
          <ScholarshipRadar />
        ) : (
          <>
            {/* Hero Banner */}
            <div className="max-w-3xl space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Institution-First Research Discovery & AI Matching
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discover verified faculty members and active researchers from Asian, US, UK, and global universities by scoping academic publications directly to verified institution entities.
              </p>
            </div>

            {/* Step-by-Step Search Controls */}
            <SearchFilterPanel
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              universities={universities}
              selectedUniversity={selectedUniversity}
              onUniversityChange={setSelectedUniversity}
              isLoadingUniversities={isLoadingUniversities}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedTopics={selectedTopics}
              onToggleTopic={handleToggleTopic}
              customInterest={customInterest}
              onCustomInterestChange={setCustomInterest}
              studyLevel={studyLevel}
              onStudyLevelChange={setStudyLevel}
              userBio={userBio}
              onUserBioChange={setUserBio}
              onSearch={handleSearch}
              isSearching={isSearching}
            />

            {/* Error Alert Display */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pipeline Status Indicator & Debug Trigger */}
            {hasSearched && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Query Pipeline: <strong className="text-slate-900">{sourcesSearched.join(' • ')}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-700">{professors.length} Verified Researchers Discovered</span>
                  {debugInfo && (
                    <button
                      onClick={() => setShowDebugModal(true)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-mono text-[11px] font-bold rounded-lg flex items-center gap-1 transition"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>SEARCH DEBUG</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Results Header & Filters Bar */}
            {professors.length > 0 && !isSearching && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter results by researcher name, university, or paper title..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={minScoreFilter}
                    onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none"
                  >
                    <option value={0}>All Match Scores (&gt; 0%)</option>
                    <option value={75}>Strong Fits (&gt; 75%)</option>
                    <option value={85}>Top Fits (&gt; 85%)</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none"
                  >
                    <option value="score">Sort by: AI Match Score</option>
                    <option value="citations">Sort by: Paper Citations</option>
                    <option value="name">Sort by: Researcher Name</option>
                  </select>

                  <button
                    onClick={() => exportProfessorsToCSV(filteredProfessors)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            )}

            {/* Results Grid */}
            <div className="space-y-4 pt-2">
              {/* 1. Loading Skeletons */}
              {isSearching && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* 2. Initial State */}
              {!isSearching && !hasSearched && (
                <div className="bg-white border border-slate-200/70 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Initiate Academic Discovery
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Select a target country and university above to execute institution-scoped researcher discovery.
                  </p>
                </div>
              )}

              {/* 3. Empty State */}
              {!isSearching && hasSearched && filteredProfessors.length === 0 && !errorMessage && (
                <div className="bg-white border border-slate-200/70 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800">
                      No verified researchers found matching your criteria
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Sources queried: {sourcesSearched.join(', ')}. Try selecting "All Universities" or broadening your keywords.
                    </p>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs inline-flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Search Pipeline</span>
                  </button>
                </div>
              )}

              {/* 4. Loaded Results Grid */}
              {!isSearching && filteredProfessors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfessors.map((prof) => (
                    <ProfessorCard
                      key={prof.id}
                      professor={prof}
                      onOpenDetails={(p) => setSelectedProfModal(p)}
                      onDraftEmail={(p) => setSelectedEmailProf(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Professor Profile Modal */}
      <ProfessorModal
        professor={selectedProfModal}
        onClose={() => setSelectedProfModal(null)}
        onDraftEmail={(p) => setSelectedEmailProf(p)}
      />

      {/* Email Review Modal */}
      <EmailModal
        professor={selectedEmailProf}
        userInterest={
          [...selectedTopics, customInterest].filter(Boolean).join(', ') || 'Academic Research'
        }
        userProposal={customInterest}
        studyLevel={studyLevel}
        userBio={userBio}
        onClose={() => setSelectedEmailProf(null)}
      />

      {/* Developer Search Debug Console */}
      {showDebugModal && (
        <SearchDebugModal debugInfo={debugInfo} onClose={() => setShowDebugModal(false)} />
      )}
    </div>
  );
}
