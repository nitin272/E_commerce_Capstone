const mongoose = require('mongoose')


const paymentSchema = new mongoose.Schema({
    razorpay_payment_id :{
        type:String,
        required:true
    },
    razorpay_order_id :{
        type:String,
        required:true
    },
    razorpay_signature :{
        type: String,
        required: true
    }
    //createdAt, updatedAt
},{timestamps:true})

const paymentModel = mongoose.model("payment",paymentSchema)

module.exports = {paymentModel}