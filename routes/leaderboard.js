const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const resolvedPath = path.join(__dirname,'.', 'mLeaderboard');
console.log(`Resolved path: ${resolvedPath}`);

// Check if the file exists
fs.access(resolvedPath, fs.constants.F_OK, (err) => {
  console.log(`${resolvedPath} ${err ? 'does not exist' : 'exists'}`);
});

try {
  const Leaderboard = require(resolvedPath);
} catch (error) {
  console.error(`Error requiring Leaderboard module: ${error}`);
}

// GET leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 }).limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// PUT leaderboard
// keep only seven first entries
router.put('/leaderboard', async (req, res) => {
  const { initials, score } = req.body;
  if (!initials || !score) {
    return res.status(400).json({ error: 'Initials and score are required' });
  }

  try {
    // Add the new entry
    const newEntry = new Leaderboard({ initials, score });
    await newEntry.save();

    // Get the top 7 scores after adding the new entry
    const top7 = await Leaderboard.find().sort({ score: -1 }).limit(7);

    // Remove all entries that are not in the top 7
    const top7Ids = top7.map(entry => entry._id);
    await Leaderboard.deleteMany({ _id: { $nin: top7Ids } });

    res.status(200).json({ message: 'Score saved successfully and leaderboard updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

module.exports = router;
