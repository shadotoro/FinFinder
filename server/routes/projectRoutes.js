const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Donation = require('../models/Donation');

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

        await User.findByIdAndUpdate(req.user.id, { $push: { projectsSubmitted: project._id } });
        
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

// route pour récupérer les projets en attente de validation
router.get('/pending', auth, async (req, res) => {
    try {
        const projects = await Project.find({ status: 'Pending'});
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// route pour récupérer les projets acceptés
router.get('/accepted-projects', async (req, res) => {
    try {
        const projects = await Project.find({ status: 'Accepted'});
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// route pour récupérer les détails d'un projet
router.get('/:id', async (req, res) => {
    try {
        const project =await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// route pour valider un projet
router.put('/validate-project/:id', auth, async (req, res) => {
    const { status } = req.body;
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        project.status = status;
        await project.save();

        if (status === 'Accepted') {
            await User.findByIdAndUpdate(project.user, { $push: { projectsAccepted: project._id } });
        }
        
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route pour mettre à jour un projet
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    const { title, description, category, budget } = req.body;
    const updateData = { title, description, category, budget };

    if (req.file) {
        updateData.image = req.file.path;
    }

    try {
        const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Route pour supprimer un projet
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// route pour faire un don à un projet
router.post('/donate', auth, async (req, res) => {
    const { amount, projectId } = req.body;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        const donation = new Donation({
            amount,
            user: req.user.id,
            project: project._id
        });

        await donation.save();

        project.raised += amount;
        await project.save();

        res.json({ msg: 'Donation successful', donation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// route pour récupérer les dons d'un projet
router.get('/:id/donations', async (req, res) => {
    try {
        const donations = await Donation.find({ project: req.params.id }).populate('user', 'username');

        if (!donations) {
            return res.status(404).json({ msg: 'Donations not found' });
        }
        res.json(donations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
