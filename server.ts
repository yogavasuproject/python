import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

// Safe Python Execution Endpoint
app.post('/api/run-python', async (req, res) => {
  const { code, input = '' } = req.body;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Code must be a string' });
  }

  // Safety filter for obvious malicious system calls
  const forbiddenPatterns = [
    /import\s+os/i,
    /from\s+os\s+import/i,
    /import\s+subprocess/i,
    /from\s+subprocess\s+import/i,
    /import\s+shutil/i,
    /open\s*\(/i,
    /__import__\s*\(\s*['"]os['"]\s*\)/i,
    /eval\s*\(\s*['"]__import__/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(code)) {
      return res.status(403).json({
        error: 'Execution Restricted: For security, file I/O, subprocess, and os operations are disabled in this placement sandbox.',
        output: '',
        executionTimeMs: 0,
        success: false,
      });
    }
  }

  const startTime = Date.now();
  let stdout = '';
  let stderr = '';
  let killed = false;

  // Execute using python3 with -u (unbuffered)
  const pyProcess = spawn('python3', ['-u', '-c', code], {
    timeout: 4000,
  });

  const timer = setTimeout(() => {
    killed = true;
    pyProcess.kill('SIGKILL');
  }, 4000);

  if (input && pyProcess.stdin) {
    try {
      pyProcess.stdin.write(input);
      pyProcess.stdin.end();
    } catch {
      // ignore
    }
  } else if (pyProcess.stdin) {
    pyProcess.stdin.end();
  }

  pyProcess.stdout.on('data', (data) => {
    stdout += data.toString();
    if (stdout.length > 50000) {
      stdout = stdout.substring(0, 50000) + '\n... [Output Truncated]';
      pyProcess.kill('SIGKILL');
    }
  });

  pyProcess.stderr.on('data', (data) => {
    stderr += data.toString();
    if (stderr.length > 20000) {
      stderr = stderr.substring(0, 20000) + '\n... [Error Truncated]';
      pyProcess.kill('SIGKILL');
    }
  });

  pyProcess.on('close', (exitCode) => {
    clearTimeout(timer);
    const executionTimeMs = Date.now() - startTime;

    if (killed) {
      return res.json({
        output: stdout,
        error: 'Time Limit Exceeded (4000ms limit). Check for infinite loops or deep recursion.',
        exitCode: -1,
        executionTimeMs,
        success: false,
      });
    }

    res.json({
      output: stdout,
      error: stderr,
      exitCode,
      executionTimeMs,
      success: exitCode === 0 && !stderr,
    });
  });

  pyProcess.on('error', (err) => {
    clearTimeout(timer);
    res.json({
      output: '',
      error: `Process error: ${err.message}`,
      exitCode: 1,
      executionTimeMs: Date.now() - startTime,
      success: false,
    });
  });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve static build in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev, attach Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PyPrep server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
