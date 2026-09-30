'use client';

import React from 'react';
import { Sparkles, GraduationCap, Compass, Mail, Award, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  activeTab: 'wizard' | 'dashboard' | 'scholarships' | 'outreach';
  setActiveTab: (tab: 'wizard' | 'dashboard' | 'scholarships' | 'outreach') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  matchCount?: number;
}

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode, matchCount = 0 }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0b1320]/90 backdrop-blur-md transition-colors font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('wizard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 via-brand-800 to-slate-800 border border-brand-700/40 flex items-center justify-center shadow-md text-accent-500 font-bold">
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-amber-100">
                ScholarMatch AI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 dark:bg-amber-950/80 dark:text-amber-300 border border-accent-200 dark:border-amber-800/80">
                ACADEMIC PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              AI-Powered Professor & Scholarship Outreach Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'wizard'
                ? 'bg-white dark:bg-slate-800 text-brand-800 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Search Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-slate-800 text-brand-800 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Matched Professors</span>
            {matchCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-brand-800 dark:bg-amber-600 text-white">
                {matchCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scholarships')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'scholarships'
                ? 'bg-white dark:bg-slate-800 text-brand-800 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Scholarship Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('outreach')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'outreach'
                ? 'bg-white dark:bg-slate-800 text-brand-800 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Outreach Hub</span>
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          <button
            onClick={() => setActiveTab('wizard')}
            className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-amber-100 bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 hover:from-brand-950 hover:to-slate-950 border border-brand-700/50 shadow-md transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>New Search</span>
          </button>
        </div>

      </div>
    </header>
  );
}
