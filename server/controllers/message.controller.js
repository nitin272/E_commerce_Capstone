const { Conversation } = require('../models/conversation.model');
const { Message } = require('../models/message.model');
const { io } = require('../utils/socket');

class Messages {
    // Send message
    static sendMessage = async (req, res) => {
        try {
            const { message, senderId } = req.body;
            const { id: receiverId } = req.params;

            let conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId]
                });
            }

            const newMessage = new Message({
                senderId,
                receiverId,
                message
            });

            conversation.message.push(newMessage._id);

            await Promise.all([conversation.save(), newMessage.save()]);

            const conversationId = conversation._id.toString();
            if (conversationId) {
                console.log(`newMessage: ${message}, receiverId: ${conversationId}`);
                io.to(conversationId).emit('newMessage', newMessage);
            }

            res.status(200).json({
                newMessage,
                conversation: {
                    id: conversation._id
                }
            });
        } catch (error) {
            console.error("Error in sendMessage:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Get messages
    static GetMessage = async (req, res) => {
        try {
            const { senderId } = req.query;
            const { id: userToSendId } = req.params;

            const conversation = await Conversation.findOne({
                participants: { $all: [senderId, userToSendId] }
            }).populate("message");

            const messages = conversation ? conversation.message : [];

            res.json(messages);
        } catch (error) {
            console.error("Error in GetMessage:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = Messages;
