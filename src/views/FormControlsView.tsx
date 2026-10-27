import React, { useState, useEffect } from 'react';
import { CASCADING_GEO_DATA } from '../data/dummyData';
import { Inspectable } from '../components/Inspectable';
import {
  ChevronDown,
  Check,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Search,
  X,
  Sliders,
} from 'lucide-react';

export const FormControlsView: React.FC = () => {
  // 1. Standard Dropdown State
  const [selectedStandardCountry, setSelectedStandardCountry] = useState('Germany');

  // 2. Custom Multi-Select Dropdown State
  const SKILL_OPTIONS = ['Python', 'Selenium 4', 'Playwright', 'Pytest', 'Docker', 'Allure', 'CI/CD Pipelines', 'Appium'];
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'Playwright']);

  // 3. Cascading Dropdown State
  const [cascadingCountry, setCascadingCountry] = useState('United States');
  const [cascadingState, setCascadingState] = useState('California');
  const [cascadingCity, setCascadingCity] = useState('San Francisco');
  const [isStateLoading, setIsStateLoading] = useState(false);

  // 4. Radio Buttons State
  const [selectedTier, setSelectedTier] = useState('pro');
  const [selectedNotificationMethod, setSelectedNotificationMethod] = useState('email');

  // 5. Checkboxes State
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [frameworkInterests, setFrameworkInterests] = useState<string[]>(['pytest', 'playwright-python']);

  // 6. Real-Time Dynamic Validation Form State
  const [valUsername, setValUsername] = useState('');
  const [valEmail, setValEmail] = useState('');
  const [valPassword, setValPassword] = useState('');
  const [valExperienceYears, setValExperienceYears] = useState(3);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [formSubmittedSuccessfully, setFormSubmittedSuccessfully] = useState(false);

  // Handle Cascading Country change with simulated async network delay
  const handleCascadingCountryChange = (country: string) => {
    setCascadingCountry(country);
    setIsStateLoading(true);
    setTimeout(() => {
      const states = CASCADING_GEO_DATA[country]?.states || [];
      const firstState = states[0]?.name || '';
      const firstCity = states[0]?.cities[0] || '';
      setCascadingState(firstState);
      setCascadingCity(firstCity);
      setIsStateLoading(false);
    }, 600);
  };

  const handleCascadingStateChange = (stateName: string) => {
    setCascadingState(stateName);
    const states = CASCADING_GEO_DATA[cascadingCountry]?.states || [];
    const foundState = states.find((s) => s.name === stateName);
    setCascadingCity(foundState?.cities[0] || '');
  };

  // Asynchronous Username Checker (debounced)
  useEffect(() => {
    if (!valUsername.trim()) {
      setUsernameAvailability('idle');
      return;
    }

    setUsernameAvailability('checking');
    const timer = setTimeout(() => {
      const reserved = ['admin', 'root', 'superuser', 'tester', 'test'];
      if (reserved.includes(valUsername.toLowerCase().trim())) {
        setUsernameAvailability('taken');
      } else {
        setUsernameAvailability('available');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [valUsername]);

  // Real-time password criteria
  const pwdHasLength = valPassword.length >= 8;
  const pwdHasUpper = /[A-Z]/.test(valPassword);
  const pwdHasNumber = /[0-9]/.test(valPassword);
  const pwdHasSpecial = /[^A-Za-z0-9]/.test(valPassword);
  const isPasswordValid = pwdHasLength && pwdHasUpper && pwdHasNumber && pwdHasSpecial;

  // Real-time email criteria
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valEmail);

  // Overall form validity
  const isDynamicFormValid =
    usernameAvailability === 'available' &&
    isEmailValid &&
    isPasswordValid &&
    valExperienceYears >= 1 &&
    agreedTerms;

  const handleDynamicFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDynamicFormValid) return;
    setFormSubmittedSuccessfully(true);
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleFrameworkInterest = (item: string) => {
    if (frameworkInterests.includes(item)) {
      setFrameworkInterests(frameworkInterests.filter((f) => f !== item));
    } else {
      setFrameworkInterests([...frameworkInterests, item]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Form Controls &amp; Real-Time Validation Lab
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Practice locator strategies for standard HTML selects, custom DOM dropdowns, cascading options, hidden radio inputs, indeterminate checkboxes, and live async validations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 1: DROPDOWNS LAB */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              1. Dropdowns &amp; Select Elements
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Standard native select vs. custom div/ul/li searchable multiselect
            </p>
          </div>

          {/* Standard Native Select */}
          <div className="space-y-2">
            <label htmlFor="country-select" className="block text-xs font-medium text-slate-300">
              Standard HTML &lt;select&gt; (Country)
            </label>
            <Inspectable
              strategy={{
                elementLabel: 'Native Country Select',
                id: 'country-select',
                testId: 'native-country-select',
                css: '#country-select',
                xpath: "//select[@id='country-select']",
                playwrightRecommended: `page.locator("#country-select").select_option("Germany")`,
                seleniumRecommended: `Select(driver.find_element(By.ID, "country-select")).select_by_visible_text("Germany")`,
                note: 'In Selenium, always wrap native select with the Select(element) support class.'
              }}
            >
              <select
                id="country-select"
                data-testid="native-country-select"
                value={selectedStandardCountry}
                onChange={(e) => setSelectedStandardCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="United States">United States</option>
                <option value="Germany">Germany</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="India">India</option>
                <option value="Canada">Canada</option>
                <option value="Japan">Japan</option>
                <option value="Australia">Australia</option>
              </select>
            </Inspectable>
            <span className="text-[11px] text-slate-500 font-mono block">
              Selected value: <strong className="text-emerald-400">{selectedStandardCountry}</strong>
            </span>
          </div>

          {/* Custom Searchable Multi-Select Dropdown */}
          <div className="space-y-2 relative">
            <label className="block text-xs font-medium text-slate-300">
              Custom Searchable Multi-Select (Div / List based)
            </label>
            <Inspectable
              strategy={{
                elementLabel: 'Custom Dropdown Trigger',
                id: 'custom-multiselect-trigger',
                testId: 'custom-multiselect-trigger',
                css: '#custom-multiselect-trigger',
                xpath: "//button[@id='custom-multiselect-trigger']",
                playwrightRecommended: `page.get_by_test_id("custom-multiselect-trigger").click()`,
                seleniumRecommended: `driver.find_element(By.ID, "custom-multiselect-trigger").click()`,
                note: 'Non-native select! You must click trigger to expand, then click list items inside ul.'
              }}
            >
              <div
                id="custom-multiselect-trigger"
                data-testid="custom-multiselect-trigger"
                tabIndex={0}
                onClick={() => setIsCustomDropdownOpen(!isCustomDropdownOpen)}
                className="w-full min-h-[38px] bg-slate-950 border border-slate-700 rounded-lg p-1.5 flex flex-wrap items-center justify-between gap-1.5 cursor-pointer hover:border-slate-600 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-1">
                  {selectedSkills.length === 0 ? (
                    <span className="text-xs text-slate-500 pl-1">Select automation skills...</span>
                  ) : (
                    selectedSkills.map((s) => (
                      <span
                        key={s}
                        data-testid={`selected-badge-${s.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        className="inline-flex items-center gap-1 bg-slate-800 text-emerald-300 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSkill(s);
                          }}
                          className="hover:text-rose-400"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </Inspectable>

            {/* Dropdown Menu */}
            {isCustomDropdownOpen && (
              <div
                id="custom-dropdown-panel"
                data-testid="custom-dropdown-panel"
                className="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 space-y-2"
              >
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
                  <input
                    type="text"
                    id="multiselect-search-input"
                    data-testid="multiselect-search-input"
                    value={customSearchQuery}
                    onChange={(e) => setCustomSearchQuery(e.target.value)}
                    placeholder="Filter skills..."
                    className="w-full pl-8 pr-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </div>

                <ul
                  id="custom-dropdown-items"
                  data-testid="custom-dropdown-items"
                  className="max-h-40 overflow-y-auto space-y-0.5"
                >
                  {SKILL_OPTIONS.filter((opt) =>
                    opt.toLowerCase().includes(customSearchQuery.toLowerCase())
                  ).map((option) => {
                    const isSelected = selectedSkills.includes(option);
                    return (
                      <li
                        key={option}
                        onClick={() => toggleSkill(option)}
                        data-testid={`skill-option-${option.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        className={`px-2.5 py-1.5 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Cascading Dependent Dropdowns */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                Cascading Dependent Dropdowns (Async Update)
              </label>
              {isStateLoading && (
                <span className="text-[10px] font-mono text-amber-400 animate-pulse">
                  Updating states...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Country Select */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Country</label>
                <select
                  id="cascading-country"
                  data-testid="cascading-country-select"
                  value={cascadingCountry}
                  onChange={(e) => handleCascadingCountryChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  {Object.keys(CASCADING_GEO_DATA).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Select (Async) */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">State / Province</label>
                <select
                  id="cascading-state"
                  data-testid="cascading-state-select"
                  value={cascadingState}
                  disabled={isStateLoading}
                  onChange={(e) => handleCascadingStateChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1.5 disabled:opacity-50 focus:outline-none focus:border-emerald-500"
                >
                  {(CASCADING_GEO_DATA[cascadingCountry]?.states || []).map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Select */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">City</label>
                <select
                  id="cascading-city"
                  data-testid="cascading-city-select"
                  value={cascadingCity}
                  onChange={(e) => setCascadingCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  {(
                    (CASCADING_GEO_DATA[cascadingCountry]?.states || []).find(
                      (s) => s.name === cascadingState
                    )?.cities || []
                  ).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              Selected: {cascadingCity}, {cascadingState}, {cascadingCountry}
            </p>
          </div>
        </div>

        {/* SECTION 2: RADIOS & CHECKBOXES LAB */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              2. Radio Buttons &amp; Checkboxes
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Testing native radios, styled hidden-input tiles, and grouped checkboxes
            </p>
          </div>

          {/* Standard Native Radios */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Native Radio Group (Notification Method)
            </label>
            <div className="flex flex-wrap gap-4 pt-1">
              {[
                { id: 'radio-notify-email', value: 'email', label: 'Email' },
                { id: 'radio-notify-sms', value: 'sms', label: 'SMS Alerts' },
                { id: 'radio-notify-slack', value: 'slack', label: 'Slack Webhook' },
              ].map((opt) => (
                <Inspectable
                  key={opt.value}
                  strategy={{
                    elementLabel: `Radio option: ${opt.label}`,
                    id: opt.id,
                    name: 'notification-method',
                    testId: `radio-${opt.value}`,
                    css: `#${opt.id}`,
                    xpath: `//input[@id='${opt.id}']`,
                    playwrightRecommended: `page.get_by_label("${opt.label}").check()`,
                    seleniumRecommended: `driver.find_element(By.ID, "${opt.id}").click()`,
                    note: 'Verify with is_checked() / is_selected().'
                  }}
                  inlineBadge={false}
                >
                  <label htmlFor={opt.id} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="radio"
                      id={opt.id}
                      name="notification-method"
                      data-testid={`radio-${opt.value}`}
                      value={opt.value}
                      checked={selectedNotificationMethod === opt.value}
                      onChange={() => setSelectedNotificationMethod(opt.value)}
                      className="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>{opt.label}</span>
                  </label>
                </Inspectable>
              ))}
            </div>
          </div>

          {/* Custom Styled Hidden-Input Radio Tiles */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300">
              Custom Styled Radio Tiles (Input is hidden, tests label or force=True)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'tier-starter', value: 'starter', label: 'Starter', price: '$0/mo' },
                { id: 'tier-pro', value: 'pro', label: 'Pro SDET', price: '$49/mo' },
                { id: 'tier-enterprise', value: 'enterprise', label: 'Enterprise', price: '$199/mo' },
              ].map((tier) => {
                const isSelected = selectedTier === tier.value;
                return (
                  <label
                    key={tier.value}
                    htmlFor={tier.id}
                    data-testid={`tile-label-${tier.value}`}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {/* The input is hidden via sr-only to simulate custom UI designs */}
                    <input
                      type="radio"
                      id={tier.id}
                      name="pricing-tier"
                      data-testid={`tile-input-${tier.value}`}
                      value={tier.value}
                      checked={isSelected}
                      onChange={() => setSelectedTier(tier.value)}
                      className="sr-only"
                    />
                    <div className="text-xs font-semibold">{tier.label}</div>
                    <div className="text-[11px] font-mono text-emerald-400 mt-0.5">{tier.price}</div>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              Automation tip: In Playwright use <code className="text-emerald-400 font-mono">page.locator(&quot;#tier-pro&quot;).check(force=True)</code> or click the label.
            </p>
          </div>

          {/* Checkboxes Group */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300">
              Checkbox Selection Group
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'chk-pytest', value: 'pytest', label: 'Pytest Fixtures' },
                { id: 'chk-playwright', value: 'playwright-python', label: 'Playwright Python' },
                { id: 'chk-selenium', value: 'selenium-webdriver', label: 'Selenium 4' },
                { id: 'chk-behave', value: 'bdd-behave', label: 'Behave BDD' },
              ].map((item) => (
                <label key={item.value} htmlFor={item.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    id={item.id}
                    data-testid={`chk-${item.value}`}
                    checked={frameworkInterests.includes(item.value)}
                    onChange={() => toggleFrameworkInterest(item.value)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: REAL-TIME DYNAMIC VALIDATION FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            3. Real-Time Dynamic Validation Form
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Submit button is dynamically disabled until live asynchronous username availability, email format, password complexity, and terms are 100% satisfied.
          </p>
        </div>

        {formSubmittedSuccessfully && (
          <div
            id="validation-success-banner"
            data-testid="validation-success-banner"
            role="status"
            className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>
                Form verified and submitted successfully! All real-time conditions passed.
              </span>
            </div>
            <button
              onClick={() => setFormSubmittedSuccessfully(false)}
              className="text-xs text-emerald-400 hover:text-emerald-200 underline font-medium"
            >
              Reset
            </button>
          </div>
        )}

        <form onSubmit={handleDynamicFormSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Real-Time Async Username Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="reg-username" className="text-xs font-medium text-slate-300">
                  Username (Async Availability Check)
                </label>
                {usernameAvailability === 'checking' && (
                  <span className="text-[10px] text-amber-400 font-mono animate-pulse">
                    Checking availability...
                  </span>
                )}
                {usernameAvailability === 'available' && (
                  <span
                    id="username-status-available"
                    data-testid="username-status-available"
                    className="text-[10px] text-emerald-400 font-mono font-semibold"
                  >
                    ✓ Available
                  </span>
                )}
                {usernameAvailability === 'taken' && (
                  <span
                    id="username-status-taken"
                    data-testid="username-status-taken"
                    role="alert"
                    className="text-[10px] text-rose-400 font-mono font-semibold"
                  >
                    ✗ Already Taken (try another)
                  </span>
                )}
              </div>
              <input
                type="text"
                id="reg-username"
                data-testid="reg-username"
                value={valUsername}
                onChange={(e) => setValUsername(e.target.value)}
                placeholder="Type 'admin' to test collision"
                className={`w-full px-3 py-2 bg-slate-950 border rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none ${
                  usernameAvailability === 'taken'
                    ? 'border-rose-500'
                    : usernameAvailability === 'available'
                    ? 'border-emerald-500'
                    : 'border-slate-700'
                }`}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Reserved names: <code className="font-mono text-slate-400">admin, root, superuser, tester</code>
              </p>
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="reg-email" className="text-xs font-medium text-slate-300">
                  Email Address
                </label>
                {valEmail && (
                  <span
                    data-testid="email-validation-status"
                    className={`text-[10px] font-mono ${
                      isEmailValid ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isEmailValid ? '✓ Valid format' : '✗ Invalid format'}
                  </span>
                )}
              </div>
              <input
                type="email"
                id="reg-email"
                data-testid="reg-email"
                value={valEmail}
                onChange={(e) => setValEmail(e.target.value)}
                placeholder="sdet@cyberqa.io"
                className={`w-full px-3 py-2 bg-slate-950 border rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none ${
                  valEmail && !isEmailValid ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
          </div>

          {/* Password with 4-Rule Strength Tracker */}
          <div className="space-y-2">
            <label htmlFor="reg-password" className="block text-xs font-medium text-slate-300">
              Password with Live Security Criteria
            </label>
            <input
              type="password"
              id="reg-password"
              data-testid="reg-password"
              value={valPassword}
              onChange={(e) => setValPassword(e.target.value)}
              placeholder="Enter strong password"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            {/* Live Password Rules */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div
                data-testid="rule-length"
                className={`flex items-center gap-1.5 ${
                  pwdHasLength ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                }`}
              >
                <span>{pwdHasLength ? '✓' : '○'}</span>
                <span>8+ Characters</span>
              </div>
              <div
                data-testid="rule-upper"
                className={`flex items-center gap-1.5 ${
                  pwdHasUpper ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                }`}
              >
                <span>{pwdHasUpper ? '✓' : '○'}</span>
                <span>1+ Uppercase</span>
              </div>
              <div
                data-testid="rule-number"
                className={`flex items-center gap-1.5 ${
                  pwdHasNumber ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                }`}
              >
                <span>{pwdHasNumber ? '✓' : '○'}</span>
                <span>1+ Number</span>
              </div>
              <div
                data-testid="rule-special"
                className={`flex items-center gap-1.5 ${
                  pwdHasSpecial ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                }`}
              >
                <span>{pwdHasSpecial ? '✓' : '○'}</span>
                <span>1+ Special Char</span>
              </div>
            </div>
          </div>

          {/* Range Slider for Experience */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Years of Automation Experience:</span>
              <span className="font-mono text-emerald-400 font-bold" id="exp-val-display" data-testid="exp-val-display">
                {valExperienceYears} {valExperienceYears === 1 ? 'Year' : 'Years'}
              </span>
            </div>
            <input
              type="range"
              id="exp-slider"
              data-testid="exp-slider"
              min={0}
              max={15}
              value={valExperienceYears}
              onChange={(e) => setValExperienceYears(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-2">
            <label htmlFor="reg-terms" className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                id="reg-terms"
                data-testid="reg-terms-checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <span>
                I agree to the testing playground terms &amp; conditions and automated grading guidelines.
              </span>
            </label>
          </div>

          {/* Form Submit Button with dynamic disabled state */}
          <div className="pt-3">
            <Inspectable
              strategy={{
                elementLabel: 'Dynamic Validation Submit Button',
                id: 'btn-validate-submit',
                testId: 'dynamic-submit-btn',
                css: '#btn-validate-submit',
                xpath: "//button[@id='btn-validate-submit']",
                playwrightRole: { role: 'button', name: 'Submit Verified Profile' },
                playwrightRecommended: `expect(page.get_by_role("button", name="Submit Verified Profile")).to_be_enabled()`,
                seleniumRecommended: `WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.ID, "btn-validate-submit")))`,
                note: 'Asserts that button is disabled until all inputs satisfy regex and async validations.'
              }}
            >
              <button
                type="submit"
                id="btn-validate-submit"
                data-testid="dynamic-submit-btn"
                disabled={!isDynamicFormValid}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                {isDynamicFormValid ? 'Submit Verified Profile' : 'Complete All Form Fields to Enable Submit'}
              </button>
            </Inspectable>
          </div>
        </form>
      </div>
    </div>
  );
};
