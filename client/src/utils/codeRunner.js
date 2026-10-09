import api from './api';

// Calls server to execute code. Returns { output, error, executionTime }
export const runCode = async ({ code, language }) => {
  const res = await api.post('/code/execute', { code, language });
  return res.data;
};

export default runCode;
