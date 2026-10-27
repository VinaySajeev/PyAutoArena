import React, { useState } from 'react';
import { TEST_CHALLENGES } from '../data/dummyData';
import { TestChallenge } from '../types';
import {
  Trophy,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Sparkles,
  ArrowRight,
  Flame,
  Code,
  Compass,
} from 'lucide-react';

export const ChallengesView: React.FC<{ onNavigateToView: (view: any) => void }> = ({
  onNavigateToView,
}) => {
  const [challenges, setChallenges] = useState<TestChallenge[]>(TEST_CHALLENGES);
  const [selectedChallengeId, setSelectedChallengeId] = useState(TEST_CHALLENGES[0].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [frameworkView, setFrameworkView] = useState<'both' | 'playwright' | 'selenium'>('both');

  const activeChallenge =
    challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleChallengeComplete = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            Automation Testing Challenges &amp; Labs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hands-on test automation interview &amp; certification scenarios comparing Python Selenium with Python Playwright.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Your Progress</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {completedCount} / {challenges.length} Completed
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">
            {Math.round((completedCount / challenges.length) * 100)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List of Challenges */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Challenge Index
          </span>

          <div className="space-y-2">
            {challenges.map((c) => {
              const isSelected = c.id === selectedChallengeId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedChallengeId(c.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-md text-white'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      CHALLENGE #{c.number}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        c.difficulty === 'Beginner'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : c.difficulty === 'Intermediate'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-purple-500/15 text-purple-400'
                      }`}
                    >
                      {c.difficulty}
                    </span>
                  </div>

                  <div className="text-xs font-semibold">{c.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>Category: {c.category}</span>
                    {c.completed && (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  CHALLENGE #{activeChallenge.number}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">{activeChallenge.category}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{activeChallenge.title}</h2>
            </div>

            <button
              onClick={() => toggleChallengeComplete(activeChallenge.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeChallenge.completed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{activeChallenge.completed ? 'Marked Completed' : 'Mark as Completed'}</span>
            </button>
          </div>

          {/* Description & Tasks */}
          <div className="space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeChallenge.description}
            </p>

            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Verification Checklist (Tasks to automate)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeChallenge.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-mono text-xs">{idx + 1}.</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Target Locators Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Target Element Locators
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Element</th>
                    <th className="py-2 px-3">data-testid</th>
                    <th className="py-2 px-3">CSS / ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {activeChallenge.targetLocators.map((loc) => (
                    <tr key={loc.testId}>
                      <td className="py-2 px-3 font-sans font-medium text-slate-200">{loc.label}</td>
                      <td className="py-2 px-3 text-emerald-400">{loc.testId}</td>
                      <td className="py-2 px-3 text-indigo-400">{loc.css}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Difference Insight Box */}
          <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300">Framework Difference: </strong>
              {activeChallenge.explanation}
            </div>
          </div>

          {/* Solution Code Blocks */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Automated Test Solutions (Python)
              </span>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setFrameworkView('both')}
                  className={`px-2 py-0.5 rounded ${
                    frameworkView === 'both' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  Both
                </button>
                <button
                  onClick={() => setFrameworkView('playwright')}
                  className={`px-2 py-0.5 rounded ${
                    frameworkView === 'playwright' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Playwright
                </button>
                <button
                  onClick={() => setFrameworkView('selenium')}
                  className={`px-2 py-0.5 rounded ${
                    frameworkView === 'selenium' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Selenium
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Playwright Solution */}
              {(frameworkView === 'both' || frameworkView === 'playwright') && (
                <div className={`bg-slate-950 border border-slate-800 rounded-xl overflow-hidden ${frameworkView === 'playwright' ? 'lg:col-span-2' : ''}`}>
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Python Playwright
                    </span>
                    <button
                      onClick={() => handleCopy(activeChallenge.playwrightCode, 'sol-pw')}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                    >
                      {copiedKey === 'sol-pw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="p-3 text-xs font-mono text-emerald-200/90 overflow-x-auto leading-relaxed">
                    {activeChallenge.playwrightCode}
                  </pre>
                </div>
              )}

              {/* Selenium Solution */}
              {(frameworkView === 'both' || frameworkView === 'selenium') && (
                <div className={`bg-slate-950 border border-slate-800 rounded-xl overflow-hidden ${frameworkView === 'selenium' ? 'lg:col-span-2' : ''}`}>
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800">
                    <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" /> Python Selenium 4
                    </span>
                    <button
                      onClick={() => handleCopy(activeChallenge.seleniumCode, 'sol-sel')}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                    >
                      {copiedKey === 'sol-sel' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="p-3 text-xs font-mono text-indigo-200/90 overflow-x-auto leading-relaxed">
                    {activeChallenge.seleniumCode}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
