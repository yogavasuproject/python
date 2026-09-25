import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, RotateCcw, Award } from 'lucide-react';
import { MCQQuestion } from '../types/placement';
import { COMPANY_MCQS } from '../data/mcqQuestions';

interface MockTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MockTestModal: React.FC<MockTestModalProps> = ({ isOpen, onClose }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<MCQQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600s)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examCompany, setExamCompany] = useState<'All' | 'TCS' | 'Infosys' | 'Cognizant'>('All');

  // Start / restart test
  const startTest = (company: 'All' | 'TCS' | 'Infosys' | 'Cognizant') => {
    setExamCompany(company);
    const pool =
      company === 'All'
        ? [...COMPANY_MCQS]
        : COMPANY_MCQS.filter((q) => q.company === company);

    // Shuffle and pick 5
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    setSelectedQuestions(shuffled);
    setCurrentIdx(0);
    setAnswers({});
    setTimeLeft(600);
    setIsSubmitted(false);
  };

  useEffect(() => {
    if (isOpen) {
      startTest('All');
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const currentQ = selectedQuestions[currentIdx];

  const handleSelectOption = (qId: string, optId: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate score
  let correctCount = 0;
  selectedQuestions.forEach((q) => {
    if (answers[q.id] === q.correctOptionId) {
      correctCount++;
    }
  });

  const percentage =
    selectedQuestions.length > 0
      ? Math.round((correctCount / selectedQuestions.length) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-lg border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Campus Mock Placement Simulator</h2>
              <div className="text-xs text-slate-400">
                Pattern: {examCompany === 'All' ? 'Mixed Multi-Company' : `${examCompany} Campus Drive`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div
                className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded border tabular-nums font-semibold ${
                  timeLeft < 120
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse'
                    : 'border-slate-700 bg-slate-800 text-slate-200'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isSubmitted && currentQ && (
            <div className="space-y-6">
              {/* Question Navigation Bubbles */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  {selectedQuestions.map((q, i) => {
                    const isAnswered = Boolean(answers[q.id]);
                    const isCurrent = i === currentIdx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(i)}
                        className={`h-7 w-7 rounded text-xs font-mono font-bold cursor-pointer transition-colors ${
                          isCurrent
                            ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                            : isAnswered
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-slate-400">
                  Question {currentIdx + 1} of {selectedQuestions.length}
                </div>
              </div>

              {/* Question Box */}
              <div>
                <div className="text-xs text-emerald-400 font-medium mb-1">
                  {currentQ.company} · {currentQ.topic}
                </div>
                <h3 className="text-base font-semibold text-white leading-snug">
                  {currentQ.question}
                </h3>

                {currentQ.codeSnippet && (
                  <pre className="mt-3 rounded border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
                    <code>{currentQ.codeSnippet}</code>
                  </pre>
                )}

                {/* Options */}
                <div className="mt-4 space-y-2.5">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`w-full flex items-start gap-3 rounded-md border p-3 text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold border border-slate-700 bg-slate-900">
                          {opt.id}
                        </span>
                        <div className="flex-1 font-mono whitespace-pre-line leading-relaxed">
                          {opt.text}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Submitted Scorecard & Analysis */}
          {isSubmitted && (
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center space-y-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Assessment Complete!</h3>
                <div className="text-3xl font-mono font-bold text-emerald-400 tabular-nums">
                  {correctCount} / {selectedQuestions.length} ({percentage}%)
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {percentage >= 80
                    ? 'Outstanding! Your Python fundamentals match Tier-1 campus placement criteria.'
                    : percentage >= 60
                    ? 'Good effort! Review the memory models and slicing quirks below to reach top percentiles.'
                    : 'Needs revision on pointer aliasing and default arguments. Review the detailed explanations below.'}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => startTest(examCompany)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-md hover:bg-emerald-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retake Another Set</span>
                  </button>
                </div>
              </div>

              {/* Review All Questions */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Detailed Answer Key & Traces</h4>
                {selectedQuestions.map((q, idx) => {
                  const userAns = answers[q.id];
                  const isCorrect = userAns === q.correctOptionId;

                  return (
                    <div
                      key={q.id}
                      className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">
                          Q{idx + 1}. {q.topic} ({q.company})
                        </span>
                        <div className="flex items-center gap-1 font-semibold">
                          {isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <AlertCircle className="h-3.5 w-3.5" /> Incorrect
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-slate-200">{q.question}</div>

                      {q.codeSnippet && (
                        <pre className="rounded border border-slate-800 bg-slate-950 p-2 font-mono text-[11px] text-slate-300 overflow-x-auto">
                          <code>{q.codeSnippet}</code>
                        </pre>
                      )}

                      <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                        <div>
                          <span className="text-slate-500">Your Answer: </span>
                          <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                            {userAns ? `Option ${userAns}` : 'Unanswered'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Correct Answer: </span>
                          <span className="text-emerald-400">Option {q.correctOptionId}</span>
                        </div>
                        <p className="text-slate-400 pt-1 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isSubmitted && (
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 bg-slate-900">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous
            </button>

            {currentIdx === selectedQuestions.length - 1 ? (
              <button
                onClick={() => setIsSubmitted(true)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentIdx((prev) => Math.min(selectedQuestions.length - 1, prev + 1))
                }
                className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 rounded hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
