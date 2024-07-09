// organisation.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const organisationController = require('../controllers/organisationController');

router.get('/', authMiddleware, organisationController.getOrganisations);
router.get('/:orgId', authMiddleware, organisationController.getOrganisation);
router.post('/', authMiddleware, organisationController.createOrganisation);
router.post('/:orgId/users', authMiddleware, organisationController.addUserToOrganisation);

module.exports = router;
