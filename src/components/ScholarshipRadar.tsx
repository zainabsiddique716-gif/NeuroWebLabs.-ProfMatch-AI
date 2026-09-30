'use client';

import React, { useState } from 'react';
import { Scholarship } from '@/lib/types';
import { SAMPLE_SCHOLARSHIPS } from '@/lib/mockData';
import { 
  Award, 
  Globe, 
  Calendar, 
  ExternalLink, 
  DollarSign, 
  Sparkles, 
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function ScholarshipRadar() {
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [scholarships] = useState<Scholarship[]>(SAMPLE_SCHOLARSHIPS);

  const filtered = scholarships.filter(sch => {
    if (selectedCountry === 'All') return true;
    return sch.country.toLowerCase().includes(selectedCountry.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-serif">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#06122b] via-brand-950 to-[#102a43] border border-amber-500/30 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/20">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Scholarship Radar • Fully Funded Opportunities</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Global Fellowship & Scholarship Finder
          </h2>
          <p className="text-slate-300 text-sm max-w-xl">
            Automated tracking for top doctoral & master's scholarships with stipend allowances, tuition waivers, and upcoming deadlines.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/20">
          {['All', 'Germany', 'United States', 'United Kingdom', 'Switzerland'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCountry === c 
                  ? 'bg-amber-400 text-brand-950 shadow-md' 
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Scholarship Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((sch) => (
          <div 
            key={sch.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-300 font-bold">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{sch.country}</span>
                    <span>•</span>
                    <span>{sch.organization}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                    {sch.title}
                  </h3>
                </div>

                <div className="flex flex-col items-end px-3 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  <span className="font-extrabold text-base">{sch.matchScore}%</span>
                  <span className="text-[9px] uppercase font-bold">Fit Score</span>
                </div>
              </div>

              {/* Coverage Banner */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{sch.coverage}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {sch.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sch.eligibleDomains.map(d => (
                  <span key={d} className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                    {d}
                  </span>
                ))}
              </div>

            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Deadline: <span className="font-bold text-slate-800 dark:text-slate-200">{sch.deadline}</span></span>
              </div>

              <a
                href={sch.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 border border-brand-700 text-amber-100 font-bold shadow-md transition-all hover:scale-[1.01]"
              >
                <span>Apply Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
