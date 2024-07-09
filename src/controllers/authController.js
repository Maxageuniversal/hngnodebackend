// authController.js       
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const Organisation = require('../models/organisation');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
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
        statusCode: 401,
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
      statusCode: 401,
    });
  }
};

exports.getOrganisations = async (req, res) => {
  // Placeholder for fetching organisations
};

exports.getOrganisation = async (req, res) => {
  // Placeholder for fetching a single organisation
};

exports.createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  try {
    const org = await Organisation.create({
      orgId: uuidv4(),
      name,
      description,
    });

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Client error',
      statusCode: 400,
    });
  }
};

exports.addUserToOrganisation = async (req, res) => {
  const { userId } = req.body;
  const { orgId } = req.params;

  try {
    // Placeholder for adding user to organisation
    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Client error',
      statusCode: 400,
    });
  }
};
