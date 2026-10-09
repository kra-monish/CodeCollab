import { execFile } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import vm from 'vm';

const EXECUTION_TIMEOUT_MS = 5000;
const MAX_BUFFER_BYTES = 1024 * 500;

const runProcess = (commandOptions, args = [], options = {}) => new Promise((resolve, reject) => {
  const { command, prefixArgs = [] } = commandOptions;

  execFile(
    command,
    [...prefixArgs, ...args],
    { timeout: EXECUTION_TIMEOUT_MS, maxBuffer: MAX_BUFFER_BYTES, ...options },
    (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    }
  );
});

const runWithCandidates = async (candidates, args = [], options = {}) => {
  let lastMissingError = null;

  for (const candidate of candidates) {
    try {
      return await runProcess(candidate, args, options);
    } catch (error) {
      if (error.code === 'ENOENT') {
        lastMissingError = error;
        continue;
      }

      throw error;
    }
  }

  const missingError = lastMissingError || new Error('Required runtime is not installed');
  missingError.code = 'ENOENT';
  throw missingError;
};

const getPythonCandidates = () => (
  process.platform === 'win32'
    ? [{ command: 'py', prefixArgs: ['-3'] }, { command: 'python' }]
    : [{ command: 'python3' }, { command: 'python' }]
);

const getCppCompilerCandidates = () => (
  process.platform === 'win32'
    ? [{ command: 'g++' }, { command: 'clang++' }, { command: 'c++' }]
    : [{ command: 'g++' }, { command: 'clang++' }, { command: 'c++' }]
);

const getJavaCompilerCandidates = () => [{ command: 'javac' }];
const getJavaRuntimeCandidates = () => [{ command: 'java' }];

const formatConsoleValue = (value) => {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

const formatExecutionError = (error, missingMessage) => ({
  output: error.stdout || '',
  error: error.code === 'ENOENT'
    ? missingMessage
    : error.code === 'EPERM'
      ? 'Code execution is blocked by the current server environment permissions'
      : (error.stderr || error.stdout || error.message || 'Execution error')
});

const createTempDir = async () => fs.mkdtemp(path.join(os.tmpdir(), 'codecollab-'));

const cleanupTempDir = async (dirPath) => {
  if (!dirPath) return;
  await fs.rm(dirPath, { recursive: true, force: true });
};

const executeJavaScript = async (code) => {
  const outputLines = [];
  const sandbox = {
    console: {
      log: (...args) => outputLines.push(args.map(formatConsoleValue).join(' ')),
      info: (...args) => outputLines.push(args.map(formatConsoleValue).join(' ')),
      warn: (...args) => outputLines.push(args.map(formatConsoleValue).join(' ')),
      error: (...args) => outputLines.push(args.map(formatConsoleValue).join(' '))
    }
  };

  const context = vm.createContext(sandbox);
  const wrappedCode = `(async () => {\n${code}\n})()`;
  const script = new vm.Script(wrappedCode);
  const result = await script.runInContext(context, { timeout: EXECUTION_TIMEOUT_MS });

  if (result !== undefined) {
    outputLines.push(formatConsoleValue(result));
  }

  return {
    output: outputLines.join('\n'),
    error: ''
  };
};

const executePython = async (code) => {
  let tempDir = '';

  try {
    tempDir = await createTempDir();
    const scriptPath = path.join(tempDir, 'main.py');
    await fs.writeFile(scriptPath, code, 'utf8');

    const { stdout, stderr } = await runWithCandidates(getPythonCandidates(), [scriptPath]);

    return {
      output: stdout || '',
      error: stderr || ''
    };
  } catch (error) {
    return formatExecutionError(error, 'Python runtime is not installed on the server');
  } finally {
    await cleanupTempDir(tempDir);
  }
};

const executeCpp = async (code) => {
  let tempDir = '';

  try {
    tempDir = await createTempDir();
    const sourcePath = path.join(tempDir, 'main.cpp');
    const executablePath = path.join(tempDir, process.platform === 'win32' ? 'program.exe' : 'program');
    await fs.writeFile(sourcePath, code, 'utf8');

    await runWithCandidates(
      getCppCompilerCandidates(),
      [sourcePath, '-std=c++17', '-O2', '-o', executablePath]
    );

    const { stdout, stderr } = await runProcess({ command: executablePath });

    return {
      output: stdout || '',
      error: stderr || ''
    };
  } catch (error) {
    return formatExecutionError(error, 'C++ compiler is not installed on the server');
  } finally {
    await cleanupTempDir(tempDir);
  }
};

const getJavaMainClassName = (code) => {
  const publicClassMatch = code.match(/\bpublic\s+class\s+([A-Za-z_][A-Za-z0-9_]*)\b/);
  if (publicClassMatch) {
    return publicClassMatch[1];
  }

  const classMatch = code.match(/\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\b/);
  return classMatch ? classMatch[1] : null;
};

const executeJava = async (code) => {
  let tempDir = '';

  try {
    const mainClassName = getJavaMainClassName(code);

    if (!mainClassName) {
      return {
        output: '',
        error: 'Java code must include a class declaration, such as `public class Main`.'
      };
    }

    tempDir = await createTempDir();
    const sourcePath = path.join(tempDir, `${mainClassName}.java`);
    await fs.writeFile(sourcePath, code, 'utf8');

    await runWithCandidates(getJavaCompilerCandidates(), [sourcePath], { cwd: tempDir });
    const { stdout, stderr } = await runWithCandidates(
      getJavaRuntimeCandidates(),
      ['-cp', tempDir, mainClassName],
      { cwd: tempDir }
    );

    return {
      output: stdout || '',
      error: stderr || ''
    };
  } catch (error) {
    return formatExecutionError(error, 'Java compiler/runtime is not installed on the server');
  } finally {
    await cleanupTempDir(tempDir);
  }
};

const executeByLanguage = async ({ code, language }) => {
  switch (language) {
    case 'javascript':
      return executeJavaScript(code);
    case 'python':
      return executePython(code);
    case 'cpp':
      return executeCpp(code);
    case 'java':
      return executeJava(code);
    default:
      return {
        output: '',
        error: `${language.toUpperCase()} not supported on this demo server`
      };
  }
};

// Execute provided code server-side
export const executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'No code provided' });
    }

    if (!language) {
      return res.status(400).json({ message: 'No language provided' });
    }

    const start = Date.now();
    const result = await executeByLanguage({ code, language });

    return res.json({
      output: result.output || '',
      error: result.error || '',
      executionTime: `${Date.now() - start}ms`
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
