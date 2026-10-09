import React from 'react';

const ChatMessage = ({ message }) => {
  const time = new Date(message.timestamp || Date.now()).toLocaleTimeString();
  return (
    <div className="rounded p-2" style={{ background: '#071018' }}>
      <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
        <div className="font-medium text-sm">{message.username}</div>
        <div>{time}</div>
      </div>
      <div className="text-sm text-gray-200">{message.content}</div>
    </div>
  );
};

export default ChatMessage;
