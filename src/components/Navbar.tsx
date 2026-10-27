import React from 'react';
import { ViewType, AuthState } from '../types';
import { useInspector } from '../context/InspectorContext';
import { Compass, BookOpen, LogOut, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  authState: AuthState;
  onLogout: () => void;
  onOpenCheatsheet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  authState,
  onLogout,
  onOpenCheatsheet,
}) => {
  const { isInspectorActive, toggleInspector } = useInspector();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element, no nested pills) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('grid')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm group-hover:bg-emerald-500/30 transition-colors">
              &gt;_
            </div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              PyAutoArena
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean hover states) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => onNavigate('grid')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 cursor-pointer ${
              currentView === 'grid' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1 pt-1' : ''
            }`}
          >
            CRUD &amp; Data Grid
          </button>
          <button
            onClick={() => onNavigate('login')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 cursor-pointer ${
              currentView === 'login' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1 pt-1' : ''
            }`}
          >
            Auth &amp; Login
          </button>
          <button
            onClick={() => onNavigate('forms')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 cursor-pointer ${
              currentView === 'forms' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1 pt-1' : ''
            }`}
          >
            Form Controls &amp; Inputs
          </button>
          <button
            onClick={() => onNavigate('uploads')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 cursor-pointer ${
              currentView === 'uploads' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1 pt-1' : ''
            }`}
          >
            Uploads &amp; Files
          </button>
          <button
            onClick={() => onNavigate('sync')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 cursor-pointer ${
              currentView === 'sync' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1 pt-1' : ''
            }`}
          >
            State Sync &amp; Traps
          </button>
          <button
            onClick={() => onNavigate('challenges')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-200 cursor-pointer ${
              currentView === 'challenges' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-1 pt-1' : ''
            }`}
          >
            Challenges
          </button>
        </nav>

        {/* Zone 3: Primary Action & Tools */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Inspector Toggle */}
          <button
            onClick={toggleInspector}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              isInspectorActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
            }`}
            title="Toggle interactive locator inspection mode"
          >
            <Compass className={`w-3.5 h-3.5 ${isInspectorActive ? 'text-amber-400 animate-spin' : ''}`} />
            <span className="whitespace-nowrap">Inspector {isInspectorActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Cheatsheet Button */}
          <button
            onClick={onOpenCheatsheet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors whitespace-nowrap shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cheatsheet</span>
          </button>

          {/* User state badge / Logout if logged in */}
          {authState.isAuthenticated && authState.user && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <span
                data-testid="auth-user-badge"
                id="auth-user-badge"
                className="text-xs font-mono text-slate-300 truncate max-w-[120px]"
                title={authState.user.name}
              >
                {authState.user.name}
              </span>
              <button
                onClick={onLogout}
                data-testid="logout-button"
                id="logout-button"
                className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-3 px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 text-xs">
        <button
          onClick={() => onNavigate('grid')}
          className={`whitespace-nowrap py-1 px-2 rounded ${
            currentView === 'grid' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
          }`}
        >
          CRUD Grid
        </button>
        <button
          onClick={() => onNavigate('login')}
          className={`whitespace-nowrap py-1 px-2 rounded ${
            currentView === 'login' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => onNavigate('forms')}
          className={`whitespace-nowrap py-1 px-2 rounded ${
            currentView === 'forms' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
          }`}
        >
          Form Controls
        </button>
        <button
          onClick={() => onNavigate('uploads')}
          className={`whitespace-nowrap py-1 px-2 rounded ${
            currentView === 'uploads' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
          }`}
        >
          Uploads
        </button>
        <button
          onClick={() => onNavigate('sync')}
          className={`whitespace-nowrap py-1 px-2 rounded ${
            currentView === 'sync' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
          }`}
        >
          State Sync
        </button>
        <button
          onClick={() => onNavigate('challenges')}
          className={`whitespace-nowrap py-1 px-2 rounded ${
            currentView === 'challenges' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
          }`}
        >
          Challenges
        </button>
      </div>
    </header>
  );
};
