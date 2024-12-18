const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const secretKey = process.env.SECRET_KEY;

router.post('/signup', async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, isAdmin });

    const token = jwt.sign({ email, username, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
    res.status(201).json({ message: 'User signed up successfully', token, username, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(400).json({ message: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email, username: user.username, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'User logged in successfully', token, username: user.username, email: user.email, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;