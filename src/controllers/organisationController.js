// src/controllers/organisationController.js

const { Organisation } = require('../models/user');

exports.getOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.findAll();

    res.status(200).json({
      status: 'success',
      message: 'Organisations fetched successfully',
      data: { organisations },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to fetch organisations.',
    });
  }
};

exports.getOrganisation = async (req, res) => {
  const { orgId } = req.params;

  try {
    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organisation not found.',
      });
    }

    // Add logic to check if the user has access to this organisation
    // Example: Check if the user is a member of this organisation

    res.status(200).json({
      status: 'success',
      message: 'Organisation fetched successfully',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to fetch organisation details.',
    });
  }
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
    // Implement logic to add user to organisation
    // Example: Add userId to the organisation's users list

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
