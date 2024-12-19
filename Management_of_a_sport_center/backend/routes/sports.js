const express = require('express');
const router = express.Router();
const Sport = require('../models/Sport');

// Get all sports
router.get('/', async (req, res) => {
  try {
    const sports = await Sport.findAll();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sports' });
  }
});

module.exports = router;