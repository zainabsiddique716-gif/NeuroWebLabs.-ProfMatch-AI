'use client';

import React, { useState } from 'react';
import { Professor } from '@/lib/types';
import { 
  Building2, 
  Mail, 
  CheckCircle, 
  BookOpen, 
  Award, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface ProfessorCardProps {
  professor: Professor;
  onSelect: (prof: Professor) => void;
  onDraftEmail: (prof: Professor) => void;
}

export default function ProfessorCard({ professor, onSelect, onDraftEmail }: ProfessorCardProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(professor.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const score = professor.alignmentScore || 85;
  const scoreBadgeColor = score >= 90 
    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
    : score >= 80 
    ? 'bg-brand-900/20 text-brand-900 dark:text-amber-300 border-amber-500/30'
    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between space-y-5 font-serif">
      
      {/* Top Header Row */}
      <div className="space-y-4">
        
        <div className="flex items-start justify-between gap-4">
          
          {/* Avatar & Info */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={professor.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                alt={professor.name}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Active Supervisor" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors flex items-center space-x-2">
                <span>{professor.name}</span>
                {professor.universityRank && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Rank #{professor.universityRank}
                  </span>
                )}
              </h3>
              
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium truncate">{professor.university}</span>
                <span>•</span>
                <span className="truncate">{professor.country}</span>
              </div>
            </div>

          </div>

          {/* Alignment Score Badge */}
          <div className={`flex flex-col items-end px-3 py-1.5 rounded-xl border ${scoreBadgeColor}`}>
            <div className="flex items-center space-x-1 font-extrabold text-lg tracking-tight">
              <Sparkles className="w-4 h-4 fill-current text-amber-500" />
              <span>{score}%</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              AI Alignment Fit
            </span>
          </div>

        </div>

        {/* Email & Badges Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          
          {/* Email Button */}
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px] truncate max-w-[170px]">{professor.email}</span>
            <button
              onClick={copyEmail}
              className="ml-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
              title="Copy Email"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
            </button>
          </div>

          {/* Funding Badge */}
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{professor.fundingStatus}</span>
          </span>

          {/* Department Tag */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-[11px] font-medium truncate max-w-[200px]">
            {professor.department}
          </span>

        </div>

        {/* AI Justification Snippet */}
        {professor.alignmentJustification && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-slate-100 mr-1.5">AI Match Note:</span>
            {professor.alignmentJustification}
          </div>
        )}

        {/* Key Publications */}
        {professor.recentPublications.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <BookOpen className="w-3 h-3 text-amber-500" />
              <span>Key Publication</span>
            </div>
            <a
              href={professor.recentPublications[0].url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block group/pub p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/40 dark:hover:border-amber-600/40 bg-white dark:bg-slate-900 transition-all"
            >
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover/pub:text-amber-700 dark:group-hover/pub:text-amber-300 line-clamp-1">
                {professor.recentPublications[0].title}
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                <span>{professor.recentPublications[0].year}</span>
                <span>•</span>
                <span>{professor.recentPublications[0].journalOrVenue}</span>
                <span>•</span>
                <span className="text-amber-700 dark:text-amber-300 font-medium">{professor.recentPublications[0].citations} Citations</span>
              </div>
            </a>
          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        
        <button
          onClick={() => onSelect(professor)}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        >
          <span>View Deep Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDraftEmail(professor)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-amber-100 bg-brand-800 hover:bg-brand-900 border border-brand-700 shadow-md transition-all hover:scale-[1.01]"
        >
          <Send className="w-3.5 h-3.5 text-amber-400" />
          <span>Draft Cold Email</span>
        </button>

      </div>

    </div>
  );
}
