import React from 'react';
import { ArrowRight, CheckCircle2, Terminal, Code2, Cpu } from 'lucide-react';
import heroImg from '../assets/images/hero_python_placement_1790312900634.jpg';

interface HeroBannerProps {
  onSelectTab: (tab: 'mcq' | 'coding' | 'mental-models' | 'cheatsheet') => void;
  onOpenMockTest: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectTab, onOpenMockTest }) => {
  return (
    <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text / CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engineered for Campus Recruitment 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Ace Technical Rounds in TCS, Infosys, Cognizant & Wipro
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Understand Python the way interviewers test it. Master output prediction traps,
              write two-pointer and sliding-window algorithms with real Python execution, and build
              bulletproof mental models of memory allocation.
            </p>

            {/* Feature Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Real Python 3.10 Sandbox</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Memory Dry-Run Traces</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Hidden Test Case Runner</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onSelectTab('mcq')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-md hover:bg-emerald-300 transition-colors cursor-pointer shadow-sm"
              >
                <span>Practice Company MCQs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onSelectTab('coding')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Coding Arena</span>
              </button>

              <button
                onClick={() => onSelectTab('mental-models')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Cpu className="h-3.5 w-3.5 text-azure-400" />
                <span>Mental Models</span>
              </button>
            </div>
          </div>

          {/* Right Showcase Image Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl group">
              <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                <img
                  src={heroImg}
                  alt="Python algorithmic placement architecture"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG diagram if asset fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>

              {/* Bottom Card Summary */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium text-slate-200">
                    <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Campus Placement Syllabus</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400">8 Companies Covered</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-400">
                  <span>TCS NQT</span>
                  <span>·</span>
                  <span>Infosys DSY</span>
                  <span>·</span>
                  <span>Wipro NLTH</span>
                  <span>·</span>
                  <span>Cognizant</span>
                  <span>·</span>
                  <span>Accenture</span>
                  <span>·</span>
                  <span>Amazon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
