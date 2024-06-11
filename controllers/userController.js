const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({ message: 'Username and password are required' });
        }
        const user = new User({ username, password });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate username error
            res.status(400).send({ message: 'Username already exists' });
        } else {
            res.status(400).send(error);
        }
    }
}


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt with username:', username);

        if (!username || !password) {
            console.log('Username or password missing');
            return res.status(400).send({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log('Token generated:', token);
        res.status(200).send({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: 'Server error' });
    }
};