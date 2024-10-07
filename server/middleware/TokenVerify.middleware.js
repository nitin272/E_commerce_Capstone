const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Store the user info in req.user
        // console.log("verified user", verified);
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};



module.exports = { authMiddleware};
