import { Employee, TestChallenge } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-1001',
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberqa.io',
    department: 'QA Automation',
    role: 'Lead SDET',
    salary: 135000,
    status: 'Active',
    hireDate: '2023-03-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
    skills: ['Playwright', 'Selenium', 'Python', 'Pytest', 'Docker']
  },
  {
    id: 'EMP-1002',
    name: 'Marcus Vance',
    email: 'marcus.vance@cyberqa.io',
    department: 'Engineering',
    role: 'Staff Backend Architect',
    salary: 165000,
    status: 'Active',
    hireDate: '2022-08-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    skills: ['FastAPI', 'PostgreSQL', 'Go', 'Kubernetes']
  },
  {
    id: 'EMP-1003',
    name: 'Elena Rostova',
    email: 'elena.rostova@cyberqa.io',
    department: 'QA Automation',
    role: 'Senior Automation Engineer',
    salary: 118000,
    status: 'Active',
    hireDate: '2023-06-10',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    skills: ['Selenium WebDriver', 'Appium', 'Python', 'Allure']
  },
  {
    id: 'EMP-1004',
    name: 'David Kim',
    email: 'david.kim@cyberqa.io',
    department: 'DevOps',
    role: 'Cloud Infrastructure Lead',
    salary: 145000,
    status: 'On Leave',
    hireDate: '2021-11-20',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    skills: ['Terraform', 'AWS', 'GitHub Actions', 'ArgoCD']
  },
  {
    id: 'EMP-1005',
    name: 'Priya Sharma',
    email: 'priya.sharma@cyberqa.io',
    department: 'Product',
    role: 'Technical Product Manager',
    salary: 130000,
    status: 'Active',
    hireDate: '2024-01-08',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
    skills: ['Product Analytics', 'Jira', 'BDD', 'Cucumber']
  },
  {
    id: 'EMP-1006',
    name: 'Alexander Lind',
    email: 'alexander.lind@cyberqa.io',
    department: 'Engineering',
    role: 'Frontend Principal Engineer',
    salary: 155000,
    status: 'Active',
    hireDate: '2022-04-12',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'WebSockets']
  },
  {
    id: 'EMP-1007',
    name: 'Fatima Al-Mansoor',
    email: 'fatima.m@cyberqa.io',
    department: 'QA Automation',
    role: 'Performance & Security SDET',
    salary: 125000,
    status: 'Active',
    hireDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face',
    skills: ['Locust', 'Playwright Python', 'OWASP ZAP', 'Postman']
  },
  {
    id: 'EMP-1008',
    name: 'Lucas Dubois',
    email: 'lucas.dubois@cyberqa.io',
    department: 'Finance',
    role: 'Financial Operations Analyst',
    salary: 92000,
    status: 'Inactive',
    hireDate: '2020-05-18',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face',
    skills: ['Financial Modeling', 'Excel', 'SQL', 'Python']
  },
  {
    id: 'EMP-1009',
    name: 'Chloe Zhang',
    email: 'chloe.zhang@cyberqa.io',
    department: 'HR',
    role: 'Tech Talent Acquisition Partner',
    salary: 88000,
    status: 'Active',
    hireDate: '2023-02-14',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face',
    skills: ['Talent Sourcing', 'Workday', 'Tech Screenings']
  },
  {
    id: 'EMP-1010',
    name: 'Tariq Hassan',
    email: 'tariq.hassan@cyberqa.io',
    department: 'QA Automation',
    role: 'Junior Test Automation Engineer',
    salary: 82000,
    status: 'Active',
    hireDate: '2024-04-01',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',
    skills: ['Selenium', 'Python', 'Unit Testing', 'Git']
  },
  {
    id: 'EMP-1011',
    name: 'Rachel Greene',
    email: 'rachel.greene@cyberqa.io',
    department: 'Engineering',
    role: 'Full Stack Engineer',
    salary: 112000,
    status: 'On Leave',
    hireDate: '2023-10-15',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&h=120&fit=crop&crop=face',
    skills: ['Node.js', 'Express', 'React', 'MongoDB']
  },
  {
    id: 'EMP-1012',
    name: 'Nico Bellic',
    email: 'nico.bellic@cyberqa.io',
    department: 'DevOps',
    role: 'Site Reliability Engineer',
    salary: 138000,
    status: 'Active',
    hireDate: '2022-01-19',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=face',
    skills: ['Prometheus', 'Grafana', 'Python', 'Incident Response']
  }
];

export const MOCK_USERS = {
  standard_user: {
    username: 'standard_user',
    name: 'Alex Mercer',
    role: 'Lead Automation Tester',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
    token: 'token_std_sec_7894a_session'
  },
  locked_user: {
    username: 'locked_user',
    name: 'Locked Out User',
    role: 'Suspended Tester',
    avatar: '',
    token: ''
  },
  slow_user: {
    username: 'slow_user',
    name: 'Julian Delay',
    role: 'Latency Test Profile',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop&crop=face',
    token: 'token_slow_lat_5521b_session'
  },
  problem_user: {
    username: 'problem_user',
    name: 'Glitch Runner',
    role: 'Chaos Monkey Tester',
    avatar: 'https://invalid-broken-image-link-for-testing.test/broken.jpg',
    token: 'token_glitch_9900z_session'
  }
};

export const CASCADING_GEO_DATA: Record<string, { states: { name: string; cities: string[] }[] }> = {
  'United States': {
    states: [
      { name: 'California', cities: ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Albany', 'Rochester'] },
      { name: 'Texas', cities: ['Austin', 'Dallas', 'Houston', 'San Antonio'] },
      { name: 'Washington', cities: ['Seattle', 'Bellevue', 'Redmond', 'Tacoma'] }
    ]
  },
  'Germany': {
    states: [
      { name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg'] },
      { name: 'Berlin', cities: ['Berlin City', 'Mitte', 'Pankow', 'Charlottenburg'] },
      { name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt'] }
    ]
  },
  'United Kingdom': {
    states: [
      { name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Bristol'] },
      { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport'] }
    ]
  },
  'India': {
    states: [
      { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'] },
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'] },
      { name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad'] }
    ]
  }
};

export const TEST_CHALLENGES: TestChallenge[] = [
  {
    id: 'ch-1',
    number: 1,
    title: 'Flaky Network & Delayed Login',
    difficulty: 'Beginner',
    category: 'Auth',
    description: 'Log in using "slow_user" with credentials. The server introduces a simulated 3.5-second latency before resolving. Test explicit wait strategies to verify successful redirect to the dashboard without flaky timeouts.',
    tasks: [
      'Fill in #username and #password',
      'Click the #login-button',
      'Wait for the session indicator or #auth-user-badge to become visible',
      'Assert user display name equals "Julian Delay"'
    ],
    targetLocators: [
      { label: 'Username Input', testId: 'username-input', css: '#username' },
      { label: 'Password Input', testId: 'password-input', css: '#password' },
      { label: 'Login Button', testId: 'login-submit', css: '#login-button' },
      { label: 'User Welcome Badge', testId: 'auth-user-badge', css: '[data-testid="auth-user-badge"]' }
    ],
    seleniumCode: `# Python Selenium 4 (with WebDriverWait)
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("http://localhost:3000/#login")

# Locate and fill inputs
driver.find_element(By.ID, "username").send_keys("slow_user")
driver.find_element(By.ID, "password").send_keys("secret_sauce")
driver.find_element(By.ID, "login-button").click()

# Explicit wait for network delayed auth element (max 10s)
wait = WebDriverWait(driver, 10)
user_badge = wait.until(
    EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="auth-user-badge"]'))
)

assert "Julian Delay" in user_badge.text
print("Test Passed: Slow login handled successfully!")
driver.quit()`,
    playwrightCode: `# Python Playwright (Auto-waiting built-in)
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("http://localhost:3000/#login")

    # Playwright's user-facing role & label locators
    page.get_by_placeholder("Username").fill("slow_user")
    page.get_by_placeholder("Password").fill("secret_sauce")
    page.get_by_role("button", name="Sign In").click()

    # Playwright auto-waits up to 30s for the assertion
    badge = page.get_by_test_id("auth-user-badge")
    expect(badge).to_contain_text("Julian Delay")

    print("Test Passed: Playwright auto-waited seamlessly!")
    browser.close()`,
    explanation: 'Selenium requires explicit configuration via WebDriverWait and expected_conditions.visibility_of_element_located. In contrast, Playwright actions and expect assertions auto-wait for actionability (visible, stable, enabled) without manual timer loops.'
  },
  {
    id: 'ch-2',
    number: 2,
    title: 'Dynamic Grid Filter & Row Inspection',
    difficulty: 'Intermediate',
    category: 'CRUD',
    description: 'Filter the employee directory by Department ("QA Automation"), search for "Sarah", sort by Salary, and extract the text from the targeted table row.',
    tasks: [
      'Select "QA Automation" in #department-filter',
      'Type "Sarah" into #employee-search input',
      'Click the Salary column header to sort descending',
      'Verify the top row contains "EMP-1001" and salary "$135,000"'
    ],
    targetLocators: [
      { label: 'Department Filter', testId: 'dept-select', css: '#department-filter' },
      { label: 'Search Input', testId: 'search-input', css: '#employee-search' },
      { label: 'Salary Header', testId: 'sort-salary', css: '[data-sort="salary"]' },
      { label: 'First Table Row', testId: 'emp-row-EMP-1001', css: 'tbody tr:first-child' }
    ],
    seleniumCode: `# Python Selenium: Dropdown Select + Table Traversal
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("http://localhost:3000/#grid")

# Select department using Selenium's Select helper
dept_select = Select(driver.find_element(By.ID, "department-filter"))
dept_select.select_by_visible_text("QA Automation")

# Search employee
search = driver.find_element(By.ID, "employee-search")
search.clear()
search.send_keys("Sarah")

# Sort by salary
driver.find_element(By.CSS_SELECTOR, '[data-sort="salary"]').click()

# Verify row text
wait = WebDriverWait(driver, 5)
first_row = wait.until(
    EC.presence_of_element_located((By.XPATH, "//tbody/tr[1]"))
)
assert "Sarah Connor" in first_row.text
assert "$135,000" in first_row.text
print("Test Passed: Row verified!")
driver.quit()`,
    playwrightCode: `# Python Playwright: Select Option & Locator Chaining
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("http://localhost:3000/#grid")

    # Select dropdown option by label
    page.get_by_test_id("dept-select").select_option(label="QA Automation")

    # Search employee
    page.get_by_placeholder("Search by name, role, email...").fill("Sarah")

    # Click salary sort
    page.get_by_role("button", name="Salary").click()

    # Target specific row and assert content
    row = page.locator("tbody tr").first
    expect(row).to_contain_text("Sarah Connor")
    expect(row).to_contain_text("$135,000")

    print("Test Passed: Playwright chained locator matched!")
    browser.close()`,
    explanation: 'Selenium uses the `Select` support class to manipulate standard HTML selects, while Playwright provides `.select_option()`. In Playwright, `.first` or `.filter(has_text=...)` simplifies nested row inspection.'
  },
  {
    id: 'ch-3',
    number: 3,
    title: 'Surviving StaleElementReferenceException',
    difficulty: 'Advanced',
    category: 'Sync',
    description: 'Click the "Re-render Dynamic Container" button which drops and replaces the target DOM node. Demonstrate how Selenium throws StaleElementReferenceException if reusing an old element reference, and how Playwright locators stay resilient.',
    tasks: [
      'Locate #dynamic-target element',
      'Click #trigger-dom-swap button to replace the node',
      'Attempt to read text from the target without crashing the test'
    ],
    targetLocators: [
      { label: 'Swap Trigger', testId: 'btn-trigger-swap', css: '#trigger-dom-swap' },
      { label: 'Dynamic Target', testId: 'dynamic-target-node', css: '#dynamic-target' }
    ],
    seleniumCode: `# Python Selenium: Catching & Recovering from StaleElement
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.support.ui import WebDriverWait

driver = webdriver.Chrome()
driver.get("http://localhost:3000/#sync")

# Grab reference to target
old_element = driver.find_element(By.ID, "dynamic-target")

# Trigger DOM swap
driver.find_element(By.ID, "trigger-dom-swap").click()

# Attempting old_element.text would raise StaleElementReferenceException!
# Proper pattern: Re-query inside a custom wait condition or retry block
def get_fresh_text():
    return driver.find_element(By.ID, "dynamic-target").text

wait = WebDriverWait(driver, 5, ignored_exceptions=[StaleElementReferenceException])
fresh_text = wait.until(lambda d: d.find_element(By.ID, "dynamic-target").text)
print(f"Recovered freshly: {fresh_text}")
driver.quit()`,
    playwrightCode: `# Python Playwright: Locators Are Lazy Pointers (No Stale Exception!)
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000/#sync")

    # Playwright locators are recipes, not fixed pointers
    target_locator = page.locator("#dynamic-target")

    # Trigger DOM swap
    page.get_by_role("button", name="Replace Element in DOM").click()

    # Automatically re-evaluates the query in the fresh DOM!
    expect(target_locator).to_be_visible()
    print("Playwright never throws StaleElementReferenceException!")
    browser.close()`,
    explanation: 'In Selenium, `driver.find_element` returns an immediate pointer to an exact DOM node. If the page re-renders that node, any interaction throws StaleElementReferenceException. Playwright locators represent a search recipe that resolves right at the moment of action.'
  },
  {
    id: 'ch-4',
    number: 4,
    title: 'Piercing the Shadow DOM Sandbox',
    difficulty: 'Advanced',
    category: 'Shadow DOM',
    description: 'Interact with a custom Web Component rendered inside an open Shadow Root (`#shadow-root (open)`). Type text into the shadow input and click the shadow button.',
    tasks: [
      'Locate the custom shadow host element',
      'Type text into the input nested inside the shadow root',
      'Click the button inside the shadow root and verify the event count'
    ],
    targetLocators: [
      { label: 'Shadow Host', testId: 'shadow-host-component', css: 'shadow-demo-element' },
      { label: 'Shadow Input', testId: 'shadow-input-field', css: '#shadow-inner-input' },
      { label: 'Shadow Button', testId: 'shadow-action-btn', css: '#shadow-submit-btn' }
    ],
    seleniumCode: `# Python Selenium 4: Shadow Root Access
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("http://localhost:3000/#sync")

# 1. Find shadow host
host = driver.find_element(By.TAG_NAME, "shadow-demo-element")

# 2. Extract shadow_root property (Selenium 4 feature)
shadow_root = host.shadow_root

# 3. Find elements inside shadow DOM
shadow_input = shadow_root.find_element(By.CSS_SELECTOR, "#shadow-inner-input")
shadow_input.send_keys("Automated via Selenium Shadow Root")

shadow_btn = shadow_root.find_element(By.CSS_SELECTOR, "#shadow-submit-btn")
shadow_btn.click()

print("Selenium shadow root interaction succeeded!")
driver.quit()`,
    playwrightCode: `# Python Playwright: Automatic Shadow DOM Piercing
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000/#sync")

    # Playwright CSS and role selectors pierce open shadow roots BY DEFAULT!
    shadow_input = page.locator("#shadow-inner-input")
    shadow_input.fill("Playwright pierces shadow DOM automatically!")

    page.get_by_role("button", name="Dispatch Shadow Event").click()

    expect(page.locator("#shadow-event-status")).to_contain_text("Dispatched")
    print("Playwright pierced shadow DOM transparently!")
    browser.close()`,
    explanation: 'Selenium 4 introduced `element.shadow_root` (returning a SearchContext), but still requires explicit manual traversal. Playwright pierces open shadow roots by default for all standard CSS selectors and locator engines!'
  },
  {
    id: 'ch-5',
    number: 5,
    title: 'File Upload & Drag-and-Drop Processing',
    difficulty: 'Intermediate',
    category: 'Uploads',
    description: 'Upload a CSV or JSON file via the native file input without using OS file dialogs, and assert that the parsed data summary updates.',
    tasks: [
      'Locate native file input #file-upload',
      'Upload sample file using file path',
      'Verify upload completion card and row count badge'
    ],
    targetLocators: [
      { label: 'File Input', testId: 'native-file-upload', css: '#file-upload' },
      { label: 'Upload Status Card', testId: 'upload-result-card', css: '[data-testid="upload-result-card"]' }
    ],
    seleniumCode: `# Python Selenium: File Upload via send_keys
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("http://localhost:3000/#uploads")

file_path = os.path.abspath("test_data.csv")

# Send absolute file path directly to the input[type=file]
file_input = driver.find_element(By.ID, "file-upload")
file_input.send_keys(file_path)

wait = WebDriverWait(driver, 5)
result_card = wait.until(
    EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="upload-result-card"]'))
)
assert "Upload Successful" in result_card.text
print("Selenium file upload verified!")
driver.quit()`,
    playwrightCode: `# Python Playwright: set_input_files
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000/#uploads")

    # Set input files directly via locator
    page.get_by_test_id("native-file-upload").set_input_files("test_data.csv")

    # Assert upload result
    expect(page.get_by_test_id("upload-result-card")).to_be_visible()
    expect(page.get_by_test_id("upload-status-text")).to_contain_text("Processed")
    print("Playwright set_input_files verified!")
    browser.close()`,
    explanation: 'Both frameworks bypass native operating system file explorer dialogs by populating the `<input type="file">` DOM element directly via `send_keys(file_path)` (Selenium) or `set_input_files(path)` (Playwright).'
  },
  {
    id: 'ch-6',
    number: 6,
    title: 'Native Browser Dialogs (Alert, Confirm, Prompt)',
    difficulty: 'Intermediate',
    category: 'Alerts',
    description: 'Trigger a JavaScript window.confirm() dialog, accept it, and verify the confirmation message rendered on the page.',
    tasks: [
      'Click #btn-trigger-confirm',
      'Handle the browser dialog (Accept or Dismiss)',
      'Assert result label indicates "User confirmed action"'
    ],
    targetLocators: [
      { label: 'Confirm Trigger', testId: 'btn-trigger-confirm', css: '#btn-trigger-confirm' },
      { label: 'Dialog Result', testId: 'dialog-result-text', css: '#dialog-result-output' }
    ],
    seleniumCode: `# Python Selenium: switch_to.alert
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("http://localhost:3000/#sync")

# Click button triggering native confirm()
driver.find_element(By.ID, "btn-trigger-confirm").click()

# Switch context to the active modal alert
alert = driver.switch_to.alert
print("Alert message:", alert.text)

# Accept (OK) or dismiss (Cancel)
alert.accept()

# Verify DOM updated
result = driver.find_element(By.ID, "dialog-result-output")
assert "Confirmed: OK" in result.text
print("Selenium alert handled successfully!")
driver.quit()`,
    playwrightCode: `# Python Playwright: Event listener page.on("dialog")
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000/#sync")

    # Register dialog handler BEFORE triggering the dialog
    def handle_dialog(dialog):
        print(f"Dialog text: {dialog.message}")
        dialog.accept()  # Or dialog.dismiss()

    page.on("dialog", handle_dialog)

    # Click trigger
    page.get_by_test_id("btn-trigger-confirm").click()

    expect(page.locator("#dialog-result-output")).to_contain_text("Confirmed: OK")
    print("Playwright dialog listener handled successfully!")
    browser.close()`,
    explanation: 'Playwright auto-dismisses dialogs by default unless a `page.on("dialog", handler)` listener is registered. In Selenium, unhandled alerts block all further driver actions until `switch_to.alert.accept()` or `.dismiss()` is executed.'
  }
];
