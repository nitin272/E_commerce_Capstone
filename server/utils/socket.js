const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const { userModel } = require('../models/user.model');
const admin = require('../utils/FireBaseAdmin'); // Assuming you have this setup for FCM

const allowedOrigins = [
  'http://localhost:4500',
  "https://e-commerce-capstone.onrender.com",
  "http://e-commerce-capstone.onrender.com",
  "https://scale-mart1.vercel.app",
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

const userSocketMap = {}; // Map to track connected users and their socket IDs

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  const userId = socket.handshake.query.userId;
  const conversationId = socket.handshake.query.conversationId;
  console.log('Conversation ID:', conversationId);

  if (userId && userId !== 'undefined') {
    userSocketMap[userId] = socket.id;

    // Update user status to online in the database
    await userModel.findByIdAndUpdate(userId, { IsOnline: true })
      .catch(err => console.error('Error updating online status:', err));
    
    console.log("User Status: Online");
  }

  socket.join(conversationId); // Join the user to the conversation room

  // Emit the updated list of online users
  io.emit('getOnlineUser', Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    delete userSocketMap[userId];

    // Update user status to offline in the database
    await userModel.findByIdAndUpdate(userId, { IsOnline: false })
      .catch(err => console.error('Error updating offline status:', err));
    
    console.log("User Status: Offline");

    // Emit the updated list of online users
    io.emit('getOnlineUser', Object.keys(userSocketMap));
  });

  // Handle incoming messages
  socket.on('sendMessage', async (data) => {
    const { message, receiverId } = data;

    // Assume each message has a unique ID
    const messageData = {
      ...data,
      status: 'sent', // Initial status
      createdAt: new Date(),
    };

    // Send message to the receiver if online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // If user is online, emit the message to them
      io.to(receiverSocketId).emit('newMessage', messageData);
      messageData.status = 'delivered'; // Update to delivered
    } else {
      // If user is not online, send a FCM notification
      const receiver = await userModel.findById(receiverId);
      if (receiver && receiver.fcmTokens && receiver.fcmTokens.length > 0) {
        const fcmToken = receiver.fcmTokens[0];  // Get the first token
        const payload = {
          notification: {
            title: 'New message',
            body: message,
          },
          data: {
            message: JSON.stringify(messageData), // Send message data
            senderId: userId,
          },
        };

        // Send FCM notification
        admin.messaging().sendToDevice(fcmToken, payload)
          .then(response => {
            console.log('FCM Notification sent successfully:', response);
          })
          .catch(error => {
            console.error('Error sending FCM Notification:', error);
          });
      }
    }

    // Emit the updated message to all participants in the conversation
    io.to(conversationId).emit('updateMessageStatus', messageData);
  });

  // Handle marking messages as read
  // Inside socket.on('markAsRead')
// Backend (Server-side)
// Listening to the markAsRead event
socket.on('markAsRead', async (messageId, conversationId) => {
  try {
    // Here, update the message read status in the database (optional)
    const message = await Message.findByIdAndUpdate(messageId, { read: true });

    // Notify all users in the conversation that the message has been read
    socket.to(conversationId).emit('messageRead', messageId);
    console.log(`Message ${messageId} marked as read.`);
  } catch (err) {
    console.error('Error marking message as read:', err);
  }
});
});

module.exports = { app, io, server, getReceiverSocketId };
