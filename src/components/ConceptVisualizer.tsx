import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Play,
  Layers,
} from 'lucide-react';
import { MENTAL_MODELS } from '../data/mentalModels';
import { executePythonCode } from '../services/pythonRunner';

export const ConceptVisualizer: React.FC = () => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(MENTAL_MODELS[0].id);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [liveOutput, setLiveOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const concept =
    MENTAL_MODELS.find((m) => m.id === selectedConceptId) || MENTAL_MODELS[0];
  const step = concept.steps[currentStepIdx] || concept.steps[0];

  const handleNextStep = () => {
    if (currentStepIdx < concept.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      setLiveOutput(null);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      setLiveOutput(null);
    }
  };

  const handleSelectConcept = (id: string) => {
    setSelectedConceptId(id);
    setCurrentStepIdx(0);
    setLiveOutput(null);
  };

  const handleRunLiveSnippet = async () => {
    setIsExecuting(true);
    setLiveOutput(null);
    try {
      const res = await executePythonCode(step.codeSnippet);
      setLiveOutput(res.output || res.error || 'Code executed successfully with no output.');
    } catch (e: any) {
      setLiveOutput(`Execution error: ${e.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
          <span>Placement Intuition & Mental Models</span>
          <span aria-hidden="true">·</span>
          <span>Zero-Confusion Memory Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Python Memory Architecture & Visual Tracers
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          The #1 reason engineering graduates miss questions in technical interviews is confusing
          C/Java pass-by-value with Python's <em>pass-by-object-reference</em>. Step through real
          heap pointer diagrams and see how Python actually manages memory.
        </p>
      </div>

      {/* Concept Selector Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MENTAL_MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelectConcept(m.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              m.id === selectedConceptId
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage & Concept Deck */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Pointer / Memory Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
            {/* Stage Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Stage {currentStepIdx + 1} of {concept.steps.length}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{step.title}</h3>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIdx === 0}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStepIdx === concept.steps.length - 1}
                  className="px-3 py-1 text-xs font-medium text-slate-950 bg-emerald-400 rounded hover:bg-emerald-300 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Next Step
                </button>
              </div>
            </div>

            {/* Visual Pointer Diagram Canvas */}
            <div className="mt-5 rounded-md border border-slate-800/80 bg-slate-950 p-6 min-h-[260px] flex flex-col justify-center">
              <div className="text-[11px] font-mono text-slate-500 mb-4 flex items-center justify-between">
                <span>VARIABLE NAMESPACE (STACK / SCOPE)</span>
                <span>HEAP MEMORY OBJECTS (PYOBJECT)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Names (Tags) */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Variable Tags:</div>
                  {step.pointerDiagram.variables.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-white">{v.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <span>points to</span>
                        <ArrowRight className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-300">{v.targetId}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Heap Objects */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Heap Objects:</div>
                  {step.pointerDiagram.objects.map((obj) => (
                    <div
                      key={obj.id}
                      className="p-3 rounded border border-emerald-500/30 bg-emerald-500/5 text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-semibold">{obj.id}</span>
                        {obj.address && <span>Addr: {obj.address}</span>}
                      </div>
                      <div className="text-slate-300 text-[11px]">Type: {obj.type}</div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-300 font-bold text-sm">
                        {obj.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Explanation of current step */}
            <div className="mt-4 p-3.5 rounded-md bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">What is happening: </span>
              {step.explanation}
            </div>
          </div>
        </div>

        {/* Right: Code & Sandbox verification (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Python Execution Test</h3>
              </div>
              <button
                onClick={handleRunLiveSnippet}
                disabled={isExecuting}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 rounded hover:bg-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{isExecuting ? 'Running...' : 'Run in Python 3.10'}</span>
              </button>
            </div>

            {/* Code Box */}
            <pre className="rounded border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
              <code>{step.codeSnippet}</code>
            </pre>

            {/* Live Terminal Output */}
            {liveOutput && (
              <div className="mt-3 rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs">
                <div className="text-[11px] text-slate-500 mb-1">Standard Output:</div>
                <div className="text-emerald-400 whitespace-pre-wrap">{liveOutput}</div>
              </div>
            )}

            {/* Why Campus Recruiters Ask This */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Campus Placement Relevance</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {concept.whyAskedInInterviews}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
