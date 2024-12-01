const { Conversation } = require('../models/conversation.model');
const { Message } = require('../models/message.model');
const { userModel } = require('../models/user.model');
const { io } = require('../utils/socket');
const admin = require('../utils/FireBaseAdmin');

class Messages {

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
            message,
            status: 'sent',
            conversationId: conversation._id 
        });

        conversation.message.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);
        const receiver = await userModel.findById(receiverId);
        if (receiver && receiver.fcmTokens && receiver.fcmTokens.length > 0) {
            const fcmToken = receiver.fcmTokens[0];
            const sender = await userModel.findById(senderId);
            const senderName = sender.name;
            const senderAvatar = sender.ownerImg.length > 0 ? sender.ownerImg[0] : '';
            const validAvatar = typeof senderAvatar === 'string' && senderAvatar.length > 0 ? senderAvatar : '';
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
            try {
                await admin.messaging().send({
                    token: fcmToken,
                    notification: fcmPayload.notification,
                    data: fcmPayload.data,
                });
                newMessage.status = 'delivered';
                await newMessage.save(); 
            } catch (fcmError) {
                console.error('FCM Notification Error:', fcmError);
            }
        }
        const conversationId = conversation._id.toString();
        io.to(conversationId).emit('newMessage', newMessage);
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

static GetMessage = async (req, res) => {
    try {
        const { senderId } = req.query;
        const { id: receiverId } = req.params;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("message");

        const messages = conversation ? conversation.message : [];
        if (messages.length) {
            await Message.updateMany(
                { receiverId, status: 'delivered' },  
                { status: 'read' }
            );
        }
        res.json(messages);
    } catch (error) {
        console.error("Error in GetMessage:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
}

module.exports = Messages;
