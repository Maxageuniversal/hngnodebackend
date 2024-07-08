const express = require('express');
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const morgan = require('morgan'); // HTTP request logger middleware
const bodyParser = require('body-parser'); // Parse incoming request bodies

// Initialize express app
const app = express();

// Middleware setup
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Import and use routes
const authRoutes = require('./routes/auth');
const organisationRoutes = require('./routes/organisation');

// Use routes
app.use('/auth', authRoutes);
app.use('/organisation', organisationRoutes);

// Default route for testing purposes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Export the app
module.exports = app;
