const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationControllers');

router.post('/create', auth, notificationController.createNotification);
router.get('/:userId', auth, notificationController.getUserNotifications);
router.put('/update/:notificationId', auth, notificationController.updateNotification);
router.delete('/delete/:notificationId', auth, notificationController.deleteNotification);
router.post('/comment-and-notify/:projectId', auth, notificationController.addCommentAndNotify);

module.exports = router;
