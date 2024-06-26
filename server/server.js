const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const projectRoutes = require('./routes/projectRoutes');

require('dotenv').config({ path: './.env' });

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));

// Servir les fichiers statiques
app.use('./uploads', express.static(path.join(__dirname, 'uploads')));

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
