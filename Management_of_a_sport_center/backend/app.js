const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const reservationRoutes = require('./routes/reservations');
const adminRoutes = require('./routes/admin'); 
const sportsRoutes = require('./routes/sports'); 

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/reservations', reservationRoutes);
app.use('/admin', adminRoutes); 
app.use('/api/sports', sportsRoutes); // Register sports routes with correct base path

module.exports = app;