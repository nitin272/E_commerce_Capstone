const saveFcmToken = async (req, res, next) => {
    console.log('Incoming Request Body:', req.body); 
    const { fcmToken } = req.body; 
    console.log('Extracted FCM Token:', fcmToken); 

    if (!fcmToken) {
        console.log('No FCM Token provided');
        return next(); 
    }

    try {
        await userModel.findByIdAndUpdate(req.user._id, { fcmToken });
        console.log('FCM Token saved for user:', req.user._id);
        next(); 
    } catch (error) {
        console.error('Error saving FCM token:', error);
        return res.status(500).send('Server Error');
    }
};

module.exports = saveFcmToken;
