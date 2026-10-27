export interface Employee {
  id: string;
  name: string;
  email: string;
  department: 'Engineering' | 'QA Automation' | 'DevOps' | 'Product' | 'HR' | 'Finance';
  role: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  hireDate: string;
  avatar: string;
  skills: string[];
}

export interface User {
  username: string;
  name: string;
  role: string;
  avatar: string;
  token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loginTime: string | null;
  error: string | null;
  isLoading: boolean;
}

export type ViewType = 'grid' | 'login' | 'forms' | 'uploads' | 'sync' | 'challenges' | 'cheatsheet';

export interface LocatorStrategy {
  elementLabel: string;
  id?: string;
  name?: string;
  testId?: string;
  css: string;
  xpath: string;
  playwrightRole?: {
    role: string;
    name?: string;
  };
  playwrightRecommended: string;
  seleniumRecommended: string;
  note?: string;
}

export interface TestChallenge {
  id: string;
  number: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Auth' | 'CRUD' | 'Dropdowns' | 'Uploads' | 'Sync' | 'Shadow DOM' | 'Alerts';
  description: string;
  tasks: string[];
  targetLocators: {
    label: string;
    testId: string;
    css: string;
  }[];
  seleniumCode: string;
  playwrightCode: string;
  explanation: string;
  completed?: boolean;
}

export interface UploadedFileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  previewUrl?: string;
  parsedRowCount?: number;
  dataSummary?: string;
}
