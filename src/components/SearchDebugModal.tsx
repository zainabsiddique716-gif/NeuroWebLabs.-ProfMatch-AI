// components/SearchDebugModal.tsx
import React from 'react';
import { PipelineDebugInfo } from '@/lib/institution-pipeline';
import { Terminal, CheckCircle, Database, Search } from 'lucide-react';

interface Props {
  debugInfo: PipelineDebugInfo | null;
  onClose: () => void;
}

export function SearchDebugModal({ debugInfo, onClose }: Props) {
  if (!debugInfo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>SEARCH PIPELINE DEBUG CONSOLE</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-base">
            ✕
          </button>
        </div>

        <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-300">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 block">Country:</span>
              <strong className="text-white">{debugInfo.country} ({debugInfo.countryCode})</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Target University:</span>
              <strong className="text-white">{debugInfo.resolvedInstitutionName}</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-500 block">Resolved OpenAlex ID:</span>
            <code className="text-amber-300">{debugInfo.resolvedInstitutionId || 'Country-Scoped Search'}</code>
          </div>

          <div>
            <span className="text-slate-500 block">Research Topic Query:</span>
            <code className="text-blue-300">"{debugInfo.researchQuery}"</code>
          </div>
        </div>

        <div className="space-y-1.5 bg-slate-900 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 font-bold block border-b border-slate-800 pb-1">Pipeline Metrics:</span>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-400">OpenAlex Institutions Resolved:</span>
            <span className="text-white font-bold">{debugInfo.openAlexInstitutionsFound}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-400">OpenAlex Scoped Works Found:</span>
            <span className="text-white font-bold">{debugInfo.openAlexWorksFound}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-400">Authors Extracted:</span>
            <span className="text-white font-bold">{debugInfo.authorsExtracted}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-400">Affiliated Faculty Verified:</span>
            <span className="text-emerald-400 font-bold">{debugInfo.facultyVerified}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-400">Final Ranked Candidates:</span>
            <span className="text-amber-300 font-bold">{debugInfo.finalMatchedResearchers}</span>
          </div>
          <div className="flex justify-between py-0.5 pt-1 border-t border-slate-800">
            <span className="text-slate-400">Pipeline Execution Time:</span>
            <span className="text-blue-400 font-bold">{debugInfo.executionTimeMs} ms</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
}
