require('dotenv').config({ path: './Config/config.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const chatRouter = require('./Routes/chat.js');
const NewErrorHandler = require('./Utils/NewErrorHandler');
const { ErrorController } = require('./Controllers/ErrorController.js');

app.use(express.json());

app.use(cors({
    origin: '*', // Replace with your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow cookies to be sent with requests
}));

// Fix: Add a leading slash to 'api'
app.use('/api', chatRouter);

app.all('*', (req, res, next) => next(new NewErrorHandler('Route Not Found', 404)));
app.use(ErrorController);

module.exports = app;
