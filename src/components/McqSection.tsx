import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { CompanyName, MCQQuestion, TopicName } from '../types/placement';
import { COMPANY_MCQS } from '../data/mcqQuestions';

const COMPANIES: (CompanyName | 'All')[] = [
  'All',
  'TCS',
  'Infosys',
  'Wipro',
  'Cognizant',
  'Accenture',
  'Zoho',
  'Amazon',
  'Capgemini',
];

const TOPICS: (TopicName | 'All')[] = [
  'All',
  'Strings',
  'Lists & Tuples',
  'Dictionaries & Sets',
  'Functions & Scope',
  'OOPs & Classes',
  'Slicing & Iteration',
  'Recursion & Math',
  'Tricky Output',
];

export const McqSection: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyName | 'All'>('All');
  const [selectedTopic, setSelectedTopic] = useState<TopicName | 'All'>('All');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('pyprep_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pyprep_mcq_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [activeTraceQuestionId, setActiveTraceQuestionId] = useState<string | null>(null);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (userAnswers[questionId]) return; // already answered
    const updated = { ...userAnswers, [questionId]: optionId };
    setUserAnswers(updated);
    try {
      localStorage.setItem('pyprep_mcq_answers', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleResetQuestion = (questionId: string) => {
    const updated = { ...userAnswers };
    delete updated[questionId];
    setUserAnswers(updated);
    try {
      localStorage.setItem('pyprep_mcq_answers', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleBookmark = (questionId: string) => {
    const updated = bookmarkedIds.includes(questionId)
      ? bookmarkedIds.filter((id) => id !== questionId)
      : [...bookmarkedIds, questionId];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('pyprep_mcq_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const filteredQuestions = useMemo(() => {
    return COMPANY_MCQS.filter((q) => {
      if (selectedCompany !== 'All' && q.company !== selectedCompany) return false;
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false;
      if (showBookmarksOnly && !bookmarkedIds.includes(q.id)) return false;
      return true;
    });
  }, [selectedCompany, selectedTopic, showBookmarksOnly, bookmarkedIds]);

  const stats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    COMPANY_MCQS.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans) {
        answered++;
        if (ans === q.correctOptionId) {
          correct++;
        }
      }
    });
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { answered, correct, total: COMPANY_MCQS.length, accuracy };
  }, [userAnswers]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
            <span>Campus Placement Technical MCQ Vault</span>
            <span aria-hidden="true">·</span>
            <span>Real Company Patterns</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            High-Frequency Company Questions & Output Prediction
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            Master Python quirks tested in TCS NQT, Infosys, Cognizant, Wipro, and Amazon campus tests.
            Every question features memory dry-run diagrams, reference vs copy explanations, and common trap warnings.
          </p>
        </div>

        {/* Stats display */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-lg p-3 shrink-0">
          <div>
            <div className="text-xs text-slate-400">Questions Solved</div>
            <div className="text-lg font-semibold text-white font-mono tabular-nums">
              {stats.answered} <span className="text-xs text-slate-500 font-sans">/ {stats.total}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-xs text-slate-400">Accuracy</div>
            <div className="text-lg font-semibold text-emerald-400 font-mono tabular-nums">
              {stats.accuracy}%
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-xs text-slate-400">Saved</div>
            <div className="text-lg font-semibold text-slate-200 font-mono tabular-nums">
              {bookmarkedIds.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Company Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {COMPANIES.map((company) => {
            const isActive = selectedCompany === company;
            return (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                {company}
              </button>
            );
          })}
        </div>

        {/* Secondary filters: Topic & Bookmarked */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              aria-label="Filter by Topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value as TopicName | 'All')}
              className="bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:border-slate-700 cursor-pointer appearance-none"
            >
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic === 'All' ? 'All Placement Topics' : topic}
                </option>
              ))}
            </select>
            <Filter className="h-3 w-3 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer border ${
              showBookmarksOnly
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved ({bookmarkedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-8 space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-12 text-center">
            <p className="text-sm text-slate-400">
              No questions found matching your filter criteria. Try clearing the company or bookmark filter.
            </p>
            <button
              onClick={() => {
                setSelectedCompany('All');
                setSelectedTopic('All');
                setShowBookmarksOnly(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-md hover:bg-emerald-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, qIndex) => {
            const selectedOpt = userAnswers[q.id];
            const isAnswered = Boolean(selectedOpt);
            const isCorrect = selectedOpt === q.correctOptionId;
            const isBookmarked = bookmarkedIds.includes(q.id);
            const isTraceOpen = activeTraceQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 transition-colors hover:border-slate-700/80 p-5 sm:p-6"
              >
                {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{q.company}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.roleExam}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        q.difficulty === 'Easy'
                          ? 'text-emerald-400'
                          : q.difficulty === 'Medium'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAnswered && (
                      <button
                        onClick={() => handleResetQuestion(q.id)}
                        title="Reset answer"
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                      className="p-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-amber-400" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="mt-3 text-base font-semibold text-white leading-snug">
                  <span className="text-slate-500 font-mono mr-2">{qIndex + 1}.</span>
                  {q.question}
                </h3>

                {/* Code Snippet Box */}
                {q.codeSnippet && (
                  <div className="mt-3 overflow-hidden rounded-md border border-slate-800 bg-slate-950 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800/80 px-3 py-1.5 text-[11px] text-slate-500">
                      <span>Python 3</span>
                      <span>Output Prediction</span>
                    </div>
                    <div className="overflow-x-auto p-4 text-slate-200">
                      <pre className="leading-relaxed">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Options List */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;
                    const isOptionCorrect = opt.id === q.correctOptionId;

                    let optionStyle =
                      'border-slate-800 bg-slate-950/60 hover:bg-slate-800/70 hover:border-slate-700 text-slate-300';

                    if (isAnswered) {
                      if (isOptionCorrect) {
                        optionStyle =
                          'border-emerald-500/50 bg-emerald-500/10 text-emerald-200 font-medium';
                      } else if (isSelected && !isOptionCorrect) {
                        optionStyle =
                          'border-rose-500/50 bg-rose-500/10 text-rose-200';
                      } else {
                        optionStyle = 'border-slate-800/50 bg-slate-950/30 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`flex items-start gap-3 rounded-md border p-3 text-left text-xs transition-colors cursor-pointer ${optionStyle}`}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold border border-slate-700 bg-slate-900 text-slate-300">
                          {opt.id}
                        </span>
                        <div className="flex-1 font-mono whitespace-pre-line leading-relaxed">
                          {opt.text}
                        </div>
                        {isAnswered && isOptionCorrect && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                        )}
                        {isAnswered && isSelected && !isOptionCorrect && (
                          <XCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation and Memory Trace Panel */}
                {isAnswered && (
                  <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>The Placement Mental Model: {q.mentalModelKey}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {q.explanation}
                    </p>

                    {/* Step-by-Step Memory Dry-Run if available */}
                    {q.memoryTrace && q.memoryTrace.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() =>
                            setActiveTraceQuestionId(isTraceOpen ? null : q.id)
                          }
                          className="flex items-center gap-1.5 text-xs font-medium text-azure-400 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <Layers className="h-3.5 w-3.5 text-emerald-400" />
                          <span>
                            {isTraceOpen ? 'Hide Memory Dry-Run' : 'View Step-by-Step Memory Dry-Run'}
                          </span>
                          <ChevronRight
                            className={`h-3 w-3 transition-transform ${
                              isTraceOpen ? 'rotate-90' : ''
                            }`}
                          />
                        </button>

                        {isTraceOpen && (
                          <div className="mt-3 space-y-2">
                            {q.memoryTrace.map((step) => (
                              <div
                                key={step.step}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded bg-slate-900 border border-slate-800 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-emerald-400 font-bold">
                                    0{step.step}.
                                  </span>
                                  <span className="font-medium text-slate-200">
                                    {step.title}:
                                  </span>
                                  <span className="text-slate-400">{step.desc}</span>
                                </div>
                                <code className="font-mono text-[11px] text-amber-300 bg-slate-950 px-2 py-1 rounded shrink-0">
                                  {step.memoryState}
                                </code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
