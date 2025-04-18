 
 const express = require('express');
  
 const cors = require('cors');
 const http = require('http');
 const connectDB = require('./src/config/db');
 const initializeSocket = require('./src/config/socket');
 const authRoutes = require('./src/routes/authRoutes');
 const userRoutes = require('./src/routes/userRoutes');
 const app = express();
 const server = http.createServer(app);
 
 // Middleware
 app.use(cors());
 app.use(express.json());
 
 // Routes
 app.use('/api/auth', authRoutes);
 app.use('/api/user', userRoutes);
 // Connect to MongoDB
 connectDB();
 // Initialize Socket.io
 initializeSocket(server);
//  Start server
//  const PORT = process.env.PORT || 5500;
//  server.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
//  });
if (require.main === module) {
  const PORT = process.env.PORT || 5500;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
 module.exports = app;