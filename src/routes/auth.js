// src/routes/auth.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

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
