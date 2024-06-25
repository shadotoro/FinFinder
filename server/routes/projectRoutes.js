const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// route pour soumettre un projet
router.post('/submit', auth, async (req, res) => {
    const { title, description, category, budget, isFeatured } = req.body;
    try {
        const newProject = new Project({
            title,
            description,
            category,
            budget,
            submittedBy: req.user.id
        });
        const project = await newProject.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

// route pour obtenir tous les projets soumis par l'utilisateur
router.get('/my-projects', auth, async (req, res) => {
    try {
        const projets = await Project.find({ submittedBy: req.user.id });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
                res.status(500).json({ message: err.message });
    }
});

module.exports = router;