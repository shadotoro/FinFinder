const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour le téléchargement des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Route pour soumettre un projet
router.post('/', auth, upload.single('image'), async (req, res) => {
    const { title, description, category, budget } = req.body;
    const image = req.file.path;

    try {
        const newProject = new Project({
            title,
            description,
            category,
            budget,
            image,
            user: req.user.id
        });

        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route pour récupérer les projets de l'utilisateur
router.get('/my-projects', auth, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
