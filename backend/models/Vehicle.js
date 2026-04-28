const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Please add a vehicle make'],
    },
    model: {
      type: String,
      required: [true, 'Please add a vehicle model'],
    },
    year: {
      type: Number,
      required: [true, 'Please add a vehicle year'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Please add price per day'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    images: [
      {
        type: String, // URLs to images
      },
    ],
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
    features: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
