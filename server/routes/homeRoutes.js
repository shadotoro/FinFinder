const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // à créer !!!

// Route pour obtenir les projets phares
router.get('/featured-projects', async (req, res) => {
    try {
        const projects = await Project.find({ isFeatured: true }).limit(3);
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;