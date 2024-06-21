require('dotenv').config({ path: './.env' }); // charge les variables d'environnement depuis le fichier .env
// affiche les variables pour vérif ( en prod uniquement, à retirer)
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
// import des modules nécessaires
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');

const app = express(); // initialise express
// utilise les middlewares nécessaires
app.use(express.json()); // parser les request avec payload JSON
app.use(helmet()); // sécuriser les en-têtes HTTP
app.use(cors()); // activer les request cross-origin
app.use(morgan('combined')); // logger les request HTTP
// utiliser les routes définies
app.use('/api/users', userRoutes); // routes pour les utilisateurs
app.use('/api/auth', authRoutes); // routes pour l'authentification
app.use('/api/home', homeRoutes); // routes pour la homepage

// route pour tester la co' à la bdd
app.get('/test-db', async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping(); // ping la bdd pour vérif la co'
        res.status(200).send("DB connected");
    } catch (err) {
        res.status(500).send('Failed to connect to DB');
    }
});

// middleware pour gérer les  404 errors
app.use((req, res, next) => {
    res.status(404).send('Page not found'); // retourne une err si la route n'est pas trouvée
});

// gérer les erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!'); // retourne une err en cas de prob server
});
// Co' à la bdd et gestion des événements de co' (co' réussie, err, déco')
console.log('Connecting to MongoDB...'); // à retirer plus tard ou pas ... 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
});
// démarrer le serveur sur le port spécifié
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
