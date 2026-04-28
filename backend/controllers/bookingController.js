const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { vehicleId, startDate, endDate, pickupTime, dropoffTime, totalPrice } = req.body;

  if (!vehicleId || !startDate || !endDate || !pickupTime || !dropoffTime || !totalPrice) {
    res.status(400);
    throw new Error('Please provide all booking details');
  }

  // Check if vehicle is still available for these dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlap = await Booking.findOne({
    vehicle: vehicleId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }]
  });

  if (overlap) {
    res.status(400);
    throw new Error('Vehicle is already booked for these dates');
  }

  const booking = new Booking({
    user: req.user._id,
    vehicle: vehicleId,
    startDate,
    endDate,
    pickupTime,
    dropoffTime,
    totalPrice,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('vehicle');
  res.json(bookings);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({}).populate('user', 'name email').populate('vehicle');
  res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    // If user is not admin, they can only cancel their own pending/confirmed booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this booking');
    }

    const { status } = req.body;
    if (status) {
        booking.status = status;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Get Admin Dashboard Stats
// @route   GET /api/bookings/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
    const totalBookings = await Booking.countDocuments();
    const activeUsers = await User.countDocuments({ role: 'user' });
    
    const revenueData = await Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
        totalBookings,
        activeUsers,
        totalRevenue
    });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookings,
  updateBookingStatus,
  getStats
};
