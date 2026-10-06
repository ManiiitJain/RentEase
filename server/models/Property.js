const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['Apartment', 'House', 'Villa', 'PG', 'Studio'],
    },
    location: {
      type: String,
      required: [true, 'Please specify location/address'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    rent: {
      type: Number,
      required: [true, 'Please specify monthly rent in INR'],
      min: [1, 'Rent must be positive'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: [0, 'Bedrooms cannot be negative'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: [1, 'Must have at least 1 bathroom'],
    },
    area: {
      type: Number,
      required: [true, 'Please specify carpet area in sq.ft'],
      min: [10, 'Area must be at least 10 sq.ft'],
    },
    furnished: {
      type: String,
      required: [true, 'Please specify furnishing state'],
      enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'],
      default: 'Semi Furnished',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'Please provide at least one image',
      },
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'rented'],
      default: 'available',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance querying & text search
propertySchema.index({ location: 'text', title: 'text', city: 'text' });
propertySchema.index({ rent: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ ownerId: 1 });

module.exports = mongoose.model('Property', propertySchema);
