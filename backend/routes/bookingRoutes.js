const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookings,
  updateBookingStatus,
  getStats
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, admin, getBookings);
router.get('/mybookings', protect, getMyBookings);
router.get('/stats', protect, admin, getStats);
router.put('/:id', protect, updateBookingStatus);

module.exports = router;
