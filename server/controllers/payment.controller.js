const { instance } = require('../utils/razorpay');
const crypto = require('crypto');
const { paymentModel } = require('../models/payment.model');
const { successPayment } = require('../utils/nodeMailer');

const paymentCheckout = async (req, res) => {
    const { price } = req.body;
    try {
        console.log(price);
        const options = {
            amount: Number(price * 100),
            currency: "INR"
        };

        const order = await instance.orders.create(options);

        console.log(order);
        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating order" });
    }
};

const paymentVerification = async (req, res) => {
    console.log("verification", req.body);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const { username } = req.query;
    console.log("username", username);
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        .update(body)
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        await paymentModel.create({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        });

        successPayment(razorpay_payment_id, razorpay_order_id, username);
        
        // Updated redirect URL to your frontend
        res.redirect(`http://localhost:4500/orderPlaced?reference=${razorpay_payment_id}`);
    } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
    }
};

module.exports = { paymentCheckout, paymentVerification };
