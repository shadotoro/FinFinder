const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const projectRoutes = require('./routes/projectRoutes');

require('dotenv').config({ path: './.env' });

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200); // Répond avec le statut 200 OK pour les requêtes OPTIONS
});


app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Utiliser les routes définies
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/projects', projectRoutes);

app.get('/test-db', async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.status(200).send("DB connected");
    } catch (err) {
        res.status(500).send('Failed to connect to DB');
    }
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// Gérer les erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Utiliser Mongoose pour se connecter à MongoDB
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
.then(() => {
    console.log('MongoDB connected successfully');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
});
