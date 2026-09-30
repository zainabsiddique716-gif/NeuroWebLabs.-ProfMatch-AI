'use client';

import React from 'react';
import { EmailDraft } from '@/lib/types';
import { Mail, CheckCircle2, Clock, Send, Eye, MessageSquare, ExternalLink } from 'lucide-react';

interface OutreachHubProps {
  drafts: EmailDraft[];
  onOpenDraft: (draft: EmailDraft) => void;
}

export default function OutreachHub({ drafts, onOpenDraft }: OutreachHubProps) {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-serif">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#06122b] via-brand-950 to-[#102a43] border border-brand-800/80 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold border border-amber-400/20">
            <Mail className="w-4 h-4 text-amber-300" />
            <span>Outreach Management & Email Tracking</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Professor Cold Email Dashboard
          </h2>
          <p className="text-slate-300 text-sm max-w-xl">
            Track sent outreach status, open rate notifications, and follow-up schedules per professor.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-2xl border border-white/10 text-xs font-semibold">
          <div className="px-4 py-2 rounded-xl bg-white/10 text-center">
            <span className="block text-xl font-extrabold text-amber-300">{drafts.length}</span>
            <span className="text-[10px] text-slate-300">Total Outreach</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/10 text-center">
            <span className="block text-xl font-extrabold text-emerald-400">
              {drafts.filter(d => d.status === 'Sent').length}
            </span>
            <span className="text-[10px] text-slate-300">Sent</span>
          </div>
        </div>
      </div>

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Mail className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">No Active Outreach Email Drafts</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Select a matched professor from your discovery dashboard to draft and send a personalized cold email.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-brand-300 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {draft.professorName}
                  </span>
                  <span className="font-mono text-xs text-slate-400">({draft.professorEmail})</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                  Subject: {draft.subject}
                </p>
                <p className="text-xs text-slate-400">
                  Tone: {draft.tone} • Created: {new Date(draft.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  draft.status === 'Sent'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  {draft.status}
                </span>

                <button
                  onClick={() => onOpenDraft(draft)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  View / Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
