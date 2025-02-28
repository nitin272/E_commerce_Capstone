const { userModel } = require('../models/user.model');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { ForgetPasswordMail, otpSignUp, generatedOtp } = require('../utils/nodeMailer');


class User {

    static GetUser = async (req, res) => {
        try {
            const data = await userModel.find({});
            res.json(data);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }


    static GetOtherUser = async (req, res) => {
        try {
            const { senderId } = req.query;
            const filteredUser = await userModel.find({ _id: { $ne: senderId } }).select("-password");
            res.json(filteredUser);
        } catch (error) {
            res.status(500).json(error);
        }
    }


static Login = async (req, res) => {
    try {
        const { username, password, fcmToken } = req.body;

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid username or password');
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        if (fcmToken) {
            if (!user.fcmTokens.includes(fcmToken)) {
                user.fcmTokens.push(fcmToken);
                await user.save();
            }
        }

        res.cookie('jwt', token, {
    httpOnly: true,                 // Prevent client-side JS access for security
    secure: true,                   // Ensure cookies are sent over HTTPS
    sameSite: 'None',               // Allow cross-site cookie usage
    maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time
});


        res.json({ message: 'Login successful', user: { _id: user._id, name: user.name, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

   static PostUser = async (req, res) => {
    try {
        const { name, username, password, otp, validOtp, fcmToken } = req.body;


        if (!(name && username && password && otp)) {
            return res.status(400).send('All input required');
        }

        if (validOtp === otp) {
            const existUser = await userModel.findOne({ username });
            if (existUser) {
                return res.status(400).send("User Already Exist. Please Login");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await userModel.create({
                name,
                username,
                password: hashedPassword,
    
                fcmTokens: typeof fcmToken === 'string' ? [fcmToken] : [],
            });


            const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

       
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            });

 
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } else {
            res.status(400).send("Invalid OTP");
        }
    } catch (error) {
        console.error(error); 
        res.status(500).send('Server Error');
    }
}



    static GetAdmins = async (req, res) => {
        try {
            const admins = await userModel.find({ role: 'admin' }).select('-password');
            res.json(admins);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }


    static GetUserById = async (req, res) => {
        try {
            const id = req.params.id;
            

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
    
            const filterData = await userModel.findById(id);
            

            if (!filterData) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            res.json(filterData);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }
    


    static PutUser = async (req, res) => {
        try {
            const id = req.params.id;
            const { name, contact, address } = req.body;
            const files = req.files;

            // Create update object with all fields
            const updateData = {
                name: name || '',
                contact: contact || '',
                address: address || ''
            };

            // Handle image upload if present
            if (files && files.length > 0) {
                const filePaths = files.map(file => file.path);
                const urls = await uploadOnCloudinary(filePaths);
                updateData.ownerImg = urls;
            }

            // Update user with new data
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(updatedUser);
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    }


    static ForgotPassword = async (req, res) => {
        try {
            const { username } = req.body;
            const findUser = await userModel.findOne({ username });
            if (!findUser) {
                return res.status(400).json({ message: "User not exist" });
            }
            const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
            ForgetPasswordMail(findUser, token);
            res.json({ "user": findUser });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    static GetFCMToken = async (req, res) => {
        try {
            const userId = req.user.id; 

            const user = await userModel.findById(userId).select('fcmTokens');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ fcmTokens: user.fcmTokens });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    static ResetPassword = async (req, res) => {
        try {
            const { id, token } = req.params;
            const { password } = req.body;
            const verifyResult = jwt.verify(token, process.env.JWT_SECRET);
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.findByIdAndUpdate(id, { password: hashedPassword });
            res.send("Password changed");
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    static OTPVerification = async (req, res) => {
        const { email } = req.body;
        const Otp = generatedOtp();
        otpSignUp(email, Otp);
        res.json({ validOTP: Otp });
    }


   static Logout = (req, res) => {
    try {
       
        if (req.cookies) {
            Object.keys(req.cookies).forEach(cookie => {
                res.clearCookie(cookie, { 
                    path: '/', 
                    sameSite: 'None', 
                    secure: true        
                });
            });
        }

        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({ message: 'Error while logging out. Please try again.', error: err });
                }
                console.log('User logged out successfully');
                return res.status(200).json({ message: 'Logged out successfully' });
            });
        } else {
            console.log('User logged out successfully (no session)');
            return res.status(200).json({ message: 'Logged out successfully' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error during logout', error });
    }
};

    
    static SuccessLogin = async (req, res) => {
        try {

            const token = req.cookies.jwt; 
    
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }
    
            let user;
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user = await userModel.findById(decoded.id).select('-password'); 
            } catch (error) {
                console.log("Error in finding user", error);
                return res.status(401).json({ message: "Invalid token" });
            }
    
            if (user) {
                res.json({ user });
            } else {
                res.status(400).json({ message: "Not authenticated" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }
    
}

module.exports = { User };
