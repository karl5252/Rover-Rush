require('dotenv').config();
const routes = require('./routes/main');
//const secureRoutes = require('./routes/secure');
const leaderboardRoutes = require('./routes/leaderboard');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// setup mongo connection
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri);
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('connected to mongo');
});


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/', routes);
//app.use('/', secureRoutes);
app.use('/', leaderboardRoutes)


// other
app.use((req,res,next) => {
    res.status(404);
    res.json({error: 'not found'});
});

// listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
