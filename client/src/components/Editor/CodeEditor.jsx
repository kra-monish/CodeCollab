import React, { useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useSocket } from '../../context/SocketContext.jsx';

// Monaco-based editor that emits code changes and cursor moves via socket
const CodeEditor = ({ roomId, language, code, onCodeChange }) => {
  const monaco = useMonaco();
  const { socket } = useSocket();
  const changeTimeout = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const disp = editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      if (socket && socket.emit) {
        socket.emit('cursor-move', { roomId, position });
      }
    });

    return () => disp.dispose();
  }, [socket, roomId]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    editor.getModel().setValue(code || '');
  };

  const handleChange = (value) => {
    onCodeChange(value);
    // debounce 300ms before sending
    if (changeTimeout.current) clearTimeout(changeTimeout.current);
    changeTimeout.current = setTimeout(() => {
      if (socket && socket.emit) socket.emit('code-change', { roomId, newCode: value });
    }, 300);
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      theme="vs-dark"
      value={code}
      onMount={handleMount}
      onChange={handleChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        lineNumbers: 'on',
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true
      }}
    />
  );
};

export default CodeEditor;
