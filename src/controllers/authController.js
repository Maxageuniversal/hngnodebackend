// authController.js       
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const Organisation = require('../models/organisation');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'Bad request',
        message: 'Email already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const org = await Organisation.create({
      orgId: uuidv4(),
      name: `${firstName}'s Organisation`,
      description: '',
    });

    // Associate user with organisation
    await user.addOrganisation(org);

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    let statusCode = 400;
    if (error.name === 'SequelizeValidationError') {
      statusCode = 422;
    }
    res.status(statusCode).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message,
      })),
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Authentication failed',
    });
  }
};

// other functions remain unchanged
