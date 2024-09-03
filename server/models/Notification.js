// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    comment: { type: String },
    replies: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Notification', notificationSchema);
