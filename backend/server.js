 
 const express = require('express');
  
 const cors = require('cors');
 const http = require('http');
 const connectDB = require('./src/config/db');
 const initializeSocket = require('./src/config/socket');
 const authRoutes = require('./src/routes/authRoutes');
 const userRoutes = require('./src/routes/userRoutes');
 const app = express();
 const server = http.createServer(app);
 
  
 app.use(cors());
 app.use(express.json());
 
 
 app.use('/api/auth', authRoutes);
 app.use('/api/user', userRoutes);
  
 connectDB();
  
 initializeSocket(server);
 
if (require.main === module) {
  const PORT = process.env.PORT || 5500;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
 module.exports = app;