const RentalRequest = require('../models/RentalRequest');
const Property = require('../models/Property');

// @desc    Submit a rental request
// @route   POST /api/requests
// @access  Private (Renter only)
const createRentalRequest = async (req, res, next) => {
  try {
    const { propertyId, message, moveInDate } = req.body;

    if (!propertyId || !message || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, message, and move-in date.',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Disallow owner from renting their own property
    if (property.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit a rental request for your own property.',
      });
    }

    // Check if property is already rented
    if (property.status === 'rented') {
      return res.status(400).json({
        success: false,
        message: 'This property has already been rented.',
      });
    }

    // Check for duplicate pending request from the same renter
    const existingRequest = await RentalRequest.findOne({
      propertyId,
      renterId: req.user._id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending rental request for this property.',
      });
    }

    const request = await RentalRequest.create({
      propertyId,
      renterId: req.user._id,
      ownerId: property.ownerId,
      message,
      moveInDate,
      status: 'pending',
    });

    const populatedRequest = await RentalRequest.findById(request._id)
      .populate('propertyId', 'title location rent images type')
      .populate('ownerId', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message: 'Rental request submitted successfully!',
      data: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current renter's submitted rental requests
// @route   GET /api/requests/my
// @access  Private (Renter only)
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await RentalRequest.find({ renterId: req.user._id })
      .populate('propertyId', 'title location rent images type bedrooms bathrooms status')
      .populate('ownerId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's incoming rental requests
// @route   GET /api/requests/owner
// @access  Private (Owner only)
const getOwnerRequests = async (req, res, next) => {
  try {
    const requests = await RentalRequest.find({ ownerId: req.user._id })
      .populate('propertyId', 'title location rent images type status')
      .populate('renterId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update rental request status (accept or reject)
// @route   PUT /api/requests/:id
// @access  Private (Owner only)
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "rejected".',
      });
    }

    const request = await RentalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found.',
      });
    }

    // Verify ownership
    if (request.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only respond to requests for your properties.',
      });
    }

    request.status = status;
    await request.save();

    // If accepted, optionally mark property as rented or keep owner's discretion
    if (status === 'accepted') {
      await Property.findByIdAndUpdate(request.propertyId, { status: 'rented' });
    }

    const updatedRequest = await RentalRequest.findById(request._id)
      .populate('propertyId', 'title location rent images type status')
      .populate('renterId', 'name email phone avatar');

    res.json({
      success: true,
      message: `Request ${status} successfully.`,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRentalRequest,
  getMyRequests,
  getOwnerRequests,
  updateRequestStatus,
};
