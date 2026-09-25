import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  HardDrive,
  AlertTriangle,
  Code2,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { CompanyName, CodingChallenge, TestCase, TestResultItem } from '../types/placement';
import { COMPANY_CODING_CHALLENGES } from '../data/codingChallenges';
import { runAllTestCases } from '../services/pythonRunner';

interface CodingSectionProps {
  onSolvedUpdate?: (solvedIds: string[]) => void;
}

export const CodingSection: React.FC<CodingSectionProps> = ({ onSolvedUpdate }) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    COMPANY_CODING_CHALLENGES[0].id
  );
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<CompanyName | 'All'>('All');
  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('pyprep_user_codes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pyprep_solved_challenges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResultItem[] | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'pitfalls'>('problem');

  const currentChallenge: CodingChallenge =
    COMPANY_CODING_CHALLENGES.find((c) => c.id === selectedChallengeId) ||
    COMPANY_CODING_CHALLENGES[0];

  const currentCode = codeMap[currentChallenge.id] || currentChallenge.starterCode;

  const filteredChallenges = COMPANY_CODING_CHALLENGES.filter(
    (c) => selectedCompanyFilter === 'All' || c.company === selectedCompanyFilter
  );

  const handleCodeChange = (newCode: string) => {
    const updated = { ...codeMap, [currentChallenge.id]: newCode };
    setCodeMap(updated);
    try {
      localStorage.setItem('pyprep_user_codes', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleResetCode = () => {
    handleCodeChange(currentChallenge.starterCode);
    setTestResults(null);
  };

  const handleLoadSolution = () => {
    handleCodeChange(currentChallenge.solutionCode);
    setTestResults(null);
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults(null);

    const allTestCases: TestCase[] = [
      ...currentChallenge.sampleCases,
      ...currentChallenge.hiddenTestCases,
    ];

    try {
      const results = await runAllTestCases(currentCode, allTestCases);
      setTestResults(results);

      const allPassed = results.every((r) => r.passed);
      if (allPassed && !solvedIds.includes(currentChallenge.id)) {
        const nextSolved = [...solvedIds, currentChallenge.id];
        setSolvedIds(nextSolved);
        try {
          localStorage.setItem('pyprep_solved_challenges', JSON.stringify(nextSolved));
        } catch {
          // ignore
        }
        if (onSolvedUpdate) onSolvedUpdate(nextSolved);
      }
    } catch (err: any) {
      setTestResults([
        {
          name: 'Execution Error',
          input: '',
          expected: '',
          actual: `Failed to execute: ${err?.message || 'Sandbox timeout'}`,
          passed: false,
          error: err?.message,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard support: Handle Tab key in textarea to insert 4 spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      const updated = val.substring(0, start) + '    ' + val.substring(end);
      handleCodeChange(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const isCurrentSolved = solvedIds.includes(currentChallenge.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
            <span>Engineering Campus Coding Arena</span>
            <span aria-hidden="true">·</span>
            <span>Real Placement Test Runner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Short Coding Challenges & Optimal Placement Algorithms
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            Write and execute real Python 3.10 code against hidden company test cases. Get instant
            feedback, asymptotic Big-O breakdown, and optimal two-pointer and hash-map patterns.
          </p>
        </div>

        {/* Company filter row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Amazon', 'Accenture', 'Zoho', 'Capgemini'] as const).map(
            (c) => (
              <button
                key={c}
                onClick={() => setSelectedCompanyFilter(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCompanyFilter === c
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {c}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main 2-column or split layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Challenge Selector & Problem Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Challenge Selector Carousel/List */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-1 max-h-56 overflow-y-auto">
            <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
              Placement Challenges ({filteredChallenges.length})
            </div>
            {filteredChallenges.map((ch) => {
              const isSelected = ch.id === selectedChallengeId;
              const isSolved = solvedIds.includes(ch.id);

              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelectedChallengeId(ch.id);
                    setTestResults(null);
                    setShowSolution(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-md text-left transition-colors cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-slate-800 text-white font-medium border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isSolved ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-700 shrink-0" />
                    )}
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-slate-500">
                    <span>{ch.company}</span>
                    <span aria-hidden="true">·</span>
                    <span className={ch.difficulty === 'Easy' ? 'text-emerald-400' : 'text-amber-400'}>
                      {ch.difficulty}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Problem Statement Card */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
            {/* Unboxed Metadata Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-white">{currentChallenge.company}</span>
                <span aria-hidden="true">·</span>
                <span>{currentChallenge.roleExam}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">{currentChallenge.frequency}</span>
              </div>

              {isCurrentSolved && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Solved</span>
                </div>
              )}
            </div>

            <h2 className="mt-2 text-lg font-bold text-white tracking-tight">
              {currentChallenge.title}
            </h2>

            {/* Sub-tabs: Description vs Intuition/Solution vs Common Traps */}
            <div className="mt-4 flex items-center gap-1 p-1 bg-slate-950 rounded-md border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('problem')}
                className={`flex-1 py-1.5 text-center font-medium rounded transition-colors cursor-pointer ${
                  activeTab === 'problem'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Problem & Cases
              </button>
              <button
                onClick={() => setActiveTab('solution')}
                className={`flex-1 py-1.5 text-center font-medium rounded transition-colors cursor-pointer ${
                  activeTab === 'solution'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Intuition & Optimal
              </button>
              <button
                onClick={() => setActiveTab('pitfalls')}
                className={`flex-1 py-1.5 text-center font-medium rounded transition-colors cursor-pointer ${
                  activeTab === 'pitfalls'
                    ? 'bg-slate-800 text-amber-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Common Pitfalls
              </button>
            </div>

            {/* Tab 1: Problem & Constraints */}
            {activeTab === 'problem' && (
              <div className="mt-4 space-y-4 text-xs">
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentChallenge.description}
                </div>

                {/* Constraints */}
                <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
                  <div className="font-semibold text-slate-200 mb-1.5">Placement Constraints:</div>
                  <ul className="space-y-1 text-slate-400">
                    {currentChallenge.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">▸</span>
                        <code className="font-mono text-slate-300">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sample Test Cases */}
                <div>
                  <div className="font-semibold text-slate-200 mb-2">Sample Cases:</div>
                  <div className="space-y-2.5">
                    {currentChallenge.sampleCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="rounded-md border border-slate-800/80 bg-slate-950 p-3 space-y-1.5 font-mono text-[11px]"
                      >
                        <div className="text-slate-500 font-sans font-semibold text-xs">
                          Sample #{idx + 1}
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-500 font-sans">Input:</span>
                          <span className="text-slate-200">{tc.input}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-500 font-sans">Expected Output:</span>
                          <span className="text-emerald-400">{tc.expectedOutput}</span>
                        </div>
                        {tc.explanation && (
                          <div className="text-slate-400 font-sans text-xs pt-1 border-t border-slate-800/60">
                            {tc.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Intuition & Reference Solution */}
            {activeTab === 'solution' && (
              <div className="mt-4 space-y-4 text-xs">
                <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <Lightbulb className="h-4 w-4" />
                    <span>The Placement Intuition</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentChallenge.intuition}
                  </p>
                </div>

                {/* Time & Space Complexity */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-slate-800 bg-slate-950 p-2.5">
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <Clock className="h-3 w-3 text-emerald-400" />
                      <span>Time Complexity</span>
                    </div>
                    <div className="font-mono text-white text-[11px]">
                      {currentChallenge.timeComplexity}
                    </div>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-950 p-2.5">
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <HardDrive className="h-3 w-3 text-azure-400" />
                      <span>Space Complexity</span>
                    </div>
                    <div className="font-mono text-white text-[11px]">
                      {currentChallenge.spaceComplexity}
                    </div>
                  </div>
                </div>

                {/* Reference Code */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-300">Optimal Python Solution:</span>
                    <button
                      onClick={handleLoadSolution}
                      className="text-emerald-400 hover:underline cursor-pointer text-[11px]"
                    >
                      Load into Editor
                    </button>
                  </div>
                  <pre className="rounded-md border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-emerald-200 overflow-x-auto leading-relaxed">
                    <code>{currentChallenge.solutionCode}</code>
                  </pre>
                </div>

                {currentChallenge.oneLinerAlternative && (
                  <div>
                    <div className="font-semibold text-slate-300 mb-1">Pythonic 1-Liner:</div>
                    <pre className="rounded border border-slate-800 bg-slate-950 p-2 font-mono text-[11px] text-amber-200 overflow-x-auto">
                      <code>{currentChallenge.oneLinerAlternative}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Common Pitfalls */}
            {activeTab === 'pitfalls' && (
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Traps That Cost Students Placements:</span>
                </div>
                {currentChallenge.commonPitfalls.map((pitfall, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-slate-300 leading-relaxed"
                  >
                    <span className="font-semibold text-amber-300">Trap #{i + 1}: </span>
                    {pitfall}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Test Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Editor Container */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            {/* Editor Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 bg-slate-900/90 text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">solution.py</span>
                <span className="text-slate-500">· Python 3.10</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  title="Reset to starter code"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer text-xs"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleRunTests}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-slate-950 bg-emerald-400 rounded hover:bg-emerald-300 transition-colors cursor-pointer text-xs disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="h-3 w-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      <span>Running Tests...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" />
                      <span>Run Placement Tests</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Textarea with auto tab indent */}
            <div className="relative font-mono text-xs">
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                rows={18}
                className="w-full bg-slate-950 p-4 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-emerald-500/30"
                placeholder="# Write your Python placement solution here..."
              />
            </div>
          </div>

          {/* Test Results Output Deck */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Test Case Evaluation Deck</h3>
              </div>

              {testResults && (
                <div className="text-xs font-mono tabular-nums">
                  {testResults.filter((r) => r.passed).length}/{testResults.length} Cases Passed
                </div>
              )}
            </div>

            {!testResults && !isRunning && (
              <div className="text-center py-6 text-xs text-slate-500">
                Click <span className="text-emerald-400 font-semibold">"Run Placement Tests"</span> to
                execute your code against sample & hidden test cases.
              </div>
            )}

            {isRunning && (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-xs text-slate-400">
                <div className="h-6 w-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                <span>Compiling & Evaluating against company test cases...</span>
              </div>
            )}

            {testResults && (
              <div className="space-y-3">
                {testResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`rounded-md border p-3 font-mono text-xs transition-colors ${
                      result.passed
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-200'
                        : 'border-rose-500/30 bg-rose-500/5 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-sans mb-1.5">
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-semibold text-white">{result.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {result.executionTimeMs} ms
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] mt-2 pt-2 border-t border-slate-800/60">
                      {result.input && (
                        <div>
                          <span className="text-slate-500 font-sans">Input: </span>
                          <span className="text-slate-300">{result.input}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-500 font-sans">Expected: </span>
                        <span className="text-emerald-400">{result.expected}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans">Your Output: </span>
                        <span className={result.passed ? 'text-emerald-300' : 'text-rose-400'}>
                          {result.actual || '(empty)'}
                        </span>
                      </div>
                      {result.error && (
                        <div className="mt-1 text-rose-400 text-xs whitespace-pre-wrap font-mono bg-slate-950 p-2 rounded">
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {testResults.every((r) => r.passed) && (
                  <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>
                      All test cases passed! Solution verified for placement assessment.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
