// Room events - join, leave room
const roomEvents = (io, socket) => {
  socket.on('join-room', (data) => {
    const { roomId, userId, username } = data;
    if (!roomId || !userId || !username) {
      socket.emit('error', { message: 'Missing room or user details' });
      return;
    }

    socket.join(roomId);
    socket.userData = { userId, username, color: getRandomColor() };

    // Notify room users
    socket.to(roomId).emit('user-joined', {
      userId,
      username,
      color: socket.userData.color
    });

    console.log(`${username} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    if (roomId && socket.rooms.has(roomId) && socket.userData) {
      socket.to(roomId).emit('user-left', {
        userId: socket.userData.userId,
        username: socket.userData.username
      });
      socket.leave(roomId);
    }
  });
};

const getRandomColor = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default roomEvents;
