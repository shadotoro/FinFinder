const mongoose = require('mongoose');

// définition du shéma d'utilisateur
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // le nom d'utilisateur doit être unique ds la bdd
    email: { type: String, required: true, unique: true }, // idem pour l'email
    password: { type: String, required: true }, // le mdp est obligatoire
    resetPasswordToken: String, // Token de réinitialisation de mdp
    resetPasswordExpire: Date, // date d'expiration du token de réinitialisation
    role: { type: String, enum: ['Donateur', 'Chercheur', 'Admin'], default: 'Donateur'}, // champ pour le rôle des utilisateurs
    profileImage: { type: String },
    projectsFunded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    projectsSubmitted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    projectsAccepted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); // exportation du modèle utilisateur basé sur le schéma
