const { userModel } = require('../models/user.model');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { ForgetPasswordMail, otpSignUp, generatedOtp } = require('../utils/nodeMailer');

class User {
    // Get all users
    static GetUser = async (req, res) => {
        try {
            const data = await userModel.find({});
            res.json(data);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    // Get users other than login user
    static GetOtherUser = async (req, res) => {
        try {
            const { senderId } = req.query;
            const filteredUser = await userModel.find({ _id: { $ne: senderId } }).select("-password");
            res.json(filteredUser);
        } catch (error) {
            res.status(500).json(error);
        }
    }



    // Login user

   // Login user
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

        // Save FCM token to the user's database entry
        if (fcmToken) {
            if (!user.fcmTokens.includes(fcmToken)) {
                user.fcmTokens.push(fcmToken);
                await user.save();
            }
        }

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ message: 'Login successful', user: { _id: user._id, name: user.name, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

    
   // Register new user
   static PostUser = async (req, res) => {
    try {
        const { name, username, password, otp, validOtp, fcmToken } = req.body;

        // Check if all required fields are present
        if (!(name && username && password && otp)) {
            return res.status(400).send('All input required');
        }

        // Validate OTP
        if (validOtp === otp) {
            const existUser = await userModel.findOne({ username });
            if (existUser) {
                return res.status(400).send("User Already Exist. Please Login");
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = await userModel.create({
                name,
                username,
                password: hashedPassword,
                // Initialize fcmTokens with the provided token if it exists
                fcmTokens: fcmToken ? [fcmToken] : [],
            });

            // Generate JWT token
            const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Set the cookie
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            });

            // Respond with success message and user info
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } else {
            res.status(400).send("Invalid OTP");
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Server Error');
    }
}


    // Get all admins
    static GetAdmins = async (req, res) => {
        try {
            const admins = await userModel.find({ role: 'admin' }).select('-password');
            res.json(admins);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    // Get user by ID
    static GetUserById = async (req, res) => {
        try {
            const id = req.params.id;
            
            // Check if id is valid
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
    
            const filterData = await userModel.findById(id);
            
            // Check if user was found
            if (!filterData) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            res.json(filterData);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }
    

    // Update user
    static PutUser = async (req, res) => {
        try {
            const id = req.params.id;
            const modifiedData = req.body;
            const files = req.files;

            if (files && files.length > 0) {
                const filePaths = files.map(file => file.path);
                const urls = await uploadOnCloudinary(filePaths);
                modifiedData.ownerImg = urls;
            }

            const updatedData = await userModel.findByIdAndUpdate(id, modifiedData, { new: true });
            res.json(updatedData);
        } catch (error) {
            console.log(error);
            res.status(500).send("Server Error");
        }
    }

    // Forgot password
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
    // Get FCM Token for a specific user
    static GetFCMToken = async (req, res) => {
        try {
            const userId = req.user.id; // Assume you're using middleware to set req.user with the authenticated user

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

    // Reset password
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

    // OTP Verification
    static OTPVerification = async (req, res) => {
        const { email } = req.body;
        const Otp = generatedOtp();
        otpSignUp(email, Otp);
        res.json({ validOTP: Otp });
    }


   static Logout = (req, res) => {
    try {
        // Clear all cookies, including JWT
        if (req.cookies) {
            Object.keys(req.cookies).forEach(cookie => {
                res.clearCookie(cookie, { 
                    path: '/', 
                    sameSite: 'None',  // Set SameSite to None
                    secure: true        // Ensure secure attribute is true if using HTTPS
                });
            });
        }

        // Destroy the session if it exists
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

    
    
    


    // Success login
    static SuccessLogin = async (req, res) => {
        try {
            // Get the token from cookies
            const token = req.cookies.jwt; // Assuming you have cookie-parser middleware set up
    
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }
    
            let user;
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user = await userModel.findById(decoded.id).select('-password'); // Exclude password from response
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
