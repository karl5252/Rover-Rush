const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/leaderboard');

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 }).limit(5).exec();
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/leaderboard', async (req, res) => {
  const { initials, score } = req.body;

  if (!initials || initials.length !== 3 || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const newEntry = new Leaderboard({ initials, score });
    await newEntry.save();

    const updatedLeaderboard = await Leaderboard.find().sort({ score: -1 }).limit(5).exec();
    res.status(200).json(updatedLeaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
