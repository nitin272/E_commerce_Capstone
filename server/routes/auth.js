const express = require('express');
const passport = require('passport');
const  {User}  = require('../controllers/user.controller');
const upload = require('../middleware/Files.middleware');
const { authMiddleware } = require('../middleware/TokenVerify.middleware');
const isAdmin = require('../middleware/IsAdmin.middleware');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.model');

require('dotenv').config();
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const auth = express();
passport.use(new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    // console.log("OAuth2 Response: ", profile); // Log profile to see what data is being returned
  
    try {
        // Check if the user already exists
        let user = await userModel.findOne({ username: profile.emails[0].value });

        if (!user) {
            // If user does not exist, create a new user
            user = await userModel.create({
                name: profile.displayName,
                username: profile.emails[0].value,
                ownerImg: [profile.photos[0].value],
                role: 'user',
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from ID
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth routes
auth.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

auth.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
  
    async (req, res) => {
        try {
            // Generate JWT for the authenticated user
            const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // Set the JWT as an HTTP-only cookie
            res.cookie('jwt', token, {
                httpOnly: true, // Prevents access via JavaScript
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "None"
            });

            // Redirect to frontend (the cookie will be sent automatically)
            res.redirect('http://localhost:4500/');

        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');

        }
    }
);


auth.post('/auth/fcm-token', authMiddleware, async (req, res) => {
    const { fcmToken } = req.body;
    console.log('Extracted FCM Token:', fcmToken);
    

    if (!fcmToken) {
        return res.status(400).json({ success: false, message: 'FCM token is required.' });
    }

    try {
        // Access the authenticated user's ID
        const userId = req.user.id; // Make sure authMiddleware sets req.user

        // Save the FCM token to the user's record
        await userModel.findByIdAndUpdate(userId, { fcmTokens: fcmToken }, { new: true });
        console.log('FCM token saved for user:', userId);
        

        res.status(200).json({ success: true, message: 'FCM token saved successfully.' });
    } catch (error) {
        console.error('Error saving FCM token:', error);
        res.status(500).json({ success: false, message: 'Error saving FCM token.' });
    }
});

  

// User routes
auth.post('/signup', User.PostUser);
auth.post('/login', User.Login);
auth.get('/admins', User.GetAdmins);

auth.get('/users', authMiddleware, User.GetUser);
auth.get('/user/:id', authMiddleware, User.GetUserById);
auth.get('/update/:id', authMiddleware, User.GetUserById);
auth.get('/getOtherUser', authMiddleware, User.GetOtherUser);
auth.put('/update/:id', upload.array('ownerImg'), authMiddleware, User.PutUser);
auth.post('/forgotPassword', User.ForgotPassword);
auth.post('/resetPassword/:id/:token', User.ResetPassword);
auth.post('/otpVerification', User.OTPVerification);
auth.get('/logout', User.Logout )
auth.get('/login/success', User.SuccessLogin)   

auth.get('/Get-Token',authMiddleware,User.GetFCMToken)


module.exports = auth;
