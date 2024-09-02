// controllers/notificationControllers.js
const Notification = require('../models/Notification');
const User = require('../models/User');
const Project = require('../models/Project');

// Créer une notification
exports.createNotification = async (req, res) => {
    const { userId, message } = req.body;

    try {
        const user = await User.findById(userId); // Correction: Utiliser la majuscule pour "User"
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const notification = new Notification({
            user: userId,
            message
        });
        await notification.save();
        return res.status(201).json({ message: 'Notification created' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la création de la notification' });
    }
};

// Ajouter un commentaire et créer une notification
exports.addCommentAndNotify = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Ajouter le commentaire au projet
        const comment = {
            user: req.user.id,
            text: req.body.text,
        };
        project.comments.push(comment);
        await project.save();

        // Créer une notification pour l'utilisateur propriétaire du projet
        const notification = new Notification({
            user: project.user,
            message: `New comment on your project: ${project.title}`,
        });

        await notification.save();

        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Récupérer les notifications d'un utilisateur
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.params.userId });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Mettre à jour une notification
exports.updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        await notification.remove();
        res.json({ msg: 'Notification removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
