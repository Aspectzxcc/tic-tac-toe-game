const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (payload,expiresIn = '1d') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or Expired token');
    }
};

module.exports = { generateToken, verifyToken };