// components/ScholarshipRadar.tsx
import React, { useState, useEffect } from 'react';
import { ScholarshipItem } from '@/lib/scholarships-data';
import { Award, ExternalLink, Calendar, CheckCircle, Globe, Search, Filter } from 'lucide-react';
import { SUPPORTED_COUNTRIES } from '@/lib/countries';

export function ScholarshipRadar() {
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [country, setCountry] = useState<string>('all');
  const [degree, setDegree] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchScholarships = async () => {
    setIsLoading(true);
    try {
      const url = `/api/scholarships?country=${country}&degree=${degree}&query=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Could not fetch scholarships');
      const data = await res.json();
      setScholarships(data.scholarships || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [country, degree]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
          <Award className="w-4 h-4 text-amber-400" />
          Scholarship Radar & Funding Signals
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          International Graduate & Doctoral Research Funding Programs
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Discover verified fully-funded government and institutional research scholarships for MS, PhD, and Postdoc opportunities worldwide.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchScholarships()}
            placeholder="Search scholarships by keyword, organization, or field..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Destination Countries</option>
            {SUPPORTED_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>

          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Degree Levels</option>
            <option value="MS">Master's / MS</option>
            <option value="PhD">PhD / Doctoral</option>
            <option value="Postdoc">Postdoctoral</option>
          </select>

          <button
            onClick={fetchScholarships}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholarships.map((s) => (
          <div
            key={s.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    {s.organization}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{s.title}</h3>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md shrink-0">
                  {s.country}
                </span>
              </div>

              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-950 font-medium">
                <strong className="text-blue-900 block font-bold mb-0.5">Coverage:</strong>
                {s.coverage}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{s.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {s.degreeLevels.map((d) => (
                  <span key={d} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Deadline: {s.deadline}
              </span>
              <a
                href={s.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-800 hover:text-blue-600 rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1 transition"
              >
                <span>Official Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
