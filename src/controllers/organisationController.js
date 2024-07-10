const Organisation = require('../models/organisation');

const getOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.findAll({ where: { UserId: req.user.id } });
    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { organisations },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Error retrieving organisations",
      statusCode: 400,
    });
  }
};

module.exports = { getOrganisations };
