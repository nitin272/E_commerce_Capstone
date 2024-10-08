const express = require('express');
const passport = require('passport');
const { User } = require('../controllers/user.controller');
const upload = require('../middleware/Files.middleware');
const { authMiddleware } = require('../middleware/TokenVerify.middleware');
const isAdmin = require('../middleware/IsAdmin.middleware');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.model');

require('dotenv').config();
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const auth = express();

// Google OAuth strategy configuration
passport.use(new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
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
            const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Set the JWT as an HTTP-only cookie
            res.cookie('jwt', token, {
                httpOnly: true, // Prevents access via JavaScript
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 3600000 // 1 hour,
                sameSite : 'None"
            });

            // Redirect to frontend (the cookie will be sent automatically)
            res.redirect('http://localhost:4500');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');

        }
    }
);

// User routes
auth.post('/signup', User.PostUser);
auth.post('/login', User.Login);
auth.get('/admins', User.GetAdmins);

auth.get('/users', authMiddleware,isAdmin, User.GetUser);
auth.get('/user/:id', authMiddleware, User.GetUserById);
auth.get('/update/:id', authMiddleware, User.GetUserById);
auth.get('/getOtherUser', authMiddleware, User.GetOtherUser);
auth.put('/update/:id', upload.array('ownerImg'), authMiddleware, User.PutUser);
auth.post('/forgotPassword', User.ForgotPassword);
auth.post('/resetPassword/:id/:token', User.ResetPassword);
auth.post('/otpVerification', User.OTPVerification);

auth.get('/logout', User.Logout )


auth.get('/login/success', User.SuccessLogin)
module.exports = auth;
