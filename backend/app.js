const express = require('express');
const cors = require('cors');
const db = require('./models'); // This will import models/index.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database synchronization
// In production, you might want to use migrations instead of sync()
db.sequelize.sync({ alter: true }) // Using alter: true to update schema without dropping data. Use { force: true } to drop and recreate tables.
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the application.' });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// Admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

module.exports = app;
