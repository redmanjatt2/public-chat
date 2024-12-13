const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static frontend
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Notify all users of the connection
  io.emit('user joined', 'A new user has joined the chat');

  // Listen for messages from clients
  socket.on('chat message', (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    io.emit('chat message', { msg, timestamp }); // Broadcast to all users
  });

  // Notify all users of the disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    io.emit('user left', 'A user has left the chat');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
