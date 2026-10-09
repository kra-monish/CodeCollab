import React from 'react';

const UserPresence = ({ users = [] }) => {
  return (
    <div className="space-y-2">
      {users.map((u) => (
        <div key={u.userId} className="flex items-center gap-2">
          <div style={{ background: u.color || '#58a6ff' }} className="h-3 w-3 rounded-full" />
          <div className="text-sm">{u.username}</div>
        </div>
      ))}
    </div>
  );
};

export default UserPresence;
