const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();

const allowedOrigins = [
  'http://localhost:4500',"https://e-commerce-capstone.onrender.com","http://e-commerce-capstone.onrender.com","https://scale-mart1.vercel.app", 
  // other allowed origins can be added here
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
  console.log('user connected ', socket.id);

  const userId = socket.handshake.query.userId;
  const conversation = socket.handshake.query.conversationId;
  const conversationId = conversation.toString();
  console.log('conversationId socket.js', conversationId);
  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }
  socket.join(conversationId);

  io.emit('getOnlineUser', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('user disconnected ', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUser', Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };
