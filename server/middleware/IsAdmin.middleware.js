const jwt = require('jsonwebtoken');
const {userModel} = require('../models/user.model');


const isAdmin = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await userModel.findById(userId).select('name username ownerImg role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not have permission' });
        }
        req.userInfo = user; 
        next();
    } catch (error) {
        console.error("Error in isAdmin middleware:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token has expired' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports =  isAdmin;