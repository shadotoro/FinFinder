const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// route pour obtenir le profil de l'utilisateur
router.get('/profile', auth, async (req, res) => {
    try {
        // recherche de l'utilisateur par ID en excluant le mdp
        const user = await User.findById(req.user.id).select('-password');
        const projects = await Project.find({ user: req.user.id});
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({ user, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
