// src/controllers/authController.js

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Validate input (you can use Joi or express-validator here)

    // Check if email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists',
      });
    }

    // Create new user instance
    const newUser = new User({
      email,
      password, // Password should be hashed before saving (bcrypt)
      firstName,
      lastName,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return success response with token
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Registration unsuccessful',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message,
      })),
    });
  }
};

module.exports = {
  registerUser,
};
