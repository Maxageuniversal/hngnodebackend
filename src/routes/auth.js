// src/routes/auth.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { User } = require('../models'); // Adjust based on your model imports
const { Organisation } = require('../models/organisation');


// Example protected route to get user's own record
router.get('/api/users/:id', authMiddleware, async (req, res) => {
  try {
    // Check if the requested user ID matches the authenticated user's ID
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'You are not authorized to access this resource.',
      });
    }

    // Fetch user record based on authenticated user's ID
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'User not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User details fetched successfully',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to fetch user details.',
    });
  }
});

module.exports = router;
