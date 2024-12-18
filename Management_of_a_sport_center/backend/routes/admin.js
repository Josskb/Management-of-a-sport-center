const express = require('express');
const { authenticateJWT, authenticateAdmin } = require('../middleware/auth');
const Sport = require('../models/Sport');
const Equipment = require('../models/Equipment');
const Field = require('../models/Field');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment'); 
const router = express.Router();

// Create a new sport
router.post('/sports', authenticateJWT, authenticateAdmin, async (req, res) => {
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
router.post('/equipment', authenticateJWT, authenticateAdmin, async (req, res) => {
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
router.post('/fields', authenticateJWT, authenticateAdmin, async (req, res) => {
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
router.put('/sports/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
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
router.put('/equipment/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
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
router.put('/fields/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
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
router.delete('/sports/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
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
router.delete('/equipment/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
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
router.delete('/fields/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
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

// Fetch all users
router.get('/users', authenticateJWT, authenticateAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch reservations for a specific user
router.get('/users/:id/reservations', authenticateJWT, authenticateAdmin, async (req, res) => {
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

// Ban a user
router.delete('/users/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all reservations for the user
    const reservations = await Reservation.findAll({ where: { user_id: req.params.id } });

    // Delete associated payments first
    for (const reservation of reservations) {
      await Payment.destroy({ where: { reservation_id: reservation.id } });
    }

    // Delete reservations
    await Reservation.destroy({ where: { user_id: req.params.id } });

    // Delete user
    await user.destroy();
    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel a reservation
router.delete('/reservations/:id', authenticateJWT, authenticateAdmin, async (req, res) => {
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

module.exports = router;
