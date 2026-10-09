import React from 'react';

// Toolbar with language selector and run button
const EditorToolbar = ({ language, setLanguage, onRun, roomId }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded bg-[#0b1014] p-2 text-sm">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => onRun()} className="rounded bg-blue-500 px-3 py-1 text-sm font-medium">Run Code</button>
      </div>
    </div>
  );
};

export default EditorToolbar;
