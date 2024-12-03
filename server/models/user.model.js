const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true, required: true },
    contact: String,
    address: String,
    password: { type: String, required: false }, 
    ownerImg: [String],
    role: { type: String, default: 'user' },
    fcmTokens: { type: [String]}, 
    IsOnline: { type: Boolean, default: false },
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

module.exports = { userModel };
