// components/ProfessorModal.tsx
import React from 'react';
import { ProfessorProfile } from '@/types/academic';
import { Building2, ExternalLink, Mail, ShieldCheck, Database, Award, BookOpen, CheckCircle2 } from 'lucide-react';

interface Props {
  professor: ProfessorProfile | null;
  onClose: () => void;
  onDraftEmail?: (prof: ProfessorProfile) => void;
}

export function ProfessorModal({ professor, onClose, onDraftEmail }: Props) {
  if (!professor) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">{professor.name}</h3>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                {professor.matchScore}% Match
              </span>
            </div>
            <p className="text-sm text-slate-600 font-medium">{professor.title}</p>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
              <Building2 className="w-4 h-4" />
              <span>{professor.university} ({professor.country})</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Identity & Verification Signal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block font-medium">Data Source</span>
            <strong className="text-slate-800 flex items-center gap-1 mt-0.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              {professor.dataSource}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Email Status</span>
            <strong className="text-slate-800 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {professor.emailStatus}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Total Citations</span>
            <strong className="text-slate-800 flex items-center gap-1 mt-0.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              {professor.citationCount.toLocaleString()}
            </strong>
          </div>
        </div>

        {/* AI Match Rationale & Evidence */}
        {professor.matchReason && (
          <div className="space-y-2 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              AI Match Justification
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{professor.matchReason}</p>
            
            {professor.matchEvidence && professor.matchEvidence.length > 0 && (
              <div className="pt-2 border-t border-blue-100/80 space-y-1">
                <span className="text-[11px] font-semibold text-blue-800">Verified Evidence & Papers:</span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {professor.matchEvidence.map((ev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Research Topics */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Verified Research Fields
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {professor.researchInterests.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Publications */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Recent Publications & Works
          </h4>
          {professor.recentPublications.length > 0 ? (
            <div className="space-y-2">
              {professor.recentPublications.map((pub) => (
                <div key={pub.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-slate-900">{pub.title}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    {pub.year && <span>Year: {pub.year}</span>}
                    {pub.citedByCount !== undefined && <span>• {pub.citedByCount} Citations</span>}
                    {pub.venue && <span>• {pub.venue}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No listed publications in current index.</p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          {professor.scholarUrl && (
            <a
              href={professor.scholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>View Google Scholar Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {onDraftEmail && (
            <button
              onClick={() => {
                onClose();
                onDraftEmail(professor);
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition"
            >
              <Mail className="w-4 h-4" />
              <span>Generate Personalized Outreach Email</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
