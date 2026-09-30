// components/SearchFilterPanel.tsx
import React, { useState } from 'react';
import { SUPPORTED_COUNTRIES } from '@/lib/countries';
import { RESEARCH_DOMAINS } from '@/lib/domains';
import { UniversityOption } from '@/types/academic';
import { Globe, School, Search, ArrowRight, Loader2, BookOpen, UserCheck, Layers, Sparkles, FileText, Check } from 'lucide-react';

interface Props {
  selectedCountry: string;
  onCountryChange: (code: string) => void;
  universities: UniversityOption[];
  selectedUniversity: string;
  onUniversityChange: (univId: string) => void;
  isLoadingUniversities: boolean;
  selectedCategory: string;
  onCategoryChange: (catId: string) => void;
  selectedTopics: string[];
  onToggleTopic: (topic: string) => void;
  customInterest: string;
  onCustomInterestChange: (text: string) => void;
  studyLevel: string;
  onStudyLevelChange: (level: string) => void;
  userBio: string;
  onUserBioChange: (text: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function SearchFilterPanel({
  selectedCountry,
  onCountryChange,
  universities,
  selectedUniversity,
  onUniversityChange,
  isLoadingUniversities,
  selectedCategory,
  onCategoryChange,
  selectedTopics,
  onToggleTopic,
  customInterest,
  onCustomInterestChange,
  studyLevel,
  onStudyLevelChange,
  userBio,
  onUserBioChange,
  onSearch,
  isSearching,
}: Props) {
  const [topicSearchQuery, setTopicSearchQuery] = useState('');

  const activeCategoryObj = RESEARCH_DOMAINS.find((d) => d.id === selectedCategory) || RESEARCH_DOMAINS[0];

  const filteredSubcategories = activeCategoryObj.subcategories.filter((sub) =>
    sub.toLowerCase().includes(topicSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Academic Discovery & AI Match Setup
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure target geography, institution, research subtopics, and proposal intent to query academic indexes.
          </p>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
          Multi-Source Pipeline Active
        </span>
      </div>

      {/* Row 1: Target Country & University */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Target Country */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-blue-600" />
            1. Target Country <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition"
          >
            <option value="">-- Select Target Country --</option>
            {SUPPORTED_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Institution / University */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <School className="w-4 h-4 text-blue-600" />
            2. Institution / University Preference
          </label>
          <div className="relative">
            <select
              value={selectedUniversity}
              onChange={(e) => onUniversityChange(e.target.value)}
              disabled={!selectedCountry || isLoadingUniversities}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="all">Search Across All Universities in Selected Country</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName}
                </option>
              ))}
            </select>
            {isLoadingUniversities && (
              <div className="absolute right-3.5 top-3.5">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Research Domain Category & Searchable Subcategories */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-blue-600" />
          3. Research Domain & Subtopics
        </label>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {RESEARCH_DOMAINS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onCategoryChange(cat.id);
                setTopicSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategory Search & Pill Multi-Select */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={topicSearchQuery}
                onChange={(e) => setTopicSearchQuery(e.target.value)}
                placeholder={`Search subtopics under ${activeCategoryObj.name}...`}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {selectedTopics.length > 0 && (
              <span className="text-[11px] font-semibold text-blue-700 shrink-0">
                {selectedTopics.length} selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredSubcategories.map((sub) => {
              const isSelected = selectedTopics.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onToggleTopic(sub)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white border border-blue-700'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Custom Research Interest & Study Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-600" />
            4. Custom Research Interest / Thesis Focus (Freeform Text)
          </label>
          <input
            type="text"
            value={customInterest}
            onChange={(e) => onCustomInterestChange(e.target.value)}
            placeholder='e.g. "Federated learning for healthcare" or "AI-based traffic management using vision"'
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-blue-600" />
            5. Target Study Level
          </label>
          <select
            value={studyLevel}
            onChange={(e) => onStudyLevelChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition"
          >
            <option value="PhD Research">PhD Research / Doctoral</option>
            <option value="MS / Master Research">MS / Master's Thesis</option>
            <option value="Research Assistantship">Research Assistantship (RA)</option>
            <option value="Postdoc Opportunity">Postdoctoral Research</option>
            <option value="Research Internship">Graduate Research Internship</option>
          </select>
        </div>
      </div>

      {/* Row 4: Student Proposal / Background Text (Optional) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <FileText className="w-4 h-4 text-blue-600" />
          6. Optional Student Proposal / Bio / CV Text (For Gemini LLM Scoring)
        </label>
        <textarea
          rows={2}
          value={userBio}
          onChange={(e) => onUserBioChange(e.target.value)}
          placeholder="Paste your brief bio, CV summary, or research proposal abstract. Gemini will match professor publication evidence against this text."
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition"
        />
      </div>

      {/* Search Submit Bar */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          {selectedCountry ? (
            <span className="font-semibold text-slate-700">
              Ready to query OpenAlex & Semantic Scholar for professors in {selectedCountry}.
            </span>
          ) : (
            <span className="text-amber-600 font-medium">
              Please select a target country to execute search.
            </span>
          )}
        </div>

        <button
          onClick={onSearch}
          disabled={!selectedCountry || isSearching}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition duration-150"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Discovering & Matching with Gemini AI...
            </>
          ) : (
            <>
              <span>Find & Rank Professors</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
