import React, { useState } from 'react';
import { useInspector } from '../context/InspectorContext';
import { X, Copy, Check, Terminal, Code2, Compass, Sparkles, ExternalLink } from 'lucide-react';

export const InspectorDrawer: React.FC = () => {
  const { selectedElement, clearSelection, activeFrameworkTab, setActiveFrameworkTab } = useInspector();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!selectedElement) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm text-slate-100">
            Locator Inspector: <span className="text-emerald-400 font-mono">{selectedElement.elementLabel}</span>
          </span>
        </div>
        <button
          onClick={clearSelection}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2">
        <button
          onClick={() => setActiveFrameworkTab('playwright')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeFrameworkTab === 'playwright'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Python Playwright (Recommended)
        </button>
        <button
          onClick={() => setActiveFrameworkTab('selenium')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeFrameworkTab === 'selenium'
              ? 'border-indigo-400 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Python Selenium WebDriver
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
        {activeFrameworkTab === 'playwright' ? (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-medium text-emerald-400">Recommended User-Facing Locator</span>
                <button
                  onClick={() => copyToClipboard(selectedElement.playwrightRecommended, 'pw-rec')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                >
                  {copiedKey === 'pw-rec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'pw-rec' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 rounded-lg text-emerald-300 text-xs font-mono overflow-x-auto border border-emerald-950/50">
                {selectedElement.playwrightRecommended}
              </pre>
            </div>

            {selectedElement.testId && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Using data-testid</span>
                  <button
                    onClick={() => copyToClipboard(`page.get_by_test_id("${selectedElement.testId}")`, 'pw-testid')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                  >
                    {copiedKey === 'pw-testid' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <pre className="p-2 bg-slate-950 rounded-md text-slate-300 text-xs font-mono overflow-x-auto">
                  {`page.get_by_test_id("${selectedElement.testId}")`}
                </pre>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>CSS Locator fallback</span>
                <button
                  onClick={() => copyToClipboard(`page.locator("${selectedElement.css}")`, 'pw-css')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                >
                  {copiedKey === 'pw-css' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <pre className="p-2 bg-slate-950 rounded-md text-slate-300 text-xs font-mono overflow-x-auto">
                {`page.locator("${selectedElement.css}")`}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-medium text-indigo-400">Recommended Selenium Locator</span>
                <button
                  onClick={() => copyToClipboard(selectedElement.seleniumRecommended, 'sel-rec')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                >
                  {copiedKey === 'sel-rec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'sel-rec' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 rounded-lg text-indigo-300 text-xs font-mono overflow-x-auto border border-indigo-950/50">
                {selectedElement.seleniumRecommended}
              </pre>
            </div>

            {selectedElement.id && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>By.ID</span>
                  <button
                    onClick={() => copyToClipboard(`driver.find_element(By.ID, "${selectedElement.id}")`, 'sel-id')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                  >
                    {copiedKey === 'sel-id' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <pre className="p-2 bg-slate-950 rounded-md text-slate-300 text-xs font-mono overflow-x-auto">
                  {`driver.find_element(By.ID, "${selectedElement.id}")`}
                </pre>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>By.XPATH</span>
                <button
                  onClick={() => copyToClipboard(`driver.find_element(By.XPATH, "${selectedElement.xpath}")`, 'sel-xpath')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800"
                >
                  {copiedKey === 'sel-xpath' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <pre className="p-2 bg-slate-950 rounded-md text-slate-300 text-xs font-mono overflow-x-auto">
                {`driver.find_element(By.XPATH, "${selectedElement.xpath}")`}
              </pre>
            </div>
          </div>
        )}

        {selectedElement.note && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
            <span className="font-semibold text-amber-200">Testing Tip: </span>
            {selectedElement.note}
          </div>
        )}
      </div>
    </div>
  );
};
