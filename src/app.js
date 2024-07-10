require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const organisationRoutes = require('./routes/organisation');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/organisations', organisationRoutes);

// Export the app instance for testing purposes
module.exports = app;

// Define the server and environment port
const port = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = server;


sequelize.sync()
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
