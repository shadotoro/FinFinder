const express = require('express'); // import de express
const router = express.Router(); // création d'un router express
const User = require('../models/User'); // import de model user
const jwt = require('jsonwebtoken'); // import de jsonwebtoken
const crypto = require('crypto'); // import de crypto pour générer des jetons sécurisés
const nodemailer = require('nodemailer'); // import de nodemailer pour l'envoye de mails

// Rout pour l'inscription d'un utilisateur
router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body; // extraction des données de la request
    try {
        // vérifie si l'utilisateur existe déjà dans la bdd
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }
        // création d'un nouvel utilisateur
        user = new User({
            username,
            email,
            password
        });
        // enregistrement du nouvel utilisateur dans la bdd
        await user.save();
        console.log('User saved:', user); // log des infos de l'utilisateur enregistré

        const payload = { // création d'un payload pour le token JWT
            user: {
                id: user.id
            }
        };
        // généération d'un token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token }); // retourne le token en réponse
        });
    } catch (err) {
        console.error('Error during signup:', err.message); // log des erreurs éventuelles
        res.status(500).send('Server error'); // retourne une erreur de serveur en cas de problème
    }
});

// route pour la co' d'un utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // extraction de données de la request
    try {
        let user = await User.findOne({ email }); // vérifie si l'utilisateur existe dans la bdd
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = password === user.password; // vérifie la correspondance des mdp
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
    const { email } = req.body; // extract email request
    try {
        let user = await User.findOne({ email }); // vérif user ds bdd
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex'); // génération d'un token de réinitialisation
        const resetPasswordExpire = Date.now() + 3600000; // 1 heure (expiration)

        // mise à jour de l'utilisateur avec le jeton et la date d'expiration
        user.resetPasswordToken = resetToken; 
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        const resetUrl = `http://${req.headers.host}/api/auth/reset-password/${resetToken}`; // construction de l'url de réinitialisation

        const transporter = nodemailer.createTransport({ // config du transporteur du mail
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = { // options du mail
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password reset',
            text: `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process: \n\n ${resetUrl}`,
        };

        transporter.sendMail(mailOptions, (err, response) => { // envoi du mail
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
    const { resetToken } = req.params; // extraction du jeton de la request
    const { password } = req.body; // extract du nouveau mdp de la request

    try { // vérif si le jeton est valide et n'a pas expiré
        let user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }
        // mise à jour du mdp de l'utilisateur
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

// route de suppression de compte
router.delete('/delete-account', async (req, res) => {
    try { // recherche de l'utilisateur par ID
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found'});
        }
        // suppression de l'utilisateur
        await user.remove();
        res.json({ msg: 'User removed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; // export pour utilisation dans le serveur principal
