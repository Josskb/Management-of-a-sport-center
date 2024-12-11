const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Correctly load .env file

const app = express();
const port = 3000;
const secretKey = process.env.SECRET_KEY; // Use the secret key from environment variables

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend URL
  credentials: true,
}));
app.use(helmet());
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST);

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Unable to connect to the database:', error));

// Define User Model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Define Reservation Model
const Reservation = sequelize.define('Reservation', {
  sport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// Sync Models with Database
sequelize.sync();

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// Routes
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    console.log('User created:', user); // Debug log to verify user creation

    const token = jwt.sign({ email, username }, secretKey, { expiresIn: '1h' });
    res.status(201).json({ message: 'User signed up successfully', token, username });
  } catch (error) {
    console.error('Error creating user:', error); // Debug log to verify error
    res.status(400).json({ message: 'User already exists' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found:', email); // Debug log to verify user not found
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email); // Debug log to verify invalid password
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email, username: user.username }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'User logged in successfully', token, username: user.username });
  } catch (error) {
    console.error('Error logging in:', error); // Debug log to verify error
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/reservations', async (req, res) => {
  const reservations = await Reservation.findAll();
  res.status(200).json(reservations);
});

app.get('/my-reservations', authenticateJWT, async (req, res) => {
  const user = await User.findOne({ where: { email: req.user.email } });
  const userReservations = await Reservation.findAll({ where: { userId: user.id } });
  res.status(200).json(userReservations);
});

app.post('/reservations', authenticateJWT, async (req, res) => {
  const { sport, date } = req.body;

  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    return res.status(400).json({ message: 'Cannot reserve a date before today' });
  }

  const isReserved = await Reservation.findOne({ where: { sport, date } });
  if (isReserved) {
    return res.status(400).json({ message: 'Date already reserved' });
  }

  const user = await User.findOne({ where: { email: req.user.email } });
  await Reservation.create({ sport, date, userId: user.id });
  res.status(201).json({ message: 'Reservation created successfully' });
});

app.post('/cancel-reservation', authenticateJWT, async (req, res) => {
  const { sport, date } = req.body;

  const user = await User.findOne({ where: { email: req.user.email } });
  const reservation = await Reservation.findOne({ where: { sport, date, userId: user.id } });

  if (!reservation) {
    return res.status(400).json({ message: 'Reservation not found' });
  }

  await reservation.destroy();
  res.status(200).json({ message: 'Reservation canceled successfully' });
});

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});