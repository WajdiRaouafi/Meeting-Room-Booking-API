const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware'); // Adjust the path as necessary

const { getAllReservation, createReservation,getUserReservations } = require('../controllers/reservationController');

router.get('/all', getAllReservation);
router.post('/create', createReservation);
router.get('/reservations/user3', authenticateToken, getUserReservations);


module.exports = router;

