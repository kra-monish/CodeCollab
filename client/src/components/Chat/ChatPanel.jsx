import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import ChatMessage from './ChatMessage.jsx';
import { useSocket } from '../../context/SocketContext.jsx';

const ChatPanel = ({ roomId }) => {
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => setMessages((s) => [...s, msg]);
    const errorHandler = (payload) => {
      toast.error(payload?.message || 'Unable to send message');
    };

    socket.on('new-message', handler);
    socket.on('error', errorHandler);

    return () => {
      socket.off('new-message', handler);
      socket.off('error', errorHandler);
    };
  }, [socket]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;

    if (!socket || !socket.emit) {
      toast.error('Chat is not connected yet');
      return;
    }

    socket.emit('send-message', { roomId, message: text.trim() });
    setText('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Chat</div>
        <div className={`text-xs ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-2 overflow-auto rounded bg-[#071018] p-3">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-400">No messages yet. Say hello.</div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message._id || `${message.timestamp || 'message'}-${index}`}
              message={message}
            />
          ))
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              send();
            }
          }}
          className="flex-1 rounded bg-[#0b1014] p-2 text-sm"
          placeholder={connected ? 'Type a message' : 'Waiting for connection...'}
          disabled={!connected}
        />
        <button onClick={send} disabled={!connected || !text.trim()} className="rounded bg-blue-500 px-3 py-1 text-sm disabled:opacity-50">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
