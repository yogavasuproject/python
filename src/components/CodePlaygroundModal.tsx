import React, { useState } from 'react';
import { X, Play, RotateCcw, Terminal, Clock, AlertCircle } from 'lucide-react';
import { executePythonCode } from '../services/pythonRunner';

interface CodePlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SNIPPET = `# Python 3.10 Placement Scratchpad
# Test list slicing, dictionaries, or custom placement code:

arr = [1, 2, 3, 4, 5]
print("Reversed list:", arr[::-1])

# Dictionary comprehension test
squares = {x: x**2 for x in range(6) if x % 2 == 0}
print("Even squares dict:", squares)
`;

export const CodePlaygroundModal: React.FC<CodePlaygroundModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState(DEFAULT_SNIPPET);
  const [stdinInput, setStdinInput] = useState('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [execTime, setExecTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    setExecTime(null);

    try {
      const res = await executePythonCode(code, stdinInput);
      setOutput(res.output);
      setError(res.error || '');
      setExecTime(res.executionTimeMs);
    } catch (e: any) {
      setError(e.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      const updated = val.substring(0, start) + '    ' + val.substring(end);
      setCode(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-lg border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3 bg-slate-900">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Live Python 3.10 Playground</h2>
            <span className="text-xs text-slate-400 font-mono">· Sandbox Execution</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCode(DEFAULT_SNIPPET);
                setOutput('');
                setError('');
              }}
              title="Reset code"
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Code Editor (7 cols) */}
          <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2 bg-slate-900/60 text-xs text-slate-400 font-mono">
              <span>scratchpad.py</span>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-slate-950 bg-emerald-400 rounded hover:bg-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 resize-none bg-slate-950 p-4 font-mono text-xs text-slate-100 leading-relaxed focus:outline-none"
              placeholder="# Type Python code here..."
            />
          </div>

          {/* Right: Stdin & Terminal Output (5 cols) */}
          <div className="flex flex-col bg-slate-950 lg:col-span-5 overflow-hidden">
            {/* Stdin Box */}
            <div className="border-b border-slate-800 p-3 bg-slate-900/40">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Standard Input (stdin):
              </label>
              <textarea
                value={stdinInput}
                onChange={(e) => setStdinInput(e.target.value)}
                placeholder="Optional input for input() or sys.stdin..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-700 resize-none"
              />
            </div>

            {/* Output Console */}
            <div className="flex-1 flex flex-col p-4 overflow-y-auto font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 border-b border-slate-800 pb-1">
                <span>TERMINAL OUTPUT</span>
                {execTime !== null && (
                  <span className="flex items-center gap-1 text-slate-400 tabular-nums">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    {execTime} ms
                  </span>
                )}
              </div>

              {!output && !error && !isRunning && (
                <div className="text-slate-600 text-xs italic py-6 text-center">
                  Output will appear here after clicking "Run Code".
                </div>
              )}

              {isRunning && (
                <div className="flex items-center gap-2 text-slate-400 py-4">
                  <div className="h-3 w-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                  <span>Running in sandbox...</span>
                </div>
              )}

              {output && (
                <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {output}
                </pre>
              )}

              {error && (
                <div className="mt-2 text-rose-400 whitespace-pre-wrap leading-relaxed bg-rose-500/10 p-2.5 rounded border border-rose-500/20">
                  <div className="flex items-center gap-1 font-semibold text-rose-300 mb-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Error / Traceback:</span>
                  </div>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
