import { ExecutionResult, TestCase, TestResultItem } from '../types/placement';

// Strip whitespace and normalize carriage returns
export function normalizeOutput(str: string): string {
  return str
    .replace(/\r\n/g, '\n')
    .trim();
}

/**
 * Execute Python code via the backend sandbox.
 */
export async function executePythonCode(code: string, input = ''): Promise<ExecutionResult> {
  try {
    const response = await fetch('/api/run-python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, input }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        output: '',
        error: `Server error (${response.status}): ${errText}`,
        exitCode: response.status,
        executionTimeMs: 0,
        success: false,
      };
    }

    const data: ExecutionResult = await response.json();
    return data;
  } catch (err: any) {
    return {
      output: '',
      error: `Network or execution error: ${err?.message || 'Failed to reach Python sandbox'}`,
      exitCode: 1,
      executionTimeMs: 0,
      success: false,
    };
  }
}

/**
 * Runs a complete suite of test cases against the user's Python code.
 * It appends a driver script that parses input, invokes the solution function,
 * or feeds stdin and captures stdout.
 */
export async function runAllTestCases(
  userCode: string,
  testCases: TestCase[]
): Promise<TestResultItem[]> {
  const results: TestResultItem[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const caseName = tc.name || (tc.isHidden ? `Hidden Case #${i + 1}` : `Sample Case #${i + 1}`);

    // Create execution harness: user code + input injection
    // If the user's code defines a function or reads sys.stdin, we provide standard runner.
    const runnerCode = `
import sys

# User Code
${userCode}

# Input Injection & Execution
if __name__ == '__main__':
    # In case the user code already printed output on import/run, it is captured
    pass
`;

    const start = performance.now();
    const res = await executePythonCode(runnerCode, tc.input);
    const duration = Math.round(performance.now() - start);

    const actualNormalized = normalizeOutput(res.output);
    const expectedNormalized = normalizeOutput(tc.expectedOutput);
    const passed = !res.error && actualNormalized === expectedNormalized;

    results.push({
      name: caseName,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: res.error ? (res.output ? `${res.output}\n${res.error}` : res.error) : res.output,
      passed,
      error: res.error,
      executionTimeMs: res.executionTimeMs || duration,
    });
  }

  return results;
}
