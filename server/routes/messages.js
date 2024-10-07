const express = require('express');
const Messages = require('../controllers/message.controller');
const messageRouter = express.Router();

// Get messages
messageRouter.get('/:id', Messages.GetMessage);

// Send message
messageRouter.post('/send/:id', Messages.sendMessage);

module.exports = messageRouter;
