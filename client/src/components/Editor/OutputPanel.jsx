import React from 'react';

const OutputPanel = ({ output, error, time }) => {
  return (
    <div className="max-h-52 min-h-[9rem] shrink-0 overflow-auto rounded-b-2xl border-t border-[#30363d] bg-[#071018] p-4 font-mono text-sm text-gray-200">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
        <div>Output</div>
        <div>{time ? `${time} elapsed` : ''}</div>
      </div>
      {error ? (
        <pre className="whitespace-pre-wrap text-red-400">{error}</pre>
      ) : (
        <pre className="whitespace-pre-wrap">{output}</pre>
      )}
    </div>
  );
};

export default OutputPanel;
