const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key'; // Use a strong secret key in production

app.use(bodyParser.json());
app.use(cors());

const users = [];

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use(limiter);

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });
  res.status(201).json({ message: 'User signed up successfully' });
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
  res.status(200).json({ message: 'User logged in successfully', token });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// Secure endpoint to get the list of all users
app.get('/users', authenticateJWT, (req, res) => {
  res.status(200).json(users);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});