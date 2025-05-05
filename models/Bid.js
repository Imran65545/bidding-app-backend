// server/models/Bid.js
const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: String,
    required: true,
    // unique: true,  ← this should be removed or commented out
  },
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bid', BidSchema);
