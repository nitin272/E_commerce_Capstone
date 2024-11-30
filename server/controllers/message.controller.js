const { Conversation } = require('../models/conversation.model');
const { Message } = require('../models/message.model');
const { userModel } = require('../models/user.model');
const { io } = require('../utils/socket');
const admin = require('../utils/FireBaseAdmin');

class Messages {
    // Send a message
    // Send a message
static sendMessage = async (req, res) => {
    try {
        const { message, senderId } = req.body;
        const { id: receiverId } = req.params;

        // Find existing conversation between sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // Create a new conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create a new message object
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            status: 'sent',
            conversationId: conversation._id // Add conversationId to message
        });

        // Add message ID to the conversation
        conversation.message.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // Fetch the receiver's information
        const receiver = await userModel.findById(receiverId);
        if (receiver && receiver.fcmTokens && receiver.fcmTokens.length > 0) {
            const fcmToken = receiver.fcmTokens[0];

            // Fetch sender's information
            const sender = await userModel.findById(senderId);
            const senderName = sender.name;
            const senderAvatar = sender.ownerImg.length > 0 ? sender.ownerImg[0] : '';

            // Validate senderAvatar
            const validAvatar = typeof senderAvatar === 'string' && senderAvatar.length > 0 ? senderAvatar : '';

            // Prepare FCM payload
            const fcmPayload = {
                notification: {
                    title: `New message from ${senderName}`,
                    body: message,
                    image: validAvatar,
                },
                data: {
                    senderId: senderId,
                    messageId: newMessage._id.toString(),
                },
            };

            // Send the FCM notification
            try {
                await admin.messaging().send({
                    token: fcmToken,
                    notification: fcmPayload.notification,
                    data: fcmPayload.data,
                });
                // Update message status to delivered
                newMessage.status = 'delivered'; // Update message status
                await newMessage.save(); // Save the updated message
            } catch (fcmError) {
                console.error('FCM Notification Error:', fcmError);
                // You may want to handle the error more gracefully here
            }
        }

        // Emit the new message to the conversation via socket
        const conversationId = conversation._id.toString();
        io.to(conversationId).emit('newMessage', newMessage); // Emit message directly

        // Respond with the new message and conversation details
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

   // Get all messages for a conversation
static GetMessage = async (req, res) => {
    try {
        const { senderId } = req.query;
        const { id: receiverId } = req.params;

        // Find conversation between sender and receiver
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("message");

        // If conversation exists, retrieve its messages
        const messages = conversation ? conversation.message : [];

        // Optional: Update the status of messages to 'read' when they're fetched
        if (messages.length) {
            await Message.updateMany(
                { receiverId, status: 'delivered' },  // Only update 'delivered' messages
                { status: 'read' }
            );
        }

        // Respond with the retrieved messages
        res.json(messages);
    } catch (error) {
        console.error("Error in GetMessage:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
}

module.exports = Messages;
