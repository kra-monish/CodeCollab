import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    return window.location.origin;
  }

  return apiUrl.replace(/\/api\/?$/, '');
};

export const SocketProvider = ({ children, roomId, user }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const sock = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
    });

    setSocket(sock);

    sock.on('connect', () => {
      // Use logged-in user if available, otherwise send a lightweight guest identity
      const userId = user && user._id ? user._id : sock.id;
      const username = user && user.username ? user.username : `Guest-${sock.id.slice(0, 5)}`;
      setConnected(true);
      sock.emit('join-room', { roomId, userId, username });
    });

    sock.on('disconnect', () => setConnected(false));
    sock.on('connect_error', () => setConnected(false));

    return () => {
      if (sock && sock.connected) {
        sock.emit('leave-room', roomId);
      }
      if (sock) {
        sock.disconnect();
      }
      setSocket(null);
      setConnected(false);
    };
  }, [roomId, user]);

  const value = {
    socket,
    connected
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};

export default SocketContext;
