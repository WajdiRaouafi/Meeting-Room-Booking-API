const express = require('express');
const router = express.Router();
const { getAllRooms, createMeetingRoom, reserveRoom } = require('../controllers/meetingRoomController');

router.get('/', getAllRooms);
router.post('/create', createMeetingRoom);
router.post('/reserve', reserveRoom);

module.exports = router;
