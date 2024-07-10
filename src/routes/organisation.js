const express = require('express');
const { getOrganisations } = require('../controllers/organisationController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getOrganisations);

module.exports = router;
