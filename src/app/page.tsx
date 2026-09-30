'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SearchWizard from '@/components/SearchWizard';
import Dashboard from '@/components/Dashboard';
import ProfessorModal from '@/components/ProfessorModal';
import EmailModal from '@/components/EmailModal';
import ScholarshipRadar from '@/components/ScholarshipRadar';
import OutreachHub from '@/components/OutreachHub';

import { Professor, StudentProfile, DiscoveryRequest, EmailDraft } from '@/lib/types';
import { SAMPLE_PROFESSORS } from '@/lib/mockData';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'wizard' | 'dashboard' | 'scholarships' | 'outreach'>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search & Match State
  const [domain, setDomain] = useState<string>('Reinforcement Learning');
  const [country, setCountry] = useState<string>('United States');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    domain: 'Reinforcement Learning',
    country: 'United States',
    studyLevel: 'PhD',
    statementOfPurpose: 'I am interested in deep reinforcement learning, particularly offline RL, decision-making transformers, and sample-efficient robot manipulation.'
  });

  const [professors, setProfessors] = useState<Professor[]>(SAMPLE_PROFESSORS);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [emailModalProfessor, setEmailModalProfessor] = useState<Professor | null>(null);
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);

  // Dark Mode Class Handler
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleStartSearch = async (request: DiscoveryRequest) => {
    setIsLoading(true);
    setDomain(request.domain);
    setCountry(request.country);
    setStudentProfile({
      domain: request.domain,
      country: request.country,
      studyLevel: request.studyLevel as any,
      statementOfPurpose: request.statementOfPurpose
    });

    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      const data = await res.json();
      if (data.professors && data.professors.length > 0) {
        setProfessors(data.professors);
      }
    } catch (err) {
      console.error('Error executing search pipeline:', err);
    } finally {
      setIsLoading(false);
      setActiveTab('dashboard');
    }
  };

  const handleSaveDraft = (draft: EmailDraft) => {
    setDrafts(prev => [draft, ...prev.filter(d => d.professorId !== draft.professorId)]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-serif selection:bg-brand-700 selection:text-white transition-colors duration-200">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        matchCount={professors.length}
      />

      {/* Main Container View */}
      <main className="pb-16 animate-fade-in">
        {activeTab === 'wizard' && (
          <SearchWizard
            onStartSearch={handleStartSearch}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            professors={professors}
            domain={domain}
            country={country}
            onSelectProfessor={(prof) => setSelectedProfessor(prof)}
            onDraftEmail={(prof) => setEmailModalProfessor(prof)}
            onNewSearch={() => setActiveTab('wizard')}
          />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipRadar />
        )}

        {activeTab === 'outreach' && (
          <OutreachHub
            drafts={drafts}
            onOpenDraft={(draft) => {
              const prof = professors.find(p => p.id === draft.professorId) || {
                id: draft.professorId,
                name: draft.professorName,
                email: draft.professorEmail,
                title: 'Professor',
                university: 'University',
                department: 'Department',
                country: 'Country',
                emailVerified: true,
                researchSummary: '',
                researchAreas: [],
                fundingStatus: 'Active Grants',
                acceptingStudents: true,
                recentPublications: []
              };
              setEmailModalProfessor(prof);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <ProfessorModal
        professor={selectedProfessor}
        onClose={() => setSelectedProfessor(null)}
        onDraftEmail={(prof) => setEmailModalProfessor(prof)}
      />

      <EmailModal
        professor={emailModalProfessor}
        profile={studentProfile}
        onClose={() => setEmailModalProfessor(null)}
        onSaveDraft={handleSaveDraft}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            ScholarMatch AI — Developed for Full-Stack AI Development Track
          </p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('wizard')} className="hover:text-brand-500 transition-colors">
              Wizard
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-brand-500 transition-colors">
              Dashboard
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('scholarships')} className="hover:text-brand-500 transition-colors">
              Scholarships
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
