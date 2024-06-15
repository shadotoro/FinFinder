require('dotenv').config({ path: './.env' });
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/test-db', async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.status(200).send("DB connected");
    } catch (err) {
        res.status(500).send('Failed to connect to DB');
    }
});

// handle 404 errors
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
