const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sequelize = require('./config/database');
const { User, Sport, Equipment, Field, Reservation, Payment } = require('./models'); // Import models and relationships
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');
const adminRoutes = require('./routes/admin'); // Import admin routes

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Unable to connect to the database:', error));

// Sync Models with Database
sequelize.sync({ alter: true });

// Routes
app.use('/auth', authRoutes);
app.use('/reservations', reservationRoutes);
app.use('/admin', adminRoutes); // Add admin routes

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});