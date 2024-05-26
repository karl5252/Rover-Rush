const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const Leaderboard = require('../../models/mLeaderboard'); // Ensure the path is correct

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Setup MongoDB Atlas connection
const uri = process.env.MONGO_ATLAS_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', error => {
  console.error(error);
  process.exit(1);
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 }).limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

router.put('/leaderboard', async (req, res) => {
  const { initials, score } = req.body;
  if (!initials || !score) {
    return res.status(400).json({ error: 'Initials and score are required' });
  }

  try {
    const newEntry = new Leaderboard({ initials, score });
    await newEntry.save();

    const top7 = await Leaderboard.find().sort({ score: -1 }).limit(7);
    const top7Ids = top7.map(entry => entry._id);
    await Leaderboard.deleteMany({ _id: { $nin: top7Ids } });

    res.status(200).json({ message: 'Score saved successfully and leaderboard updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

app.use('/.netlify/functions/leaderboard', router);

module.exports.handler = serverless(app);
