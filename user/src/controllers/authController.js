const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtHandler.js');

exports.register = async (req, res) => {
   try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({ message: 'Username already exists' });
        }

    //create new user
    user = new User({
        username,
        password,
    });

    await user.save();

    // create JWT TOKEN
const token = generateToken(user);

    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            id: user._id, username
    }
    });
}   catch (error) {
    res.status(500).json({ message: 'Server error'});
   }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // check if user exist
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // validate pass
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

  // create JWT TOKEN
const token = generateToken(user);

res.status(200).json({
    message: 'Login successful',
    token,
    user: {
        id: user._id, username
      }
     });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
