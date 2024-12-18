const User = require('./User');
const Sport = require('./Sport');
const Equipment = require('./Equipment');
const Field = require('./Field');
const Reservation = require('./Reservation');
const Payment = require('./Payment');

// Define relationships
User.hasMany(Reservation, { foreignKey: 'user_id' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });

Sport.hasMany(Equipment, { as: 'equipment', foreignKey: 'sportId' });
Equipment.belongsTo(Sport, { foreignKey: 'sportId' });

Sport.hasMany(Field, { as: 'fields', foreignKey: 'sportId' });
Field.belongsTo(Sport, { foreignKey: 'sportId' });

Reservation.belongsTo(Equipment, { foreignKey: 'item_id', constraints: false });
Reservation.belongsTo(Field, { foreignKey: 'item_id', constraints: false });

Reservation.hasMany(Payment, { foreignKey: 'reservation_id' });
Payment.belongsTo(Reservation, { foreignKey: 'reservation_id' });

module.exports = {
  User,
  Sport,
  Equipment,
  Field,
  Reservation,
  Payment
};