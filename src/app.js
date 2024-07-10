const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const organisationRoutes = require('./routes/organisation');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/organisations', organisationRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
