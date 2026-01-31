const express = require('express');
const router = express.Router();
const partyController = require('../controllers/party.controller');

router.post('/create', partyController.createParty);
router.get('/:code', partyController.getParty);

module.exports = router;
