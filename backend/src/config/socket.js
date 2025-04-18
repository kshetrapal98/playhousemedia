const socketIo = require("socket.io");
const handleSocketConnection = require('../controllers/chatController');

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    handleSocketConnection(io, socket);
  });
};

module.exports = initializeSocket;
