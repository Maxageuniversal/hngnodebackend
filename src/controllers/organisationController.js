// organisationController.js
const { Organisation } = require('../models/user');

exports.getOrganisations = async (req, res) => {
  try {
    // Assuming you have a method to get the user from token
    const userId = req.user.userId; 
    const organisations = await Organisation.findAll({ where: { userId } });

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
    const userId = req.user.userId; 
    const isMember = await organisation.hasUser(userId);

    if (!isMember) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'You do not have access to this organisation.',
      });
    }

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

// other functions remain unchanged
