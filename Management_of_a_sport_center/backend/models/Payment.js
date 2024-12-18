const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Reservation = require('./Reservation');

const Payment = sequelize.define('Payment', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  payment_method: {
    type: DataTypes.ENUM('card', 'cash'),
    allowNull: false
  },
  reservation_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Reservation,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Payment;
