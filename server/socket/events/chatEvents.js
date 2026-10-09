// Chat events
import Message from '../../models/Message.js';
import { isDbConnected } from '../../config/db.js';

const chatEvents = (io, socket) => {
  socket.on('send-message', async ({ roomId, message }) => {
    try {
      if (!roomId || !message?.trim()) {
        return;
      }

      if (!socket.userData) {
        socket.emit('error', { message: 'Join the room before sending messages' });
        return;
      }

      let newMessage = null;

      if (isDbConnected()) {
        newMessage = await Message.create({
          roomId,
          userId: socket.userData.userId,
          username: socket.userData.username,
          content: message.trim()
        });
      }

      // Broadcast to room
      io.to(roomId).emit('new-message', {
        _id: newMessage?._id || `temp-${Date.now()}`,
        userId: socket.userData.userId,
        username: socket.userData.username,
        content: message.trim(),
        timestamp: newMessage?.timestamp || new Date().toISOString(),
        color: socket.userData.color
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
};

export default chatEvents;
