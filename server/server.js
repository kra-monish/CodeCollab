import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import socketManager from './socket/socketManager.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Routes (placeholders - will populate)
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/code', codeRoutes);

// Socket setup (placeholder - will implement)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socketManager(io, socket);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

import errorHandler from './middleware/errorHandler.js';

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

export { io };
