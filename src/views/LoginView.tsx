import React, { useState } from 'react';
import { AuthState } from '../types';
import { MOCK_USERS } from '../data/dummyData';
import { Inspectable } from '../components/Inspectable';
import { Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Clock, Cookie, Database, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  authState: AuthState;
  onLogin: (username: string, pass: string, latencyMs: number) => Promise<boolean>;
  onLogout: () => void;
  onNavigateToGrid: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  authState,
  onLogin,
  onLogout,
  onNavigateToGrid,
}) => {
  const [username, setUsername] = useState('standard_user');
  const [password, setPassword] = useState('secret_sauce');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [latency, setLatency] = useState<number>(0);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const handleQuickFill = (userKey: keyof typeof MOCK_USERS) => {
    setUsername(userKey);
    setPassword('secret_sauce');
    setFieldErrors({});
    if (userKey === 'slow_user') {
      setLatency(3500);
    } else {
      setLatency(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await onLogin(username.trim(), password.trim(), latency);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Title & Automation Context Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Authentication &amp; Session Management Lab
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Practice locator strategies for inputs, buttons, checkboxes, validation banners, and handling asynchronous network latency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          {/* Quick preset selector buttons for automation testers */}
          <div className="mb-6 pb-5 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Quick Test Personas (Preset Credentials)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('standard_user')}
                data-testid="persona-standard"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                  username === 'standard_user'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <div className="font-semibold">standard_user</div>
                <div className="text-[10px] text-slate-400">Happy path</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('locked_user')}
                data-testid="persona-locked"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                  username === 'locked_user'
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <div className="font-semibold">locked_user</div>
                <div className="text-[10px] text-slate-400">Auth error</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('slow_user')}
                data-testid="persona-slow"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                  username === 'slow_user'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <div className="font-semibold">slow_user</div>
                <div className="text-[10px] text-slate-400">3.5s delay</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('problem_user')}
                data-testid="persona-problem"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                  username === 'problem_user'
                    ? 'bg-purple-500/15 border-purple-500/50 text-purple-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <div className="font-semibold">problem_user</div>
                <div className="text-[10px] text-slate-400">Boundary</div>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {authState.error && (
            <Inspectable
              strategy={{
                elementLabel: 'Login Error Alert Banner',
                id: 'login-error-message',
                testId: 'login-error-alert',
                css: '#login-error-message',
                xpath: "//*[@id='login-error-message']",
                playwrightRole: { role: 'alert' },
                playwrightRecommended: `expect(page.get_by_role("alert")).to_contain_text("locked out")`,
                seleniumRecommended: `WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.ID, "login-error-message")))`,
                note: 'Always test error alert accessibility by checking role="alert" or checking for aria-live regions.'
              }}
              className="mb-5"
            >
              <div
                id="login-error-message"
                data-testid="login-error-alert"
                role="alert"
                className="flex items-start gap-3 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1 font-medium">{authState.error}</div>
              </div>
            </Inspectable>
          )}

          {/* Success Banner if logged in */}
          {authState.isAuthenticated && authState.user && (
            <div className="mb-5 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Authenticated as <strong className="font-bold">{authState.user.name}</strong> ({authState.user.role})
                </span>
              </div>
              <button
                onClick={onNavigateToGrid}
                className="flex items-center gap-1 text-xs text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                <span>Go to Grid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} id="login-form" className="space-y-4" noValidate>
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-slate-300 mb-1.5">
                Username or Email
              </label>
              <Inspectable
                strategy={{
                  elementLabel: 'Username Input',
                  id: 'username',
                  name: 'username',
                  testId: 'username-input',
                  css: '#username',
                  xpath: "//input[@id='username']",
                  playwrightRecommended: `page.get_by_placeholder("Enter username").fill("standard_user")`,
                  seleniumRecommended: `driver.find_element(By.ID, "username").send_keys("standard_user")`,
                  note: 'Prefer page.get_by_placeholder or page.get_by_label in Playwright over raw CSS.'
                }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    data-testid="username-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                      fieldErrors.username
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                  />
                </div>
              </Inspectable>
              {fieldErrors.username && (
                <p id="username-error" className="text-xs text-rose-400 mt-1 font-mono">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <Inspectable
                strategy={{
                  elementLabel: 'Password Input',
                  id: 'password',
                  name: 'password',
                  testId: 'password-input',
                  css: '#password',
                  xpath: "//input[@id='password']",
                  playwrightRecommended: `page.get_by_placeholder("Enter password").fill("secret_sauce")`,
                  seleniumRecommended: `driver.find_element(By.ID, "password").send_keys("secret_sauce")`,
                  note: 'For security tests, verify that input type="password" masks characters.'
                }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    data-testid="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className={`w-full pl-9 pr-10 py-2 bg-slate-950 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                      fieldErrors.password
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    data-testid="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Inspectable>
              {fieldErrors.password && (
                <p id="password-error" className="text-xs text-rose-400 mt-1 font-mono">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox & Latency simulation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <Inspectable
                strategy={{
                  elementLabel: 'Remember Me Checkbox',
                  id: 'remember-me',
                  testId: 'remember-me-checkbox',
                  css: '#remember-me',
                  xpath: "//input[@id='remember-me']",
                  playwrightRecommended: `page.get_by_label("Remember this session").check()`,
                  seleniumRecommended: `driver.find_element(By.ID, "remember-me").click()`,
                  note: 'Test is_checked() or is_selected() before and after clicking.'
                }}
              >
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    id="remember-me"
                    name="remember-me"
                    data-testid="remember-me-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                  />
                  <span>Remember this session</span>
                </label>
              </Inspectable>

              {/* Latency selection */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Delay:</span>
                <select
                  id="latency-select"
                  data-testid="latency-select"
                  value={latency}
                  onChange={(e) => setLatency(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 font-mono focus:outline-none"
                >
                  <option value={0}>0 ms (Instant)</option>
                  <option value={1000}>1,000 ms (1s)</option>
                  <option value={2000}>2,000 ms (2s)</option>
                  <option value={3500}>3,500 ms (Slow 3.5s)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Inspectable
                strategy={{
                  elementLabel: 'Login Submit Button',
                  id: 'login-button',
                  testId: 'login-submit',
                  css: '#login-button',
                  xpath: "//button[@id='login-button']",
                  playwrightRole: { role: 'button', name: 'Sign In' },
                  playwrightRecommended: `page.get_by_role("button", name="Sign In").click()`,
                  seleniumRecommended: `driver.find_element(By.ID, "login-button").click()`,
                  note: 'When delay is active, automation scripts must assert loading spinner or wait for button enablement.'
                }}
              >
                <button
                  type="submit"
                  id="login-button"
                  data-testid="login-submit"
                  disabled={authState.isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {authState.isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Authenticating (Simulating Latency)...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </Inspectable>
            </div>
          </form>

          {authState.isAuthenticated && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onLogout}
                data-testid="btn-logout"
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Sign out current user
              </button>
            </div>
          )}
        </div>

        {/* Right Info: Live Session Storage & Cookie Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <Cookie className="w-4 h-4 text-amber-400" />
              <span>Browser State &amp; Cookies Inspector</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automation tests frequently verify or inject session cookies and local storage tokens to bypass repetitive login UI clicks.
            </p>

            {/* Cookies list */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Simulated Session Cookies
              </span>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">session_token:</span>
                  <span className="text-emerald-400 truncate max-w-[180px]">
                    {authState.isAuthenticated ? authState.user?.token : '(none)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">auth_username:</span>
                  <span className="text-indigo-400">{authState.user?.username || '(none)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">remember_device:</span>
                  <span className="text-slate-300">{rememberMe ? 'true' : 'false'}</span>
                </div>
              </div>
            </div>

            {/* Playwright / Selenium cookie code */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                How to set cookies via Automation
              </span>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2">
                <div className="text-emerald-400"># Playwright context.add_cookies:</div>
                <div className="text-slate-400">
                  context.add_cookies([&#123;&quot;name&quot;: &quot;session_token&quot;, &quot;value&quot;: &quot;xyz&quot;, &quot;url&quot;: &quot;http://localhost:3000&quot;&#125;])
                </div>
                <div className="text-indigo-400 pt-1"># Selenium driver.add_cookie:</div>
                <div className="text-slate-400">
                  driver.add_cookie(&#123;&quot;name&quot;: &quot;session_token&quot;, &quot;value&quot;: &quot;xyz&quot;&#125;)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
