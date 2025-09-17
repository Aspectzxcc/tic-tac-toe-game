const jwt = require('jsonwebtoken');


const generateToken = (payload,expiresIn = '1d') => {
    return jwt.sign(payload, "secretKey", { expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, "secretKey");
    } catch (error) {
        throw new Error('Invalid or Expired token');
    }
};

module.exports = { generateToken, verifyToken };