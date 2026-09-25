import React, { useState } from 'react';
import { Copy, Check, Search, BookOpen, Clock, Lightbulb } from 'lucide-react';
import { CHEAT_SHEET_DATA } from '../data/cheatSheetData';

export const CheatSheetSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const categories = ['All', 'Time Complexity', 'Placement 1-Liners', 'OOPs & Dunder', 'Common Traps'];

  const filteredEntries = CHEAT_SHEET_DATA.filter((entry) => {
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
    const matchesQuery =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
            <span>Essential Placement Reference</span>
            <span aria-hidden="true">·</span>
            <span>Last-Minute Revision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Python Placement Cheat Sheets & Time Complexities
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            High-yield reference cards covering Big-O asymptotics, OOPs dunder internals, and
            standard library tools required for engineering campus placement tests.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search syntax, methods, Big-O..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-md pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Cheat Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEntries.map((entry, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              {/* Header with unboxed metadata */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-emerald-400">{entry.category}</span>
                {entry.complexity && (
                  <span className="font-mono text-[11px] text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {entry.complexity}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white tracking-tight">{entry.title}</h3>

              {/* Code Snippet */}
              <div className="mt-3 relative rounded-md border border-slate-800 bg-slate-950 font-mono text-xs overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/80 text-[11px] text-slate-500 bg-slate-900/50">
                  <span>Python</span>
                  <button
                    onClick={() => handleCopy(entry.code, idx)}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{entry.code}</code>
                </pre>
              </div>

              {/* Explanation */}
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                {entry.explanation}
              </p>
            </div>

            {/* Placement Interview Tip */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-300/90">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong className="text-amber-300">Recruiter Tip:</strong> {entry.interviewTip}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
