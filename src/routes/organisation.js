const express = require('express');
const router = express.Router();
const organisationController = require('../controllers/organisationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, organisationController.getOrganisations);
router.get('/:orgId', authMiddleware, organisationController.getOrganisation);
router.post('/', authMiddleware, organisationController.createOrganisation);
router.post('/:orgId/users', authMiddleware, organisationController.addUserToOrganisation);

module.exports = router;
