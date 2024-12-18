const express = require('express');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Field = require('../models/Field');
const Payment = require('../models/Payment');
const Sport = require('../models/Sport');
const { authenticateJWT } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.get('/reservations', async (req, res) => {
  const reservations = await Reservation.findAll({
    include: [
      { model: Equipment, as: 'Equipment' },
      { model: Field, as: 'Field' }
    ]
  });
  res.status(200).json(reservations);
});

router.get('/my-reservations', authenticateJWT, async (req, res) => {
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
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/reservations', authenticateJWT, async (req, res) => {
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

router.post('/cancel-reservation', authenticateJWT, async (req, res) => {
  const { type, item_id, date } = req.body;

  const user = await User.findOne({ where: { email: req.user.email } });
  const reservation = await Reservation.findOne({ where: { type, item_id, date, user_id: user.id } });

  if (!reservation) {
    return res.status(400).json({ message: 'Reservation not found' });
  }

  await reservation.destroy();
  res.status(200).json({ message: 'Reservation canceled successfully' });
});

router.post('/confirm-reservation', authenticateJWT, async (req, res) => {
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
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/remove-from-basket', authenticateJWT, async (req, res) => {
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
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/confirm-payment', authenticateJWT, async (req, res) => {
  const { paymentMethod } = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ where: { email: decoded.email } });

    const reservations = await Reservation.findAll({
      where: { user_id: user.id, confirmed: false },
      include: [
        { model: Equipment, as: 'Equipment' },
        { model: Field, as: 'Field' }
      ]
    });

    let totalAmount = 0;
    for (const reservation of reservations) {
      totalAmount += parseFloat(reservation.type === 'equipment' ? reservation.Equipment.price : reservation.Field.price);
      reservation.confirmed = true;
      await reservation.save();
    }

    for (const reservation of reservations) {
      await Payment.create({
        amount: reservation.type === 'equipment' ? reservation.Equipment.price : reservation.Field.price,
        payment_method: paymentMethod,
        reservation_id: reservation.id
      });
    }

    res.status(200).json({ message: 'Payment successful and reservations confirmed!' });
  } catch (error) {
    console.error('Error confirming payment:', error); 
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/sports', async (req, res) => {
  try {
    const sports = await Sport.findAll({
      include: [
        { model: Equipment, as: 'equipment' },
        { model: Field, as: 'fields' }
      ]
    });
    res.status(200).json(sports);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;