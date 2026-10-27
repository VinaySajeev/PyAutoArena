import React, { useState } from 'react';
import { ViewType, AuthState } from './types';
import { MOCK_USERS } from './data/dummyData';
import { InspectorProvider } from './context/InspectorContext';
import { Navbar } from './components/Navbar';
import { InspectorDrawer } from './components/InspectorDrawer';
import { CodeCheatsheetModal } from './components/CodeCheatsheetModal';
import { CrudGridView } from './views/CrudGridView';
import { LoginView } from './views/LoginView';
import { FormControlsView } from './views/FormControlsView';
import { UploadsView } from './views/UploadsView';
import { StateSyncView } from './views/StateSyncView';
import { ChallengesView } from './views/ChallengesView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('grid');
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);

  // Authentication State
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: true,
    user: MOCK_USERS.standard_user,
    loginTime: '2026-10-27 10:45:00',
    error: null,
    isLoading: false,
  });

  const handleLogin = async (username: string, pass: string, latencyMs: number): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (latencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, latencyMs));
    }

    if (username === 'locked_user') {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loginTime: null,
        error: 'Epic sadface: Sorry, this user has been locked out.',
        isLoading: false,
      });
      return false;
    }

    const matchedUser = MOCK_USERS[username as keyof typeof MOCK_USERS];
    if (matchedUser && pass === 'secret_sauce') {
      setAuthState({
        isAuthenticated: true,
        user: matchedUser,
        loginTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        error: null,
        isLoading: false,
      });
      return true;
    }

    setAuthState({
      isAuthenticated: false,
      user: null,
      loginTime: null,
      error: 'Epic sadface: Username and password do not match any user in this service.',
      isLoading: false,
    });
    return false;
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loginTime: null,
      error: null,
      isLoading: false,
    });
  };

  return (
    <InspectorProvider>
      <div className="min-h-screen bg-[#090d16] text-slate-200 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
        {/* Top Navbar adhering strictly to 3-zone contract */}
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          authState={authState}
          onLogout={handleLogout}
          onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
        />

        {/* View Content */}
        <main className="flex-1">
          {currentView === 'grid' && (
            <CrudGridView onOpenCheatsheet={() => setIsCheatsheetOpen(true)} />
          )}
          {currentView === 'login' && (
            <LoginView
              authState={authState}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onNavigateToGrid={() => setCurrentView('grid')}
            />
          )}
          {currentView === 'forms' && <FormControlsView />}
          {currentView === 'uploads' && <UploadsView />}
          {currentView === 'sync' && <StateSyncView />}
          {currentView === 'challenges' && (
            <ChallengesView onNavigateToView={(view) => setCurrentView(view)} />
          )}
        </main>

        {/* Global Inspector Drawer */}
        <InspectorDrawer />

        {/* Python Selenium vs Playwright Cheatsheet Modal */}
        <CodeCheatsheetModal
          isOpen={isCheatsheetOpen}
          onClose={() => setIsCheatsheetOpen(false)}
        />
      </div>
    </InspectorProvider>
  );
}
