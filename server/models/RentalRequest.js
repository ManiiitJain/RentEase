const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message for the property owner'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    moveInDate: {
      type: Date,
      required: [true, 'Please provide an intended move-in date'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
rentalRequestSchema.index({ propertyId: 1, renterId: 1 });
rentalRequestSchema.index({ ownerId: 1 });
rentalRequestSchema.index({ renterId: 1 });
rentalRequestSchema.index({ status: 1 });

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);
