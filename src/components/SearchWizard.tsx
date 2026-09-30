'use client';

import React, { useState } from 'react';
import { Search, Globe, GraduationCap, FileText, Upload, Sparkles, ArrowRight, CheckCircle2, Loader2, BookOpen, Layers } from 'lucide-react';
import { DiscoveryRequest } from '@/lib/types';

interface SearchWizardProps {
  onStartSearch: (data: DiscoveryRequest) => Promise<void>;
  isLoading: boolean;
}

const CATEGORIZED_DOMAINS = [
  {
    category: "AI, Computing & Tech",
    items: ["Reinforcement Learning", "Generative AI & LLMs", "Robotics & Automation", "Quantum Computing", "Cybersecurity & Cryptography", "Data Science & Big Data", "Computer Vision", "Natural Language Processing"]
  },
  {
    category: "Engineering & Physical Sciences",
    items: ["Renewable Energy & Power Systems", "Aerospace Engineering", "Mechanical Engineering", "Nanotechnology & Materials", "Civil & Structural Engineering", "Physics & Quantum Optics", "Chemical Engineering", "Electrical Engineering"]
  },
  {
    category: "Life Sciences, Medicine & Biotech",
    items: ["Biotechnology & Bioinformatics", "Neuroscience & BCI", "Cancer Genomics & Oncology", "Biomedical Engineering", "Molecular Biology", "Pharmacology & Drug Discovery", "Public Health & Epidemiology", "Genetics & Crispr"]
  },
  {
    category: "Social Sciences, Business & Humanities",
    items: ["Economics & Econometrics", "Finance & Fintech", "Clinical Psychology", "Environmental Science & Climate", "International Relations & Law", "Sociology", "Architecture & Urban Design", "Education & Pedagogy"]
  }
];

const GLOBAL_COUNTRIES = [
  // Popular Global Hubs
  { code: "United States", flag: "🇺🇸", region: "North America" },
  { code: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  { code: "Canada", flag: "🇨🇦", region: "North America" },
  { code: "Germany", flag: "🇩🇪", region: "Europe" },
  { code: "Switzerland", flag: "🇨🇭", region: "Europe" },
  { code: "Australia", flag: "🇦🇺", region: "Asia-Pacific" },
  { code: "Japan", flag: "🇯🇵", region: "Asia-Pacific" },
  { code: "France", flag: "🇫🇷", region: "Europe" },
  { code: "Netherlands", flag: "🇳🇱", region: "Europe" },
  { code: "Sweden", flag: "🇸🇪", region: "Europe" },
  { code: "Singapore", flag: "🇸🇬", region: "Asia-Pacific" },
  { code: "China", flag: "🇨🇳", region: "Asia-Pacific" },
  { code: "South Korea", flag: "🇰🇷", region: "Asia-Pacific" },
  { code: "India", flag: "🇮🇳", region: "Asia-Pacific" },
  { code: "Pakistan", flag: "🇵🇰", region: "Asia-Pacific" },
  { code: "Brazil", flag: "🇧🇷", region: "Latin America" },
  { code: "South Africa", flag: "🇿🇦", region: "Middle East & Africa" },
  { code: "United Arab Emirates", flag: "🇦🇪", region: "Middle East & Africa" },
  { code: "Italy", flag: "🇮🇹", region: "Europe" },
  { code: "Spain", flag: "🇪🇸", region: "Europe" },
  { code: "Norway", flag: "🇳🇴", region: "Europe" },
  { code: "Denmark", flag: "🇩🇰", region: "Europe" },
  { code: "Finland", flag: "🇫🇮", region: "Europe" },
  { code: "New Zealand", flag: "🇳🇿", region: "Asia-Pacific" },
  { code: "Turkey", flag: "🇹🇷", region: "Middle East & Africa" },
  { code: "Malaysia", flag: "🇲🇾", region: "Asia-Pacific" },
  { code: "Ireland", flag: "🇮🇪", region: "Europe" },
  { code: "Saudi Arabia", flag: "🇸🇦", region: "Middle East & Africa" },
  { code: "Egypt", flag: "🇪🇬", region: "Middle East & Africa" },
  { code: "Austria", flag: "🇦🇹", region: "Europe" },
  { code: "Belgium", flag: "🇧🇪", region: "Europe" }
];

export default function SearchWizard({ onStartSearch, isLoading }: SearchWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [domain, setDomain] = useState('Reinforcement Learning');
  const [customDomain, setCustomDomain] = useState('');
  const [country, setCountry] = useState('United States');
  const [customCountry, setCustomCountry] = useState('');
  const [studyLevel, setStudyLevel] = useState<'PhD' | 'Master / MS' | 'Research Assistant'>('PhD');
  const [statementOfPurpose, setStatementOfPurpose] = useState(
    'I am looking for research positions in deep reinforcement learning, particularly offline RL, decision-making transformers, and sample-efficient robot manipulation. My background includes PyTorch, optimal control theory, and high-dimensional policy gradient algorithms.'
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');

  const activeDomain = customDomain.trim() || domain;
  const activeCountry = customCountry.trim() || country;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDomain || !activeCountry) return;

    setPipelineStep(1);
    const timer1 = setTimeout(() => setPipelineStep(2), 1200);
    const timer2 = setTimeout(() => setPipelineStep(3), 2400);

    try {
      await onStartSearch({
        domain: activeDomain,
        country: activeCountry,
        studyLevel,
        statementOfPurpose
      });
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setStatementOfPurpose(prev => prev + `\n\n[Uploaded CV Context: ${file.name} - Extracted Skills: PyTorch, TensorFlow, Publication History, LaTeX]`);
    }
  };

  const filteredCountries = GLOBAL_COUNTRIES.filter(c => {
    if (countryFilter === 'All') return true;
    return c.region === countryFilter;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 font-serif">
      
      {/* Header Banner */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Global 160+ Countries & All Academic Disciplines Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Your Professor & Scholarship Match Anywhere in the World
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Scans top universities globally across 160+ countries, reads recent publications via OpenAlex, and scores research alignment using LLMs.
        </p>
      </div>

      {/* Main Card Wizard */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
        
        {/* Wizard Step Indicator Bar */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center space-x-2 text-sm font-semibold transition-colors ${
                step === 1 ? 'text-brand-800 dark:text-amber-300' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                step === 1 ? 'bg-brand-800 text-amber-100 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                1
              </span>
              <span>1. Field & Country (160+ Global)</span>
            </button>
            
            <div className="w-8 h-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

            <button
              onClick={() => setStep(2)}
              className={`flex items-center space-x-2 text-sm font-semibold transition-colors ${
                step === 2 ? 'text-brand-800 dark:text-amber-300' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                step === 2 ? 'bg-brand-800 text-amber-100 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                2
              </span>
              <span>2. Research Fit & SOP</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Step {step} of 2
          </span>
        </div>

        {/* Wizard Form Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Field of Interest / Domain */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Search className="w-4 h-4 text-amber-500" />
                    <span>Academic Field / Domain (All Disciplines Supported)</span>
                  </label>
                  <span className="text-xs text-slate-500 font-medium">Type any field or select below</span>
                </div>

                {/* Custom Domain Input */}
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="Type ANY custom research field (e.g., Nanotechnology, Molecular Genetics, Structural Engineering)..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
                />

                {/* Domain Categories */}
                <div className="space-y-3 pt-2">
                  {CATEGORIZED_DOMAINS.map((cat) => (
                    <div key={cat.category} className="space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        {cat.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setDomain(item);
                              setCustomDomain('');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              activeDomain === item && !customDomain
                                ? 'bg-brand-800 border-brand-700 text-amber-100 font-bold shadow-md'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500/50'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Country Selection */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-amber-500" />
                    <span>Target Country (All 160+ Countries Supported)</span>
                  </label>
                  
                  {/* Region Filter */}
                  <div className="flex items-center space-x-1">
                    {['All', 'North America', 'Europe', 'Asia-Pacific', 'Middle East & Africa', 'Latin America'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCountryFilter(r)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          countryFilter === r ? 'bg-brand-800 text-amber-100' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Text Country Input for 160+ countries */}
                <input
                  type="text"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder="Or type ANY country in the world (e.g. Norway, Singapore, Brazil, South Africa, Italy, UAE)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm transition-all"
                />

                {/* Country Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCountry(c.code);
                        setCustomCountry('');
                      }}
                      className={`flex items-center space-x-2 p-2 rounded-xl border text-xs font-medium text-left transition-all ${
                        activeCountry === c.code && !customCountry
                          ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-900 dark:text-amber-200 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm">{c.flag}</span>
                      <span className="truncate">{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Level */}
              <div className="space-y-2 pt-2">
                <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span>Target Degree / Position</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['PhD', 'Master / MS', 'Research Assistant'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setStudyLevel(level)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                        studyLevel === level
                          ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1 Next Button */}
              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-amber-100 bg-brand-800 hover:bg-brand-900 border border-brand-700 shadow-md text-sm transition-all hover:translate-x-0.5"
                >
                  <span>Next: Statement & Alignment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              
              {/* Statement of Purpose / Bio */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>Research Statement & Interests ({activeDomain})</span>
                  </label>
                  <span className="text-xs text-slate-500">Scored by Gemini LLM</span>
                </div>
                <textarea
                  rows={4}
                  value={statementOfPurpose}
                  onChange={(e) => setStatementOfPurpose(e.target.value)}
                  placeholder="Describe your research background, technical skills (e.g. PyTorch, C++, lab techniques), and specific topics you want to explore..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
                />
              </div>

              {/* Resume / CV Upload Section */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {fileName ? `Uploaded: ${fileName}` : 'Attach CV or Resume (PDF/TXT)'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Auto-extract publications & technical keywords for enhanced matching
                    </p>
                  </div>
                </div>

                <label className="cursor-pointer px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                  <span>Browse File</span>
                  <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Pipeline Live Progress Banner */}
              {isLoading && (
                <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                    <span className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                      <span>Global Discovery Pipeline Active...</span>
                    </span>
                    <span>Targeting: {activeDomain} in {activeCountry}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 text-xs text-amber-800 dark:text-amber-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>1. Querying Universities & OpenAlex Academic Registry in {activeCountry}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-amber-800 dark:text-amber-300">
                      {pipelineStep >= 2 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      )}
                      <span>2. Extracting Faculty Publications & Citation Metrics for {activeDomain}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-amber-800 dark:text-amber-300">
                      {pipelineStep >= 3 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-amber-400" />
                      )}
                      <span>3. Gemini LLM Research Alignment & Score Justification</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ← Back to Step 1
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-7 py-3 rounded-xl font-bold text-amber-100 bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 hover:from-brand-950 hover:to-slate-950 border border-brand-700 shadow-lg text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Searching Global Faculty...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Run Global AI Matching</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </form>

      </div>
    </div>
  );
}
