const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        console.log('Password before hashing:', password); // Debug mdp
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Password after hashing:', hashedPassword); // Debug mdp

        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) {
                console.error('JWT signing error:', err); // Added log
                throw err;
            }
            res.json({ token });
        });
    } catch (err) {
        console.error('Signup error:', err.message); // Added log
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Login request received for email:', email); // Debug log
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found'); // Debug log
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        console.log('Password entered:', password); // Debug mdp
        console.log('Password stored in DB:', user.password); // Debug mdp
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match: ${isMatch}`); // Debug log
        if (!isMatch) {
            console.log('Password does not match'); // Debug log
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) {
                console.error('JWT signing error:', err); // Added log
                throw err;
            }
            res.json({ token });
        });
    } catch (err) {
        console.error('Login error:', err.message); // Added log
        res.status(500).send('Server error');
    }
});

module.exports = router;
