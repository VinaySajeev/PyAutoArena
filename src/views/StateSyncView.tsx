import React, { useState, useEffect, useRef } from 'react';
import { Inspectable } from '../components/Inspectable';
import {
  Clock,
  RefreshCw,
  Layers,
  Box,
  MessageSquare,
  MousePointer,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const StateSyncView: React.FC = () => {
  // 1. Dynamic Element (AJAX Delay)
  const [ajaxDelay, setAjaxDelay] = useState<number>(2000);
  const [isAjaxLoading, setIsAjaxLoading] = useState(false);
  const [ajaxResult, setAjaxResult] = useState<string | null>(null);

  // 2. Stale Element Simulation
  const [staleCounter, setStaleCounter] = useState(0);
  const [staleKey, setStaleKey] = useState(0);

  // 3. Shadow DOM Host Ref
  const shadowHostRef = useRef<HTMLDivElement | null>(null);
  const [shadowEventMessage, setShadowEventMessage] = useState<string>('Awaiting shadow DOM interaction');

  // 4. Native Dialogs Results
  const [dialogResult, setDialogResult] = useState<string>('No dialog triggered yet');

  // 5. Mouse Actions State
  const [isHovered, setIsHovered] = useState(false);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuSelection, setContextMenuSelection] = useState<string | null>(null);

  // Handle AJAX Trigger
  const triggerAjax = () => {
    setIsAjaxLoading(true);
    setAjaxResult(null);
    setTimeout(() => {
      setIsAjaxLoading(false);
      setAjaxResult(`Async Payload Loaded Successfully (Timestamp: ${new Date().toLocaleTimeString()})`);
    }, ajaxDelay);
  };

  // Handle Stale Node Swap
  const triggerDomSwap = () => {
    setStaleKey((prev) => prev + 1);
    setStaleCounter((prev) => prev + 1);
  };

  // Mount real Shadow DOM Component
  useEffect(() => {
    if (shadowHostRef.current && !shadowHostRef.current.shadowRoot) {
      const shadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `
        <style>
          .shadow-container {
            padding: 14px;
            background: #020617;
            border: 1px dashed #10b981;
            border-radius: 8px;
            font-family: monospace;
            color: #e2e8f0;
          }
          .shadow-title {
            color: #34d399;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .shadow-input {
            width: 90%;
            padding: 6px 10px;
            background: #0f172a;
            border: 1px solid #334155;
            color: #f8fafc;
            border-radius: 4px;
            font-size: 11px;
            margin-bottom: 8px;
          }
          .shadow-btn {
            background: #059669;
            color: white;
            border: none;
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            font-weight: 600;
          }
          .shadow-btn:hover {
            background: #10b981;
          }
        </style>
        <div class="shadow-container">
          <div class="shadow-title">#shadow-root (open)</div>
          <input type="text" id="shadow-inner-input" placeholder="Type text inside Shadow Root..." class="shadow-input" />
          <br />
          <button id="shadow-submit-btn" class="shadow-btn">Dispatch Shadow Event</button>
        </div>
      `;

      const btn = shadowRoot.querySelector('#shadow-submit-btn');
      const input = shadowRoot.querySelector('#shadow-inner-input') as HTMLInputElement;

      if (btn) {
        btn.addEventListener('click', () => {
          const val = input?.value || 'empty';
          setShadowEventMessage(`Shadow DOM event fired! Input value was: "${val}"`);
        });
      }
    }
  }, []);

  // Native Dialog Handlers
  const handleNativeAlert = () => {
    window.alert('PyAutoArena: This is a standard JavaScript window.alert() dialog.');
    setDialogResult('Handled: window.alert() dismissed');
  };

  const handleNativeConfirm = () => {
    const userChoice = window.confirm('PyAutoArena: Are you sure you want to proceed with this automation action?');
    setDialogResult(`Confirmed: ${userChoice ? 'OK (True)' : 'Cancel (False)'}`);
  };

  const handleNativePrompt = () => {
    const userInput = window.prompt('PyAutoArena: Enter your automation test ID:', 'TEST_RUN_404');
    setDialogResult(`Prompt response: ${userInput !== null ? `"${userInput}"` : 'Dismissed (Null)'}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          State Synchronization &amp; Automation Edge Cases Lab
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Master the toughest automation scenarios: dynamic asynchronous waiting, stale DOM elements, shadow DOM piercing, iFrames, browser dialogs, and mouse gestures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SCENARIO 1: DYNAMIC AJAX WAIT */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              1. Asynchronous Element Loading &amp; Waits
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulates API delay. Tests WebDriverWait in Selenium vs auto-wait in Playwright.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-300">Set Delay:</label>
            <select
              id="ajax-delay-select"
              data-testid="ajax-delay-select"
              value={ajaxDelay}
              onChange={(e) => setAjaxDelay(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1 font-mono"
            >
              <option value={500}>500 ms (Fast)</option>
              <option value={2000}>2,000 ms (2 seconds)</option>
              <option value={4000}>4,000 ms (4 seconds)</option>
            </select>

            <Inspectable
              strategy={{
                elementLabel: 'Trigger Async Operation Button',
                id: 'btn-trigger-ajax',
                testId: 'trigger-ajax-btn',
                css: '#btn-trigger-ajax',
                xpath: "//button[@id='btn-trigger-ajax']",
                playwrightRecommended: `page.get_by_test_id("trigger-ajax-btn").click()\nexpect(page.get_by_test_id("async-loaded-content")).to_be_visible()`,
                seleniumRecommended: `driver.find_element(By.ID, "btn-trigger-ajax").click()\nWebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "async-loaded-content")))`,
                note: 'In Selenium, failing to write WebDriverWait will throw NoSuchElementException.'
              }}
            >
              <button
                id="btn-trigger-ajax"
                data-testid="trigger-ajax-btn"
                onClick={triggerAjax}
                disabled={isAjaxLoading}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                {isAjaxLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Fetch Async Element</span>
              </button>
            </Inspectable>
          </div>

          {/* Dynamic Box */}
          <div className="min-h-[70px] p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
            {isAjaxLoading ? (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono" data-testid="async-spinner">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating backend latency ({ajaxDelay}ms)...</span>
              </div>
            ) : ajaxResult ? (
              <div
                id="async-loaded-content"
                data-testid="async-loaded-content"
                className="text-xs font-mono text-emerald-400 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded w-full text-center"
              >
                {ajaxResult}
              </div>
            ) : (
              <span className="text-xs text-slate-500">Click button above to trigger asynchronous appearance.</span>
            )}
          </div>
        </div>

        {/* SCENARIO 2: STALE ELEMENT TRAP */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              2. StaleElementReferenceException Simulator
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Clicking swaps the DOM node with a brand-new instance.
            </p>
          </div>

          <div className="space-y-3">
            <Inspectable
              strategy={{
                elementLabel: 'DOM Swap Trigger Button',
                id: 'trigger-dom-swap',
                testId: 'btn-trigger-swap',
                css: '#trigger-dom-swap',
                xpath: "//button[@id='trigger-dom-swap']",
                playwrightRecommended: `page.get_by_role("button", name="Replace Element in DOM").click()`,
                seleniumRecommended: `driver.find_element(By.ID, "trigger-dom-swap").click()`,
                note: 'In Selenium, calling .text on old WebElement afterwards raises StaleElementReferenceException.'
              }}
            >
              <button
                id="trigger-dom-swap"
                data-testid="btn-trigger-swap"
                onClick={triggerDomSwap}
                className="w-full py-2 px-3 bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Replace Element in DOM (Trigger Stale Node)
              </button>
            </Inspectable>

            {/* Target element that changes key */}
            <div
              key={staleKey}
              id="dynamic-target"
              data-testid="dynamic-target-node"
              className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300"
            >
              <div className="text-emerald-400 font-semibold">Node Instance ID: #dom-node-{staleKey}</div>
              <div className="text-slate-400 mt-0.5">Re-render Cycle Count: {staleCounter}</div>
            </div>

            <p className="text-[11px] text-slate-400">
              Notice: Playwright locators are lazy evaluators, so <code className="text-emerald-400 font-mono">page.locator(&quot;#dynamic-target&quot;)</code> never goes stale!
            </p>
          </div>
        </div>

        {/* SCENARIO 3: SHADOW DOM SANDBOX */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Box className="w-4 h-4 text-emerald-400" />
              3. Open Shadow DOM Sandbox
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Interact with custom web component inside #shadow-root (open)
            </p>
          </div>

          {/* Real Shadow DOM Web Component Host */}
          <div ref={shadowHostRef} id="shadow-host-root" data-testid="shadow-host" />

          {/* Event Status */}
          <div
            id="shadow-event-status"
            data-testid="shadow-event-status"
            className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300"
          >
            {shadowEventMessage}
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed font-mono">
            <span className="text-emerald-400">Playwright: </span>page.locator(&quot;#shadow-inner-input&quot;).fill(&quot;...&quot;) (Automatic!)<br />
            <span className="text-indigo-400">Selenium: </span>driver.find_element(By.ID, &quot;shadow-host-root&quot;).shadow_root.find_element(...)
          </div>
        </div>

        {/* SCENARIO 4: IFRAMES SANDBOX */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              4. Embedded iFrame Sandbox
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Switching frame context in Selenium vs frame_locator in Playwright
            </p>
          </div>

          {/* Inline iFrame */}
          <iframe
            id="iframe-sandbox"
            data-testid="iframe-sandbox"
            title="Automation iFrame Sandbox"
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body {
                      font-family: sans-serif;
                      background: #020617;
                      color: #cbd5e1;
                      padding: 12px;
                      margin: 0;
                    }
                    input {
                      width: 90%;
                      padding: 6px;
                      background: #0f172a;
                      border: 1px solid #334155;
                      color: white;
                      border-radius: 4px;
                      font-size: 11px;
                      margin-bottom: 8px;
                    }
                    button {
                      background: #4f46e5;
                      color: white;
                      border: none;
                      padding: 5px 12px;
                      border-radius: 4px;
                      font-size: 11px;
                      cursor: pointer;
                    }
                    #iframe-result {
                      margin-top: 8px;
                      font-family: monospace;
                      font-size: 11px;
                      color: #818cf8;
                    }
                  </style>
                </head>
                <body>
                  <div style="font-size: 12px; font-weight: bold; margin-bottom: 6px; color: #a5b4fc;">
                    Inside Nested &lt;iframe&gt; Document
                  </div>
                  <input type="text" id="iframe-input" placeholder="Type inside iframe..." />
                  <br />
                  <button id="iframe-submit-btn" onclick="document.getElementById('iframe-result').innerText = 'Iframe submitted: ' + document.getElementById('iframe-input').value">
                    Submit in Frame
                  </button>
                  <div id="iframe-result">Status: Initialized</div>
                </body>
              </html>
            `}
            className="w-full h-36 bg-slate-950 border border-slate-700 rounded-lg"
          />

          <div className="text-[11px] text-slate-400 font-mono">
            <span className="text-emerald-400">Playwright: </span>page.frame_locator(&quot;#iframe-sandbox&quot;).get_by_role(&quot;button&quot;).click()<br />
            <span className="text-indigo-400">Selenium: </span>driver.switch_to.frame(&quot;iframe-sandbox&quot;)
          </div>
        </div>

        {/* SCENARIO 5: NATIVE BROWSER DIALOGS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              5. Native Browser Dialogs (Alert, Confirm, Prompt)
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Handling native JS window dialogs without hanging test execution
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              id="btn-trigger-alert"
              data-testid="btn-trigger-alert"
              onClick={handleNativeAlert}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium"
            >
              window.alert()
            </button>

            <button
              id="btn-trigger-confirm"
              data-testid="btn-trigger-confirm"
              onClick={handleNativeConfirm}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium"
            >
              window.confirm()
            </button>

            <button
              id="btn-trigger-prompt"
              data-testid="btn-trigger-prompt"
              onClick={handleNativePrompt}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium"
            >
              window.prompt()
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[11px]">Dialog Result:</span>
            <span id="dialog-result-output" data-testid="dialog-result-text" className="text-emerald-400 font-semibold">
              {dialogResult}
            </span>
          </div>
        </div>

        {/* SCENARIO 6: MOUSE ACTIONS & GESTURES */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-indigo-400" />
              6. Mouse Gestures (Hover, DblClick, Context Menu)
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              ActionChains in Selenium vs direct mouse actions in Playwright
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Hover Target */}
            <div
              id="hover-target"
              data-testid="hover-target"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              <div className="text-xs font-semibold text-slate-300">Hover Over Me</div>
              <div
                id="hover-reveal-content"
                data-testid="hover-reveal-content"
                className={`mt-1 text-xs font-mono transition-opacity ${
                  isHovered ? 'text-emerald-400 opacity-100' : 'text-slate-600 opacity-0'
                }`}
              >
                Hover Menu Activated!
              </div>
            </div>

            {/* Double Click Target */}
            <div
              id="dblclick-target"
              data-testid="dblclick-target"
              onDoubleClick={() => setIsDoubleClicked(!isDoubleClicked)}
              className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center cursor-pointer select-none hover:border-indigo-500/50 transition-colors"
            >
              <div className="text-xs font-semibold text-slate-300">Double Click Target</div>
              <div
                id="dblclick-status"
                data-testid="dblclick-status"
                className={`mt-1 text-xs font-mono ${
                  isDoubleClicked ? 'text-indigo-400 font-bold' : 'text-slate-500'
                }`}
              >
                {isDoubleClicked ? 'Double-Clicked State (Active)' : 'Single Click / Idle'}
              </div>
            </div>
          </div>

          {/* Context Click Area */}
          <div
            id="context-menu-zone"
            data-testid="context-menu-zone"
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenuPos({ x: e.clientX, y: e.clientY });
            }}
            className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-center cursor-context-menu text-xs text-slate-400"
          >
            Right-Click (Context Click) inside this box to trigger context menu.
            {contextMenuSelection && (
              <div className="text-emerald-400 font-mono mt-1">
                Selected: {contextMenuSelection}
              </div>
            )}
          </div>

          {/* Fake Context Menu */}
          {contextMenuPos && (
            <div
              id="custom-context-menu"
              data-testid="custom-context-menu"
              className="p-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs space-y-0.5"
            >
              <button
                onClick={() => {
                  setContextMenuSelection('Action: Inspect Element');
                  setContextMenuPos(null);
                }}
                className="w-full text-left px-3 py-1 text-slate-200 hover:bg-slate-800 rounded"
              >
                Inspect Element
              </button>
              <button
                onClick={() => {
                  setContextMenuSelection('Action: Copy XPath');
                  setContextMenuPos(null);
                }}
                className="w-full text-left px-3 py-1 text-slate-200 hover:bg-slate-800 rounded"
              >
                Copy XPath
              </button>
              <button
                onClick={() => setContextMenuPos(null)}
                className="w-full text-left px-3 py-1 text-rose-400 hover:bg-slate-800 rounded"
              >
                Close Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
