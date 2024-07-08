
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const morgan = require('morgan'); // HTTP request logger middleware
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const organisationRoutes = require('./routes/organisation');
const db = require('./config/database'); // Ensure this file configures and connects to your database

dotenv.config();
// Initialize express app
const app = express();

// Middleware setup
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;
// Use routes
app.use('/auth', authRoutes);
app.use('/organisation', organisationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
// Default route for testing purposes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Export the app
module.exports = app;
