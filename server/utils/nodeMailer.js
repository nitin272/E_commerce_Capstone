const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
require('dotenv').config();

console.log('Email:', process.env.EMAIL);
console.log('App Password:', process.env.MAIL_PASS);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.MAIL_PASS
    }
});

const ForgetPasswordMail = (user, token) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: user.username,
        subject: 'Reset your password',
        text: `Click on this link to reset your password: https://scale-mart1.vercel.app/resetPassword/${user._id}/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const generatedOtp = () => {
    const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false
    });
    return otp;
};

const otpSignUp = (email, Otp) => {
    const otpmailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email verification OTP',
        text: `Email verification OTP: ${Otp}`
    };

    transporter.sendMail(otpmailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const successPayment = (payment_id, order_id, username) => {
    const successMail = {
        from: process.env.EMAIL,
        to: username,
        subject: 'Order placed!',
        text: `Your order is placed successfully. Your payment Id is ${payment_id} and your order Id is ${order_id}`
    };

    transporter.sendMail(successMail, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = { ForgetPasswordMail, otpSignUp, generatedOtp, successPayment };
