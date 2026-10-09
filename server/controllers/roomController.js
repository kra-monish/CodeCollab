import Room from '../models/Room.js';

// Simple room id generator (6 uppercase alphanumeric)
const generateRoomId = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

export const createRoom = async (req, res) => {
  try {
    const { name, language, isPublic } = req.body;
    const roomId = generateRoomId();
    const room = await Room.create({ roomId, name, language: language || 'javascript', public: !!isPublic, owner: req.user.id });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.id });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user.id }).sort({ updatedAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
