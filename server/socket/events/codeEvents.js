// Code collaboration events
let codeUpdateTimeouts = {}; // Debounce storage

const codeEvents = (io, socket) => {
  socket.on('code-change', ({ roomId, newCode }) => {
    if (!roomId || !socket.userData) {
      return;
    }

    // Debounce: 300ms
    clearTimeout(codeUpdateTimeouts[roomId]);
    codeUpdateTimeouts[roomId] = setTimeout(() => {
      if (!socket.userData) {
        return;
      }

      socket.to(roomId).emit('code-updated', {
        code: newCode,
        changedBy: socket.userData.username
      });
    }, 300);
  });

  socket.on('cursor-move', ({ roomId, position }) => {
    if (!roomId || !position || !socket.userData) {
      return;
    }

    socket.to(roomId).emit('cursor-updated', {
      userId: socket.userData.userId,
      position,
      color: socket.userData.color,
      username: socket.userData.username
    });
  });
};

export default codeEvents;
