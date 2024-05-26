require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');

// Import routes
const routes = require('../../routes/main');
const leaderboardRoutes = require('../../routes/leaderboard');

// Setup MongoDB connection
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', error => {
  console.error(error);
  process.exit(1);
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Use routes
app.use('/.netlify/functions/server', routes);
app.use('/.netlify/functions/server', leaderboardRoutes);

// Catch-all handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'not found' });
});

module.exports.handler = serverless(app);
