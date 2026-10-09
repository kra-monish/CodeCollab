import express from 'express';
import { createRoom, getRoomById, getUserRooms } from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createRoom);
router.get('/user', getUserRooms);
router.get('/:id', getRoomById);

export default router;
