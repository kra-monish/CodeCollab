import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isSystem: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: { 
    createdAt: 'timestamp',
    updatedAt: false 
  }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
