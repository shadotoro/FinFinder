const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Route pour mettre à jour le profil avec ou sans image
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
    const { username, email } = req.body;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        if (req.file) {
            user.profileImage = req.file.path;
        }

        await user.save();
        res.json({ msg: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route pour l'inscription des donateurs
router.post('/signup-donateur', async (req, res) => {
    const { username, password, email } = req.body;
    console.log('Signup request:', { username, email, password, role: 'Donateur' });
    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            role: 'Donateur'
        });

        await user.save();
        console.log('User saved:', user);

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).send('Server error');
    }
});

// Route pour l'inscription des chercheurs
router.post('/signup-chercheur', async (req, res) => {
    const { username, password, email } = req.body;
    console.log('Signup request:', { username, email, password, role: 'Chercheur' });
    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            role: 'Chercheur'
        });

        await user.save();
        console.log('User saved:', user);

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            console.log('Token generated:', token);
            res.json({ token });
        });
    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).send('Server error');
    }
});

// Route pour la connexion des utilisateurs
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = password === user.password;
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            console.log('Token generated:', token);
            res.json({ token });
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Server error');
    }
});

// Route pour demander une réinitialisation de mot de passe
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpire = Date.now() + 3600000; // 1 heure

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        const resetUrl = `http://${req.headers.host}/api/auth/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password reset',
            text: `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process: \n\n ${resetUrl}`,
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email:', err.message);
                return res.status(500).send('Email could not be sent');
            }
            res.status(200).json({ msg: 'Email sent' });
        });
    } catch (err) {
        console.error('Error during forgot-password:', err.message);
        res.status(500).send('Server error');
    }
});

// Route pour réinitialiser le mot de passe à partir du jeton
router.post('/reset-password/:resetToken', async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    try {
        let user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ msg: 'Password reset successful' });
    } catch (err) {
        console.error('Error during reset-password:', err.message);
        res.status(500).send('Server error');
    }
});

// Route de suppression de compte
router.delete('/delete-account', async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.remove();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
