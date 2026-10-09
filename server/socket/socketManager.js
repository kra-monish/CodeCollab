import codeEvents from './events/codeEvents.js';
import chatEvents from './events/chatEvents.js';
import roomEvents from './events/roomEvents.js';

const socketManager = (io, socket) => {
  socket.userData = null;

  // Attach event handlers to socket
  roomEvents(io, socket);
  codeEvents(io, socket);
  chatEvents(io, socket);
};

export default socketManager;
