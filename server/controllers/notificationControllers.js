const notification = require('../models/Notification');
const user = require('../models/User');

// créer une notification
exports.createNotification = async (req, res) => {
    const { userId, message } = req.body;

    try {
        const user = await user.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const notification = new Notification ({
            user: userId,
            message
        });
        await notification.save();
        return res.status(201).json({ message: 'notification created' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la création de la notification' });
    }
};

// récupérer les notifs d'un utilisateur
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.param.userId });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
};

// mettre à jour une notif
exports.updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        notification.read = true;
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