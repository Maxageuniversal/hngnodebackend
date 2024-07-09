// organisationController.js
const { Organisation, User } = require('../models/organisation');
const { v4: uuidv4 } = require('uuid');

exports.getOrganisations = async (req, res) => {
  // Your implementation
};

exports.getOrganisation = async (req, res) => {
  // Your implementation
};

exports.createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  try {
    const userId = req.user.userId; // Ensure you have user information in the request
    const organisation = await Organisation.create({
      orgId: uuidv4(),
      name,
      description,
      userId // Associate organisation with user
    });

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to create organisation.'
    });
  }
};

exports.addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { email } = req.body;

  try {
    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organisation not found.'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'User not found.'
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to add user to organisation.',
    });
  }
};

// Other controller functions
