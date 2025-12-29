const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  context: {
    dietaryPreferences: [String],
    healthConditions: [String],
    goal: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);