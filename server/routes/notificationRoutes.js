const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationControllers'); // Assure-toi que ce nom correspond bien au fichier dans controllers

router.post('/create', auth, notificationController.createNotification);
router.get('/:userId', auth, notificationController.getUserNotifications);
router.put('/update/:notificationId', auth, notificationController.updateNotification);
router.delete('/delete/:notificationId', auth, notificationController.deleteNotification);

module.exports = router;
