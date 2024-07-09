// APP.JS
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const morgan = require('morgan'); // HTTP request logger middleware
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const organisationRoutes = require('./routes/organisation');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/organisation', organisationRoutes);

// Default route for testing purposes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handling middleware (if needed)
app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', message: err.message });
});

// Database connection
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Unable to connect to the database:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
