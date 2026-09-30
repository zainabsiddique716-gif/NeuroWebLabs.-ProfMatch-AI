// components/ProfessorCard.tsx
import React from 'react';
import { ProfessorProfile } from '@/types/academic';
import { Building2, ExternalLink, Sparkles, BookOpen, Mail, ShieldCheck, Database } from 'lucide-react';

interface Props {
  professor: ProfessorProfile;
  onOpenDetails: (prof: ProfessorProfile) => void;
  onDraftEmail?: (prof: ProfessorProfile) => void;
}

export function ProfessorCard({ professor, onOpenDetails, onDraftEmail }: Props) {
  const score = professor.matchScore || 75;
  const isStrongMatch = (professor.matchFit || 'Strong') === 'Strong';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Header: Identity & AI Match Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-base shadow-sm ring-2 ring-blue-50 shrink-0">
              {professor.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                {professor.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{professor.title}</p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-bold text-xs shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{score}% Match</span>
            </div>
            {professor.matchFit && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isStrongMatch ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {professor.matchFit} Fit
              </span>
            )}
          </div>
        </div>

        {/* University & Country Affiliation */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 text-xs font-semibold">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="line-clamp-1">{professor.university}</span>
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase font-bold tracking-wide">
              {professor.country}
            </span>
          </div>

          {/* Data Source Badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" />
              Source: <strong className="text-slate-700">{professor.dataSource}</strong>
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              {professor.emailStatus}
            </span>
          </div>
        </div>

        {/* Research Topics */}
        <div className="flex flex-wrap gap-1.5">
          {professor.researchInterests.slice(0, 3).map((topic, i) => (
            <span
              key={i}
              className="inline-block px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-[11px] font-medium"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* AI Grounded Justification */}
        {professor.matchReason && (
          <div className="p-3 bg-blue-50/40 border border-blue-100 rounded-xl text-xs text-slate-700 leading-relaxed space-y-1">
            <span className="font-bold text-blue-900 block">AI Match Rationale:</span>
            <p className="line-clamp-2">{professor.matchReason}</p>
          </div>
        )}

        {/* Recent Paper Snippet */}
        {professor.recentPublications[0] && (
          <div className="text-xs text-slate-600 space-y-1 border-l-2 border-blue-500 pl-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Publication</span>
            <p className="font-semibold text-slate-800 line-clamp-1">
              "{professor.recentPublications[0].title}"
            </p>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          {professor.citationCount.toLocaleString()} Citations
        </span>

        <div className="flex items-center gap-2">
          {professor.scholarUrl && (
            <a
              href={professor.scholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-blue-600 transition"
              title="Google Scholar Profile"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {onDraftEmail && (
            <button
              onClick={() => onDraftEmail(professor)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          )}
          <button
            onClick={() => onOpenDetails(professor)}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold shadow-2xs transition"
          >
            Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfessorCard;
