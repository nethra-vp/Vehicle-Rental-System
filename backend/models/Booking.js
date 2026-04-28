const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Vehicle',
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    pickupTime: {
        type: String,
        required: [true, 'Please add a pick-up time'],
    },
    dropoffTime: {
        type: String,
        required: [true, 'Please add a drop-off time'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please add total price'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
