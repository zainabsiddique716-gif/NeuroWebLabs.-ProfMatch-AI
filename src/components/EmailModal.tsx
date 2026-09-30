'use client';

import React, { useState, useEffect } from 'react';
import { Professor, StudentProfile, EmailDraft } from '@/lib/types';
import { 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Loader2,
  AlertCircle
} from 'lucide-react';

interface EmailModalProps {
  professor: Professor | null;
  profile: StudentProfile;
  onClose: () => void;
  onSaveDraft: (draft: EmailDraft) => void;
}

export default function EmailModal({ professor, profile, onClose, onSaveDraft }: EmailModalProps) {
  const [tone, setTone] = useState<'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise'>('Academic Professional');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (professor) {
      generateDraft(tone);
    }
  }, [professor]);

  const generateDraft = async (selectedTone: 'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise') => {
    if (!professor) return;
    setLoading(true);
    try {
      const res = await fetch('/api/email-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professor,
          profile,
          tone: selectedTone
        })
      });
      const data = await res.json();
      if (data.emailDraft) {
        setSubject(data.emailDraft.subject);
        setBody(data.emailDraft.body);
      }
    } catch (err) {
      console.error('Failed to generate email draft:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = (newTone: 'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise') => {
    setTone(newTone);
    generateDraft(newTone);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSimulation = () => {
    if (!professor) return;
    setSendStatus('sending');
    setTimeout(() => {
      setSendStatus('sent');
      const draft: EmailDraft = {
        professorId: professor.id,
        professorName: professor.name,
        professorEmail: professor.email,
        subject,
        body,
        tone,
        status: 'Sent',
        createdAt: new Date().toISOString()
      };
      onSaveDraft(draft);
      setTimeout(() => {
        onClose();
      }, 1400);
    }, 1200);
  };

  if (!professor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-serif">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#06122b] via-brand-950 to-[#102a43] text-white flex items-center justify-between border-b border-brand-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Outreach & Cold Email Studio</h2>
              <p className="text-xs text-amber-200">
                To: <span className="font-semibold text-white">{professor.name}</span> ({professor.email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Tone Selector Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Select Email Tone & Style</span>
              {loading && (
                <span className="text-amber-500 flex items-center space-x-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini Drafting...</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Academic Professional', 'Enthusiastic & Detailed', 'Direct & Concise'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleToneChange(t)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    tone === t
                      ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Line Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Body Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Email Body (Editable Markdown/Text)</span>
              <span className="text-slate-400 font-normal">References: "{professor.recentPublications[0]?.title || 'Recent Research'}"</span>
            </div>
            <textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => generateDraft(tone)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              title="Regenerate Email"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleSendSimulation}
              disabled={sendStatus !== 'idle'}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md text-xs transition-all disabled:opacity-75"
            >
              {sendStatus === 'sending' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Email...</span>
                </>
              ) : sendStatus === 'sent' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Email Sent & Tracked!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send & Track Outreach</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
