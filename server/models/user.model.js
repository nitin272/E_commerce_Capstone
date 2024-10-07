const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    username : String,
    contact : String,
    address : String,
    password : String,
    ownerImg : [String],
    role: { type: String, default: 'user' },
    //createdAt, updatedAt
},{timestamps:true})

const userModel = mongoose.model('user',userSchema)

module.exports = {userModel}