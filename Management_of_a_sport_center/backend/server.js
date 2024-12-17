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

// Sync Models with Database
sequelize.sync({ alter: true });

// Define Models
const Sport = sequelize.define('Sport', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true // URL de l'image du sport
  }
}, {
  timestamps: true // Ensure timestamps are enabled
});

const Equipment = sequelize.define('Equipment', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sportId: {
    type: DataTypes.INTEGER,
    references: {
      model: Sport,
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true // URL de l'image de l'équipement
  }
}, {
  timestamps: true // Ensure timestamps are enabled
});

const Field = sequelize.define('Field', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sportId: {
    type: DataTypes.INTEGER,
    references: {
      model: Sport,
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true // URL de l'image du terrain
  }
}, {
  timestamps: true // Ensure timestamps are enabled
});

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
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Default to false for regular users
  }
}, {
  timestamps: true // Ensure timestamps are enabled
});

const Reservation = sequelize.define('Reservation', {
  type: {
    type: DataTypes.ENUM('equipment', 'field'),
    allowNull: false
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true // Ensure timestamps are enabled
});

// Set up associations
Sport.hasMany(Equipment, { as: 'equipment', foreignKey: 'sportId' });
Sport.hasMany(Field, { as: 'fields', foreignKey: 'sportId' });
Equipment.belongsTo(Sport, { foreignKey: 'sportId' });
Field.belongsTo(Sport, { foreignKey: 'sportId' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });
Reservation.belongsTo(Equipment, { foreignKey: 'item_id', constraints: false });
Reservation.belongsTo(Field, { foreignKey: 'item_id', constraints: false });

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

// Middleware to check if the user is an admin
const authenticateAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Routes
app.post('/signup', async (req, res) => {
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

    const token = jwt.sign({ email: user.email, username: user.username, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'User logged in successfully', token, username: user.username, email: user.email, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Error logging in:', error); // Debug log to verify error
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/reservations', async (req, res) => {
  const reservations = await Reservation.findAll({
    include: [
      { model: Equipment, as: 'Equipment' },
      { model: Field, as: 'Field' }
    ]
  });
  res.status(200).json(reservations);
});

app.get('/my-reservations', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const userReservations = await Reservation.findAll({
      where: { user_id: user.id },
      include: [
        { model: Equipment, as: 'Equipment' },
        { model: Field, as: 'Field' }
      ]
    });
    res.status(200).json(userReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/reservations', authenticateJWT, async (req, res) => {
  const { type, item_id, date } = req.body;

  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    return res.status(400).json({ message: 'Cannot reserve a date before today' });
  }

  const isReserved = await Reservation.findOne({ where: { type, item_id, date } });
  if (isReserved) {
    return res.status(400).json({ message: 'Date already reserved' });
  }

  const user = await User.findOne({ where: { email: req.user.email } });
  await Reservation.create({ type, item_id, date, user_id: user.id });
  res.status(201).json({ message: 'Reservation created successfully' });
});

app.post('/cancel-reservation', authenticateJWT, async (req, res) => {
  const { type, item_id, date } = req.body;

  const user = await User.findOne({ where: { email: req.user.email } });
  const reservation = await Reservation.findOne({ where: { type, item_id, date, user_id: user.id } });

  if (!reservation) {
    return res.status(400).json({ message: 'Reservation not found' });
  }

  await reservation.destroy();
  res.status(200).json({ message: 'Reservation canceled successfully' });
});

app.post('/confirm-reservation', authenticateJWT, async (req, res) => {
  const { type, item_id, date } = req.body;

  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const reservation = await Reservation.findOne({ where: { type, item_id, date, user_id: user.id, confirmed: false } });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.confirmed = true;
    await reservation.save();
    res.status(200).json({ message: 'Reservation confirmed successfully' });
  } catch (error) {
    console.error('Error confirming reservation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/remove-from-basket', authenticateJWT, async (req, res) => {
  const { type, item_id, date } = req.body;

  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const reservation = await Reservation.findOne({ where: { type, item_id, date, user_id: user.id, confirmed: false } });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await reservation.destroy();
    res.status(200).json({ message: 'Reservation removed from basket successfully' });
  } catch (error) {
    console.error('Error removing from basket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/sports', async (req, res) => {
  try {
    const sports = await Sport.findAll({
      include: [
        { model: Equipment, as: 'equipment' },
        { model: Field, as: 'fields' }
      ]
    });
    res.status(200).json(sports);
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new sport
app.post('/admin/sports', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { name, imageUrl } = req.body;
  try {
    const sport = await Sport.create({ name, imageUrl });
    res.status(201).json(sport);
  } catch (error) {
    console.error('Error creating sport:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new equipment
app.post('/admin/equipment', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { name, price, sportId, imageUrl } = req.body;
  try {
    const equipment = await Equipment.create({ name, price, sportId, imageUrl });
    res.status(201).json(equipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new field
app.post('/admin/fields', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { name, price, sportId, imageUrl } = req.body;
  try {
    const field = await Field.create({ name, price, sportId, imageUrl });
    res.status(201).json(field);
  } catch (error) {
    console.error('Error creating field:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a sport
app.put('/admin/sports/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;
  try {
    const sport = await Sport.findByPk(id);
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    sport.name = name;
    sport.imageUrl = imageUrl;
    await sport.save();
    res.status(200).json({ message: 'Sport updated successfully' });
  } catch (error) {
    console.error('Error updating sport:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an equipment
app.put('/admin/equipment/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, sportId, imageUrl } = req.body;
  try {
    const equipment = await Equipment.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    equipment.name = name;
    equipment.price = price;
    equipment.sportId = sportId;
    equipment.imageUrl = imageUrl;
    await equipment.save();
    res.status(200).json({ message: 'Equipment updated successfully' });
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a field
app.put('/admin/fields/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, sportId, imageUrl } = req.body;
  try {
    const field = await Field.findByPk(id);
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    field.name = name;
    field.price = price;
    field.sportId = sportId;
    field.imageUrl = imageUrl;
    await field.save();
    res.status(200).json({ message: 'Field updated successfully' });
  } catch (error) {
    console.error('Error updating field:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a sport
app.delete('/admin/sports/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const sport = await Sport.findByPk(id);
    if (!sport) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    await sport.destroy();
    res.status(200).json({ message: 'Sport deleted successfully' });
  } catch (error) {
    console.error('Error deleting sport:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an equipment
app.delete('/admin/equipment/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const equipment = await Equipment.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    await equipment.destroy();
    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a field
app.delete('/admin/fields/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const field = await Field.findByPk(id);
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    await field.destroy();
    res.status(200).json({ message: 'Field deleted successfully' });
  } catch (error) {
    console.error('Error deleting field:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
});

// Add this route to fetch users
app.get('/admin/users', authenticateJWT, authenticateAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add this route to fetch reservations for a specific user
app.get('/admin/users/:id/reservations', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const reservations = await Reservation.findAll({
      where: { user_id: id },
      include: [
        { model: Equipment, as: 'Equipment' },
        { model: Field, as: 'Field' }
      ]
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/admin/users/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/admin/reservations/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    await reservation.destroy();
    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
