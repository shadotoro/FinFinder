const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);