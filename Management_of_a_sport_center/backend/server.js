const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
const secretKey = 'your_hardcoded_secret_key'; // Use a hardcoded secret key

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser()); // Add cookie-parser middleware

const users = [];
const reservations = [];

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use(limiter);

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate that username, email, and password are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  const userExists = users.some(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });

  const token = jwt.sign({ email, username }, secretKey, { expiresIn: '1h' });
  res.status(201).json({ message: 'User signed up successfully', token, username });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email: user.email, username: user.username }, secretKey, { expiresIn: '1h' });
  res.status(200).json({ message: 'User logged in successfully', token, username: user.username });
});

// Middleware to authenticate JWT
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

// Endpoint to get all reservations
app.get('/reservations', (req, res) => {
  res.status(200).json(reservations);
});

// Endpoint to get reservations for the logged-in user
app.get('/my-reservations', authenticateJWT, (req, res) => {
  const userReservations = reservations.filter(reservation => reservation.user === req.user.username);
  res.status(200).json(userReservations);
});

// Endpoint to create a reservation
app.post('/reservations', authenticateJWT, (req, res) => {
  const { sport, date } = req.body;

  // Check if the date is already reserved
  const isReserved = reservations.some(reservation => reservation.sport === sport && reservation.date === date);

  if (isReserved) {
    return res.status(400).json({ message: 'Date already reserved' });
  }

  reservations.push({ sport, date, user: req.user.username });
  res.status(201).json({ message: 'Reservation created successfully' });
});

// Endpoint to get the list of all users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});