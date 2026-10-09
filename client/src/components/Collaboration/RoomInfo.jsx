import React from 'react';

const RoomInfo = ({ roomId, language }) => {
  return (
    <div className="space-y-3">
      <div className="rounded bg-[#0d1117] p-3">
        <div className="text-sm text-gray-500">Room ID</div>
        <div className="font-mono text-lg text-white">{roomId}</div>
      </div>
      <div className="rounded bg-[#0d1117] p-3">
        <div className="text-sm text-gray-500">Language</div>
        <div className="text-white">{language}</div>
      </div>
    </div>
  );
};

export default RoomInfo;
