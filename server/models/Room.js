import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'cpp', 'java'],
    default: 'javascript'
  },
  code: {
    type: String,
    default: '// Start coding together!\\nconsole.log(\\\"Hello CodeCollab!\\\");'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;
