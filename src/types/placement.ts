export type CompanyName =
  | 'TCS'
  | 'Infosys'
  | 'Wipro'
  | 'Cognizant'
  | 'Accenture'
  | 'Zoho'
  | 'Amazon'
  | 'Capgemini';

export type TopicName =
  | 'Strings'
  | 'Lists & Tuples'
  | 'Dictionaries & Sets'
  | 'Functions & Scope'
  | 'OOPs & Classes'
  | 'Slicing & Iteration'
  | 'Recursion & Math'
  | 'Tricky Output';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface MCQOption {
  id: string;
  text: string;
}

export interface MemoryTraceStep {
  step: number;
  title: string;
  memoryState: string;
  desc: string;
}

export interface MCQQuestion {
  id: string;
  company: CompanyName;
  roleExam: string; // e.g. "TCS NQT", "InfyTQ", "Wipro NLTH"
  topic: TopicName;
  difficulty: Difficulty;
  question: string;
  codeSnippet?: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
  mentalModelKey: string;
  memoryTrace?: MemoryTraceStep[];
}

export interface TestCase {
  id?: string;
  name?: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingChallenge {
  id: string;
  title: string;
  company: CompanyName;
  roleExam: string;
  topic: TopicName;
  difficulty: Difficulty;
  frequency: 'High' | 'Very High' | 'Top Repeated';
  description: string;
  constraints: string[];
  inputFormat: string;
  outputFormat: string;
  sampleCases: TestCase[];
  hiddenTestCases: TestCase[];
  starterCode: string;
  solutionCode: string;
  oneLinerAlternative?: string;
  intuition: string;
  timeComplexity: string;
  spaceComplexity: string;
  commonPitfalls: string[];
}

export interface ExecutionResult {
  output: string;
  error?: string;
  exitCode: number;
  executionTimeMs: number;
  success: boolean;
}

export interface TestResultItem {
  name: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
  executionTimeMs?: number;
}

export interface MentalModelStep {
  step: number;
  title: string;
  codeSnippet: string;
  pointerDiagram: {
    variables: { name: string; targetId: string; color: string }[];
    objects: { id: string; type: string; value: string; address?: string }[];
  };
  explanation: string;
}

export interface MentalModelConcept {
  id: string;
  title: string;
  tagline: string;
  category: string;
  whyAskedInInterviews: string;
  steps: MentalModelStep[];
}

export interface CheatSheetEntry {
  title: string;
  category: 'Time Complexity' | 'Placement 1-Liners' | 'OOPs & Dunder' | 'Common Traps';
  code: string;
  complexity?: string;
  explanation: string;
  interviewTip: string;
}
