const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'In Review', 'Approved', 'Rejected', 'Accepted'], default: 'Pending' },
    priority: {type: String, enum: ['Low', 'Medium', 'high'], default: 'Medium'},
    feedback: {type: String, default: ''},
    comments: [
        {
            text: { type: String, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            date: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Project', projectSchema);