'use client';

import React from 'react';
import { Professor } from '@/lib/types';
import { 
  X, 
  Building2, 
  Mail, 
  ExternalLink, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  Send,
  Award,
  Globe
} from 'lucide-react';

interface ProfessorModalProps {
  professor: Professor | null;
  onClose: () => void;
  onDraftEmail: (prof: Professor) => void;
}

export default function ProfessorModal({ professor, onClose, onDraftEmail }: ProfessorModalProps) {
  if (!professor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-serif">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#06122b] via-brand-950 to-[#102a43] text-white flex items-start justify-between border-b border-brand-800/80 relative">
          <div className="flex items-center space-x-4">
            <img
              src={professor.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
              alt={professor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/10"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">{professor.name}</h2>
                {professor.universityRank && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300">
                    Rank #{professor.universityRank}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200 mt-0.5">{professor.title}</p>
              <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{professor.university}</span>
                <span>•</span>
                <span>{professor.country}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
          
          {/* AI Match Overview Card */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center space-x-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Research Alignment: {professor.alignmentScore}% Match</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white">
                {professor.fundingStatus}
              </span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              {professor.alignmentJustification}
            </p>
            {professor.matchingKeywords && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {professor.matchingKeywords.map(kw => (
                  <span key={kw} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Research Summary */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Research Focus & Lab Interests
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {professor.researchSummary}
            </p>
          </div>

          {/* Research Areas */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Key Research Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {professor.researchAreas.map(area => (
                <span key={area} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Recent Publications & Abstracts</span>
            </h4>

            <div className="space-y-2.5">
              {professor.recentPublications.map((pub, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-semibold text-slate-900 dark:text-white leading-snug">
                      {pub.title}
                    </h5>
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-amber-700 dark:text-amber-300 hover:underline flex-shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {pub.abstractSnippet && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      "{pub.abstractSnippet}"
                    </p>
                  )}
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                    <span>Published: {pub.year}</span>
                    <span>•</span>
                    <span>{pub.journalOrVenue}</span>
                    <span>•</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-300">{pub.citations} Citations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            {professor.email}
          </div>
          
          <button
            onClick={() => {
              onClose();
              onDraftEmail(professor);
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-amber-100 bg-brand-800 hover:bg-brand-900 border border-brand-700 shadow-md text-xs transition-all hover:scale-[1.01]"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>Generate & Edit Cold Email</span>
          </button>
        </div>

      </div>
    </div>
  );
}
