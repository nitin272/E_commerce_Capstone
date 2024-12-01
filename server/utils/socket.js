const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const { userModel } = require('../models/user.model');
const admin = require('../utils/FireBaseAdmin'); 

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

const userSocketMap = {};
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
    await userModel.findByIdAndUpdate(userId, { IsOnline: true })
      .catch(err => console.error('Error updating online status:', err));
    
    console.log("User Status: Online");
  }

  socket.join(conversationId);

  io.emit('getOnlineUser', Object.keys(userSocketMap));

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    delete userSocketMap[userId];

    await userModel.findByIdAndUpdate(userId, { IsOnline: false })
      .catch(err => console.error('Error updating offline status:', err));
    
    console.log("User Status: Offline");
    io.emit('getOnlineUser', Object.keys(userSocketMap));
  });


  socket.on('sendMessage', async (data) => {
    const { message, receiverId } = data;

    const messageData = {
      ...data,
      status: 'sent', 
      createdAt: new Date(),
    };
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', messageData);
      messageData.status = 'delivered'; 
    } else {

      const receiver = await userModel.findById(receiverId);
      if (receiver && receiver.fcmTokens && receiver.fcmTokens.length > 0) {
        const fcmToken = receiver.fcmTokens[0];  
        const payload = {
          notification: {
            title: 'New message',
            body: message,
          },
          data: {
            message: JSON.stringify(messageData), 
            senderId: userId,
          },
        };

        admin.messaging().sendToDevice(fcmToken, payload)
          .then(response => {
            console.log('FCM Notification sent successfully:', response);
          })
          .catch(error => {
            console.error('Error sending FCM Notification:', error);
          });
      }
    }

    io.to(conversationId).emit('updateMessageStatus', messageData);
  });

socket.on('markAsRead', async (messageId, conversationId) => {
  try {

    const message = await Message.findByIdAndUpdate(messageId, { read: true });


    socket.to(conversationId).emit('messageRead', messageId);
    console.log(`Message ${messageId} marked as read.`);
  } catch (err) {
    console.error('Error marking message as read:', err);
  }
});
});

module.exports = { app, io, server, getReceiverSocketId };
