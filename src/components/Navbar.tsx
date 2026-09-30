// components/Navbar.tsx
import React from 'react';
import { GraduationCap, Award, Mail, Sparkles } from 'lucide-react';

interface Props {
  activeTab: 'discovery' | 'scholarships' | 'outreach';
  onTabChange: (tab: 'discovery' | 'scholarships' | 'outreach') => void;
}

export function Navbar({ activeTab, onTabChange }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('discovery')}>
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">ProfMatch AI</span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 font-bold rounded-full uppercase">
                v2.0 Enterprise
              </span>
            </div>
          </div>
        </div>

        {/* Tab Links */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onTabChange('discovery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'discovery'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professor Discovery</span>
          </button>

          <button
            onClick={() => onTabChange('scholarships')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'scholarships'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Scholarship Radar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
