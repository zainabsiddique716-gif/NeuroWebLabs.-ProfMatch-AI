// components/EmailModal.tsx
import React, { useState, useEffect } from 'react';
import { ProfessorProfile } from '@/types/academic';
import { Mail, Copy, Check, RefreshCw, Sparkles, Send, Edit3 } from 'lucide-react';

interface Props {
  professor: ProfessorProfile | null;
  userInterest: string;
  userProposal?: string;
  studyLevel?: string;
  userBio?: string;
  onClose: () => void;
}

export function EmailModal({ professor, userInterest, userProposal, studyLevel, userBio, onClose }: Props) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [tone, setTone] = useState<'Academic Professional' | 'Enthusiastic & Detailed' | 'Direct & Concise'>('Academic Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'Draft' | 'Scheduled' | 'Sent'>('Draft');

  const loadDraft = async (selectedTone = tone) => {
    if (!professor) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/email-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professor,
          userInterest,
          userProposal,
          studyLevel,
          userBio,
          tone: selectedTone,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate email');
      const data = await res.json();
      setSubject(data.emailDraft.subject || '');
      setBody(data.emailDraft.body || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (professor) {
      loadDraft();
    }
  }, [professor]);

  if (!professor) return null;

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Personalized Academic Outreach Email</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Recipient: <strong className="text-slate-800">{professor.name}</strong> ({professor.university})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Tone Selection & Regenerate Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Tone:</span>
            {(['Academic Professional', 'Enthusiastic & Detailed', 'Direct & Concise'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTone(t);
                  loadDraft(t);
                }}
                disabled={isGenerating}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  tone === t ? 'bg-blue-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadDraft(tone)}
            disabled={isGenerating}
            className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Editable Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isGenerating}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Editable Email Body */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Body</label>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={isGenerating}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none font-sans"
          />
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Status: <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded">{status}</span>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Email'}</span>
            </button>
            <button
              onClick={() => {
                setStatus('Sent');
                alert('Email marked as sent and saved to outreach log.');
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Mark as Sent</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
