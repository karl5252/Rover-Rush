const mongoose = require('mongoose');
// example of a leaderboard entry:
// AAA................1230
// BBB................756
// CCC................289
const LeaderboardSchema = new mongoose.Schema({
  initials: {
    type: String,
    required: true,
    maxLength: 3
  },
  score: {
    type: Number,
    required: true
  }
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);
module.exports = Leaderboard;
