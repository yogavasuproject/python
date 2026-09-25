import React from 'react';
import { Terminal, Play, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'mcq' | 'coding' | 'mental-models' | 'cheatsheet';
  setActiveTab: (tab: 'mcq' | 'coding' | 'mental-models' | 'cheatsheet') => void;
  onOpenPlayground: () => void;
  onOpenMockTest: () => void;
  solvedCount: number;
  totalCodingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPlayground,
  onOpenMockTest,
  solvedCount,
  totalCodingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark with subtle placement emblem */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Terminal className="h-5 w-5" />
          </div>
          <button
            onClick={() => setActiveTab('mcq')}
            className="text-left group cursor-pointer"
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              PyPrep Campus
            </span>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links with hover states */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('mcq')}
            className={`cursor-pointer transition-colors relative py-1 ${
              activeTab === 'mcq'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Company MCQs
            {activeTab === 'mcq' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('coding')}
            className={`cursor-pointer transition-colors relative py-1 flex items-center gap-1.5 ${
              activeTab === 'coding'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Coding Arena
            {solvedCount > 0 && (
              <span className="text-xs text-emerald-400 font-mono tabular-nums">
                ({solvedCount}/{totalCodingCount})
              </span>
            )}
            {activeTab === 'coding' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('mental-models')}
            className={`cursor-pointer transition-colors relative py-1 ${
              activeTab === 'mental-models'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mental Models
            {activeTab === 'mental-models' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`cursor-pointer transition-colors relative py-1 ${
              activeTab === 'cheatsheet'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cheat Sheets
            {activeTab === 'cheatsheet' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMockTest}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Mock Placement Test
          </button>

          <button
            onClick={onOpenPlayground}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-md hover:bg-emerald-300 transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Python Runner
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-slate-800/80 px-4 py-2 bg-slate-950/95 overflow-x-auto gap-4 text-xs font-medium text-slate-300 scrollbar-none">
        <button
          onClick={() => setActiveTab('mcq')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'mcq' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Company MCQs
        </button>
        <button
          onClick={() => setActiveTab('coding')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'coding' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Coding Arena
        </button>
        <button
          onClick={() => setActiveTab('mental-models')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'mental-models' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Mental Models
        </button>
        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
            activeTab === 'cheatsheet' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Cheat Sheets
        </button>
        <button
          onClick={onOpenMockTest}
          className="whitespace-nowrap px-2 py-1 rounded text-emerald-400 bg-emerald-500/10 cursor-pointer"
        >
          Mock Test
        </button>
      </div>
    </header>
  );
};
