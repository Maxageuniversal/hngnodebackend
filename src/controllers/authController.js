const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Organisation = require('../models/organisation');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({
        errors: [
          { field: "firstName", message: "First name is required" },
          { field: "lastName", message: "Last name is required" },
          { field: "email", message: "Email is required" },
          { field: "password", message: "Password is required" }
        ],
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

    const orgName = `${firstName}'s Organisation`;
    await Organisation.create({
      orgId: uuidv4(),
      name: orgName,
      description: '',
      UserId: user.id
    });

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      status: "success",
      message: "Registration successful",
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
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        errors: [
          { field: "email", message: "Email is required" },
          { field: "password", message: "Password is required" }
        ],
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: "success",
      message: "Login successful",
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
      status: "Bad request",
      message: "Login unsuccessful",
      statusCode: 400,
    });
  }
};

module.exports = { register, login };
