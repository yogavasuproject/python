/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { McqSection } from './components/McqSection';
import { CodingSection } from './components/CodingSection';
import { ConceptVisualizer } from './components/ConceptVisualizer';
import { CheatSheetSection } from './components/CheatSheetSection';
import { CodePlaygroundModal } from './components/CodePlaygroundModal';
import { MockTestModal } from './components/MockTestModal';
import { COMPANY_CODING_CHALLENGES } from './data/codingChallenges';

export default function App() {
  const [activeTab, setActiveTab] = useState<'mcq' | 'coding' | 'mental-models' | 'cheatsheet'>('mcq');
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [isMockTestOpen, setIsMockTestOpen] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pyprep_solved_challenges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar following 3-Zone Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPlayground={() => setIsPlaygroundOpen(true)}
        onOpenMockTest={() => setIsMockTestOpen(true)}
        solvedCount={solvedChallenges.length}
        totalCodingCount={COMPANY_CODING_CHALLENGES.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero banner shown on landing or toggle */}
        <HeroBanner
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenMockTest={() => setIsMockTestOpen(true)}
        />

        {/* Dynamic Section View */}
        <div className="py-2">
          {activeTab === 'mcq' && <McqSection />}
          {activeTab === 'coding' && (
            <CodingSection
              onSolvedUpdate={(updated) => setSolvedChallenges(updated)}
            />
          )}
          {activeTab === 'mental-models' && <ConceptVisualizer />}
          {activeTab === 'cheatsheet' && <CheatSheetSection />}
        </div>
      </main>

      {/* Quiet, anti-slop Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-500 text-center">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">PyPrep Campus Engine</span>
            <span>·</span>
            <span>Python Placement Syllabus for Engineering Graduates</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>TCS NQT</span>
            <span>·</span>
            <span>Infosys InfyTQ</span>
            <span>·</span>
            <span>Cognizant GenC</span>
            <span>·</span>
            <span>Wipro NLTH</span>
            <span>·</span>
            <span>Zoho</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CodePlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
      />

      <MockTestModal
        isOpen={isMockTestOpen}
        onClose={() => setIsMockTestOpen(false)}
      />
    </div>
  );
}
