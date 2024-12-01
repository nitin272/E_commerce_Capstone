const saveFcmToken = async (req, res, next) => {
    console.log('Incoming Request Body:', req.body); // Log the entire body
    const { fcmToken } = req.body; // Expecting the token in the request body
    console.log('Extracted FCM Token:', fcmToken); // Log the extracted token

    if (!fcmToken) {
        console.log('No FCM Token provided');
        return next(); // Proceed if no token
    }

    try {
        // Update the user's FCM token in the database
        await userModel.findByIdAndUpdate(req.user._id, { fcmToken });
        console.log('FCM Token saved for user:', req.user._id);
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error saving FCM token:', error);
        return res.status(500).send('Server Error');
    }
};

module.exports = saveFcmToken;
