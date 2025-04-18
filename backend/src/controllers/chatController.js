const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const { generateAIResponse } = require('../utils/aiController');
const { verifyToken } = require('../utils/jwtUtils');

const handleSocketConnection = (io, socket) => {
  console.log("A user connected:", socket.id);

  // 1. Get token from socket handshake
  const token = socket.handshake.auth?.token;
  let userId = null;

  if (token) {
    try {
      const decoded = verifyToken(token); // Uses your utils
      userId = decoded.userId;
      console.log("🔐 Authenticated user:", userId);
    } catch (err) {
      console.error("Invalid token");
      socket.disconnect();
      return;
    }
  } else {
    console.error("No token provided");
    socket.disconnect();
    return;
  }

  // 2. Load only user's messages
  socket.on('load history', async () => {
    try {
      const history = await Message.find({ userId }).sort({ timestamp: 1 }).lean();
      socket.emit('chat history', history);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  });

  // 3. Save both user and bot messages with userId
  socket.on('chat message', async (text) => {
    try {
      const userMessage = await Message.create({ sender: 'user', text, userId });
      socket.emit('receiveMessage', userMessage);

      const aiText = generateAIResponse(text);
      const botMessage = await Message.create({ sender: 'bot', text: aiText, userId });

      setTimeout(() => {
        socket.emit('bot reply', botMessage);
      }, 1000);
    } catch (err) {
      console.error('Message handling error:', err);
    }
  });
  // inside handleSocketConnection
socket.on('clear chat', async () => {
  try {
    await Message.deleteMany({ userId });
    socket.emit('chat cleared'); // Notify frontend that chat was cleared
  } catch (err) {
    console.error('Failed to clear chat:', err);
    socket.emit('error', 'Failed to clear chat');
  }
});


  socket.on('disconnect', () => {
    console.log("A user disconnected:", socket.id);
  });
};

module.exports = handleSocketConnection;
