const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// @desc    Get all vehicles (with filters)
// @route   GET /api/vehicles
// @access  Public
const getVehicles = asyncHandler(async (req, res) => {
  const { location, minPrice, maxPrice, startDate, endDate } = req.query;

  let query = {};

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
  }

  // Basic fetch
  let vehicles = await Vehicle.find(query);

  // Filter by date availability if dates are provided
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find all bookings that overlap with requested dates
    const busyBookings = await Booking.find({
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    const busyVehicleIds = busyBookings.map(b => b.vehicle.toString());
    vehicles = vehicles.filter(v => !busyVehicleIds.includes(v._id.toString()));
  }

  res.json(vehicles);
});

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    res.json(vehicle);
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = asyncHandler(async (req, res) => {
  const { make, model, year, pricePerDay, location, images, features } = req.body;

  const vehicle = new Vehicle({
    make,
    model,
    year,
    pricePerDay,
    location,
    images: images || [],
    features: features || [],
    availabilityStatus: true
  });

  const createdVehicle = await vehicle.save();
  res.status(201).json(createdVehicle);
});

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = asyncHandler(async (req, res) => {
  const { make, model, year, pricePerDay, location, images, features, availabilityStatus } = req.body;

  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.pricePerDay = pricePerDay || vehicle.pricePerDay;
    vehicle.location = location || vehicle.location;
    vehicle.images = images || vehicle.images;
    vehicle.features = features || vehicle.features;
    vehicle.availabilityStatus = availabilityStatus !== undefined ? availabilityStatus : vehicle.availabilityStatus;

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
