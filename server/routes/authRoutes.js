const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
console.log('Signup request received:', { username, email });  // à retirer plus tard

    try {
        let user = await User.findOne({ email });
        if (user) {
console.log('User already exists');  // à retirer plus tard
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
console.log('Hashed Password:', hashedPassword);  // à retirer plus tard

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
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
console.log('Login request received:', { email, password }); // à retirer plus tard
    try {
        let user = await User.findOne({ email });
        if (!user) {
console.log('User not found');  // à retirer plus tard
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
console.log('Password match:', isMatch); // à retirer plus tard

        if (!isMatch) {
console.log('Password does not match'); // à retirer plus tard
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
