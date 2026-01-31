const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');

router.get('/get-token', videoController.getToken);
router.post('/create-meeting', videoController.createMeeting);

module.exports = router;
