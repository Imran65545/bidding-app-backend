
const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');





// server/routes/bidRoutes.js

// POST /api/bids
router.post("/", async (req, res) => {
  const { name, phone, amount } = req.body;

  try {
    const newBid = new Bid({ name, phone, amount });
    await newBid.save();
    res.status(201).json({ message: "New bid placed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Bid.aggregate([
      { $sort: { amount: -1, createdAt: 1 } },
      {
        $group: {
          _id: "$phone",
          name: { $first: "$name" },
          phone: { $first: "$phone" }, // <-- Add this line
          amount: { $first: "$amount" },
        }
      },
      { $sort: { amount: -1 } }
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching leaderboard." });
  }
});

// GET all bids (needed for /api/bids)
router.get("/", async (req, res) => {
  try {
    const bids = await Bid.find();
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET name/phone suggestions (already in your code — keep it!)
router.get("/suggestions", async (req, res) => {
  const { query, type } = req.query;

  if (!query || !type || !["name", "phone"].includes(type)) {
    return res.status(400).json({ message: "Invalid query parameters." });
  }

  try {
    const filter = {};
    filter[type] = { $regex: new RegExp("^" + query, "i") };

    const suggestions = await Bid.find(filter)
      .limit(5)
      .select(type)
      .lean();

    const unique = [...new Set(suggestions.map(item => item[type]))];

    res.json(unique);
  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json({ message: "Error fetching suggestions." });
  }
});


// GET /api/bids/suggestions?query=ta&type=name
router.get("/suggestions", async (req, res) => {
  const { query, type } = req.query;

  if (!query || !type || !["name", "phone"].includes(type)) {
    return res.status(400).json({ message: "Invalid query parameters." });
  }

  try {
    const filter = {};
    filter[type] = { $regex: new RegExp("^" + query, "i") }; // Starts with, case-insensitive

    const suggestions = await Bid.find(filter)
      .limit(5)
      .select(type)
      .lean();

    const unique = [...new Set(suggestions.map(item => item[type]))];

    res.json(unique);
  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json({ message: "Error fetching suggestions." });
  }
});



module.exports = router;
