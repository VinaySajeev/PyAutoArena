import React, { useState } from 'react';
import { useInspector } from '../context/InspectorContext';
import { X, Copy, Check, Terminal, Sparkles, BookOpen, Layers, Clock, ShieldCheck } from 'lucide-react';

interface CheatsheetTopic {
  id: string;
  title: string;
  category: string;
  selenium: string;
  playwright: string;
  note: string;
}

const CHEATSHEET_TOPICS: CheatsheetTopic[] = [
  {
    id: 'setup',
    title: '1. Browser Setup & Pytest Fixture',
    category: 'Core',
    selenium: `# Python Selenium 4 Setup
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    driver.implicitly_wait(2)  # caution with implicit waits
    yield driver
    driver.quit()`,
    playwright: `# Python Playwright Setup (pytest-playwright)
import pytest
from playwright.sync_api import Page, expect

# pytest-playwright automatically provides the 'page' fixture!
def test_dashboard_title(page: Page):
    page.goto("http://localhost:3000")
    expect(page).to_have_title("PyAutoArena - Selenium & Playwright Playground")

# Manual standalone session:
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=50)
    page = browser.new_page()
    page.goto("http://localhost:3000")
    browser.close()`,
    note: 'Playwright includes isolated BrowserContexts for each test by default, eliminating cross-test cookie contamination without re-launching the heavy browser binary.'
  },
  {
    id: 'locators',
    title: '2. Locators & Element Discovery',
    category: 'Core',
    selenium: `# Selenium By Strategies
from selenium.webdriver.common.by import By

driver.find_element(By.ID, "username")
driver.find_element(By.NAME, "password")
driver.find_element(By.CLASS_NAME, "btn-primary")
driver.find_element(By.TAG_NAME, "input")
driver.find_element(By.CSS_SELECTOR, "div.card > button[type='submit']")
driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")

# Multiple elements:
rows = driver.find_elements(By.XPATH, "//table/tbody/tr")`,
    playwright: `# Playwright Resilient Locators
# User-facing locators (resilient to DOM / CSS changes):
page.get_by_role("button", name="Sign In")
page.get_by_placeholder("Username")
page.get_by_label("Work Email Address")
page.get_by_text("Active")
page.get_by_test_id("employee-search")

# CSS / XPath locators:
page.locator("div.card > button[type='submit']")
page.locator("//table/tbody/tr")

# Chaining & Filtering:
page.locator("tr").filter(has_text="Sarah Connor").get_by_role("button", name="Edit")`,
    note: 'Playwright strongly encourages User-Facing locators (role, label, placeholder, text) because they simulate how a human perceives the interface.'
  },
  {
    id: 'dropdowns',
    title: '3. Dropdowns & Select Elements',
    category: 'Forms',
    selenium: `# Selenium Select Helper Class
from selenium.webdriver.support.ui import Select

dropdown = Select(driver.find_element(By.ID, "department-filter"))

# Options:
dropdown.select_by_visible_text("QA Automation")
dropdown.select_by_value("Engineering")
dropdown.select_by_index(2)

# Check selected option
selected_text = dropdown.first_selected_option.text`,
    playwright: `# Playwright Native Dropdown Selection
# Select by value, label, or index in one method:
page.get_by_test_id("dept-select").select_option(label="QA Automation")
page.locator("#department-filter").select_option("Engineering")
page.locator("#department-filter").select_option(index=2)

# Custom non-native (div/ul/li) dropdowns:
page.locator("#custom-dropdown-trigger").click()
page.locator("li.dropdown-item").filter(has_text="Docker").click()`,
    note: 'For standard HTML <select>, Selenium requires wrapping the WebElement with the Select() class. Playwright has .select_option() directly on the locator.'
  },
  {
    id: 'sync-waits',
    title: '4. Waits & State Synchronization',
    category: 'Sync',
    selenium: `# Selenium Explicit Waits (Mandatory for dynamic DOM)
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, timeout=10, poll_frequency=0.5)

# Wait for visibility
badge = wait.until(
    EC.visibility_of_element_located((By.ID, "auth-user-badge"))
)

# Wait for clickability
button = wait.until(
    EC.element_to_be_clickable((By.ID, "submit-btn"))
)
button.click()

# Wait for text to be present
wait.until(EC.text_to_be_present_in_element((By.ID, "status"), "Saved"))`,
    playwright: `# Playwright Auto-Waiting (Built into every action!)
# Playwright automatically waits for elements to be:
# - Attached to DOM
# - Visible
# - Stable (not animating)
# - Enabled
# - Receiving events (not covered by modal backdrop)

# These auto-wait automatically up to 30s:
page.get_by_role("button", name="Submit").click()
page.get_by_placeholder("Email").fill("test@cyberqa.io")

# Web-first assertions with auto-polling:
expect(page.get_by_test_id("auth-user-badge")).to_be_visible()
expect(page.locator("#status")).to_have_text("Saved")`,
    note: 'In Selenium, failing to write an explicit wait on asynchronous elements is the #1 cause of flaky NoSuchElementException or ElementNotInteractableException.'
  },
  {
    id: 'stale-elements',
    title: '5. Stale Element References',
    category: 'Sync',
    selenium: `# Handling StaleElementReferenceException in Selenium
from selenium.common.exceptions import StaleElementReferenceException

# CAUTION: If the DOM re-renders, saved WebElements expire!
old_btn = driver.find_element(By.ID, "save-btn")
# ... page reloads or swaps DOM component ...
# old_btn.click() -> StaleElementReferenceException!

# Solution: Re-query inside wait loop or Page Object method
WebDriverWait(driver, 10, ignored_exceptions=[StaleElementReferenceException]).until(
    lambda d: d.find_element(By.ID, "save-btn").click() or True
)`,
    playwright: `# Playwright Eliminates Stale Element Exceptions
# Playwright locators are lazy evaluators, NOT cached DOM nodes!
save_btn = page.get_by_role("button", name="Save")

# ... page re-renders, reloads, or mutates DOM ...

# Playwright resolves the locator fresh upon calling .click():
save_btn.click()  # Works seamlessly!`,
    note: 'Selenium WebElements are stateful memory references to a specific C++ DOM handle. Playwright Locators are instructions on how to locate an element.'
  },
  {
    id: 'uploads',
    title: '6. File Uploads',
    category: 'Files',
    selenium: `# Selenium File Upload (Bypassing OS dialog)
import os

file_path = os.path.abspath("test_report.csv")

# Directly target the <input type="file"> element
file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
file_input.send_keys(file_path)

# Verify success message
success_banner = WebDriverWait(driver, 5).until(
    EC.visibility_of_element_located((By.CLASS_NAME, "upload-success"))
)`,
    playwright: `# Playwright set_input_files
import os

# Set single or multiple files
page.get_by_test_id("native-file-upload").set_input_files("test_report.csv")

# Clear files:
page.get_by_test_id("native-file-upload").set_input_files([])

# Intercept file chooser triggered by button click:
with page.expect_file_chooser() as fc_info:
    page.get_by_role("button", name="Upload File").click()
file_chooser = fc_info.value
file_chooser.set_files("test_report.csv")`,
    note: 'Never use OS automation tools (like PyAutoGUI or AutoIT) for browser file uploads; always interact directly with the DOM input element or Playwright file chooser event.'
  },
  {
    id: 'shadow-dom',
    title: '7. Shadow DOM & iFrames',
    category: 'Advanced',
    selenium: `# Selenium 4 Shadow DOM & iFrames
# 1. Shadow Root
host = driver.find_element(By.TAG_NAME, "custom-card")
shadow_root = host.shadow_root
inner_btn = shadow_root.find_element(By.CSS_SELECTOR, "#inner-action")
inner_btn.click()

# 2. iFrames
driver.switch_to.frame("iframe-sandbox")
driver.find_element(By.ID, "iframe-input").send_keys("inside frame")
driver.switch_to.default_content() # Switch back!`,
    playwright: `# Playwright Shadow DOM & Frame Locators
# 1. Shadow DOM (PIERCED AUTOMATICALLY!)
# Playwright CSS selectors cross open shadow roots by default:
page.locator("custom-card #inner-action").click()

# 2. iFrames (Frame Locators)
# Frame locators are first-class citizens:
frame = page.frame_locator("#iframe-sandbox")
frame.get_by_placeholder("Type inside frame...").fill("inside frame")
frame.get_by_role("button", name="Submit").click()`,
    note: 'Playwright handles Shadow DOM piercing automatically without special syntax for open roots, and frame_locator allows seamless chained interactions.'
  },
  {
    id: 'dialogs',
    title: '8. Native Alerts, Prompts & Confirms',
    category: 'Advanced',
    selenium: `# Selenium switch_to.alert
driver.find_element(By.ID, "btn-alert").click()

# Switch to alert context
alert = driver.switch_to.alert
print(alert.text)
alert.accept()  # Click OK

# For confirm dialogs:
# alert.dismiss()  # Click Cancel

# For prompt dialogs:
# alert.send_keys("My Name")
# alert.accept()`,
    playwright: `# Playwright Dialog Event Listener
# Playwright auto-dismisses alerts unless you listen for them:
def handle_dialog(dialog):
    print(f"Dialog prompt: {dialog.message}")
    if dialog.type == "prompt":
        dialog.accept("Custom text response")
    else:
        dialog.accept()  # or dialog.dismiss()

page.on("dialog", handle_dialog)
page.get_by_role("button", name="Show Alert").click()`,
    note: 'In Playwright, register the dialog handler before triggering the action that causes the dialog to pop up.'
  }
];

export const CodeCheatsheetModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [activeTopicId, setActiveTopicId] = useState(CHEATSHEET_TOPICS[0].id);
  const [copiedFramework, setCopiedFramework] = useState<'selenium' | 'playwright' | null>(null);

  if (!isOpen) return null;

  const currentTopic = CHEATSHEET_TOPICS.find((t) => t.id === activeTopicId) || CHEATSHEET_TOPICS[0];

  const handleCopy = (text: string, fw: 'selenium' | 'playwright') => {
    navigator.clipboard.writeText(text);
    setCopiedFramework(fw);
    setTimeout(() => setCopiedFramework(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Python Selenium vs Python Playwright Cheatsheet
              </h2>
              <p className="text-xs text-slate-400">
                Interactive side-by-side automation reference for SDETs and QA testers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar Navigation */}
          <div className="w-72 border-r border-slate-800 bg-slate-950/50 p-3 space-y-1 overflow-y-auto shrink-0">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Learning Modules
            </div>
            {CHEATSHEET_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTopicId === topic.id
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>

          {/* Main Content Pane */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{currentTopic.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Category: {currentTopic.category}</p>
            </div>

            {/* Note Callout */}
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-300">Key Difference: </span>
                {currentTopic.note}
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
              {/* Python Selenium Block */}
              <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-300">Python Selenium 4</span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentTopic.selenium, 'selenium')}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 transition-colors"
                  >
                    {copiedFramework === 'selenium' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedFramework === 'selenium' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-3.5 flex-1 overflow-x-auto">
                  <pre className="text-xs font-mono text-indigo-200/90 whitespace-pre leading-relaxed">
                    {currentTopic.selenium}
                  </pre>
                </div>
              </div>

              {/* Python Playwright Block */}
              <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">Python Playwright</span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentTopic.playwright, 'playwright')}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 transition-colors"
                  >
                    {copiedFramework === 'playwright' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedFramework === 'playwright' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-3.5 flex-1 overflow-x-auto">
                  <pre className="text-xs font-mono text-emerald-200/90 whitespace-pre leading-relaxed">
                    {currentTopic.playwright}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
