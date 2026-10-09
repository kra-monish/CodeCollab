import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { SocketProvider } from '../context/SocketContext.jsx';
import CodeEditor from '../components/Editor/CodeEditor.jsx';
import EditorToolbar from '../components/Editor/EditorToolbar.jsx';
import OutputPanel from '../components/Editor/OutputPanel.jsx';
import ChatPanel from '../components/Chat/ChatPanel.jsx';
import RoomInfo from '../components/Collaboration/RoomInfo.jsx';
import UserPresence from '../components/Collaboration/UserPresence.jsx';
import { runCode } from '../utils/codeRunner.js';

const Room = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Start coding together\nconsole.log("Hello CodeCollab");');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [executionTime, setExecutionTime] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId ?? '');
      toast.success('Room ID copied');
    } catch (err) {
      toast.error('Could not copy room ID');
    }
  };

  const handleRun = async () => {
    setOutput('Running...');
    setError('');
    const start = Date.now();
    try {
      const res = await runCode({ code, language });
      setOutput(res.output || '');
      setError(res.error || '');
      setExecutionTime(res.executionTime || `${Date.now() - start}ms`);
    } catch (err) {
      setError(err.message || 'Execution failed');
      setOutput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#111827] to-[#020617] px-4 py-6 text-white lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded px-3 py-2 text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-2xl font-semibold">Room {roomId}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="rounded bg-blue-600 px-3 py-1 text-sm">Copy ID</button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
          <div className="space-y-4 xl:min-w-0">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
              <RoomInfo roomId={roomId} language={language} />
            </div>
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
              <h3 className="mb-2 text-sm text-gray-400">Participants</h3>
              <UserPresence users={user ? [{ userId: user._id || 'current-user', username: user.username, color: '#4f8cff' }] : []} />
            </div>
          </div>

          <SocketProvider roomId={roomId} user={user}>
            <div className="flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] xl:h-[calc(100vh-10rem)] xl:min-h-0">
              <EditorToolbar language={language} setLanguage={setLanguage} onRun={handleRun} />
              <div className="min-h-0 flex-1 bg-[#0d1117]">
                <CodeEditor roomId={roomId} language={language} code={code} onCodeChange={setCode} />
              </div>
              <OutputPanel output={output} error={error} time={executionTime} />
            </div>

            <div className="min-h-[24rem] rounded-2xl border border-[#30363d] bg-[#161b22] p-4 xl:h-[calc(100vh-10rem)]">
              <ChatPanel roomId={roomId} />
            </div>
          </SocketProvider>
        </div>
      </div>
    </div>
  );
};

export default Room;
