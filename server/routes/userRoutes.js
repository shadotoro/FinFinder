const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// route pour obtenir le profil de l'utilisateur
router.get('/profile', auth, async (req, res) => {
    try {
        // recherche de l'utilisateur par ID en excluant le mdp
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
