const Property = require('../models/Property');
const RentalRequest = require('../models/RentalRequest');
const Favorite = require('../models/Favorite');

// @desc    Get all properties with filtering, search, sorting & pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const {
      location,
      type,
      minRent,
      maxRent,
      bedrooms,
      furnished,
      amenities,
      sort,
      status,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Availability status filter (default to 'available' if not explicitly queried, or allow any)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Location / Text Search (matches location, title, or city)
    if (location && location.trim() !== '') {
      const regex = new RegExp(location.trim(), 'i');
      query.$or = [{ location: regex }, { title: regex }, { city: regex }];
    }

    // Property Type filter (single or comma-separated list)
    if (type && type !== 'all') {
      const types = type.split(',').map((t) => t.trim());
      query.type = { $in: types };
    }

    // Rent Price Range ($gte, $lte)
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent && !isNaN(Number(minRent))) {
        query.rent.$gte = Number(minRent);
      }
      if (maxRent && !isNaN(Number(maxRent))) {
        query.rent.$lte = Number(maxRent);
      }
    }

    // Bedrooms filter
    if (bedrooms && bedrooms !== 'all') {
      if (bedrooms.includes('+')) {
        const minBeds = parseInt(bedrooms, 10);
        query.bedrooms = { $gte: minBeds };
      } else if (!isNaN(Number(bedrooms))) {
        query.bedrooms = Number(bedrooms);
      }
    }

    // Furnishing filter
    if (furnished && furnished !== 'all') {
      const furnishedList = furnished.split(',').map((f) => f.trim());
      query.furnished = { $in: furnishedList };
    }

    // Amenities filter (e.g. amenities=WiFi,Parking or array)
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim()).filter(Boolean);
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortOption = { rent: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { rent: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortOption = { views: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 9);
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('ownerId', 'name email phone avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: properties.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('ownerId', 'name email phone avatar createdAt');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found with this ID.',
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Owner only)
const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      location,
      city,
      rent,
      bedrooms,
      bathrooms,
      area,
      furnished,
      amenities,
      images,
      status,
    } = req.body;

    if (!title || !description || !type || !location || !rent || !bedrooms || !bathrooms || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required property details.',
      });
    }

    let parsedImages = images;
    if (typeof images === 'string') {
      parsedImages = [images];
    }
    if (!parsedImages || parsedImages.length === 0) {
      parsedImages = [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      ];
    }

    let parsedAmenities = amenities;
    if (typeof amenities === 'string') {
      parsedAmenities = amenities.split(',').map((a) => a.trim()).filter(Boolean);
    }

    const property = await Property.create({
      title,
      description,
      type,
      location,
      city: city || location.split(',').pop()?.trim() || '',
      rent: Number(rent),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      furnished: furnished || 'Semi Furnished',
      amenities: parsedAmenities || [],
      images: parsedImages,
      ownerId: req.user._id,
      status: status || 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Property listing created successfully.',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner only, ownership-checked)
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Verify ownership
    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit properties you own.',
      });
    }

    // Handle amenities array if passed as string
    if (req.body.amenities && typeof req.body.amenities === 'string') {
      req.body.amenities = req.body.amenities.split(',').map((a) => a.trim()).filter(Boolean);
    }

    // Handle images if passed as string
    if (req.body.images && typeof req.body.images === 'string') {
      req.body.images = [req.body.images];
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('ownerId', 'name email phone avatar');

    res.json({
      success: true,
      message: 'Property updated successfully.',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner only, ownership-checked)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Verify ownership
    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete properties you own.',
      });
    }

    // Cascade delete related rental requests & favorites
    await RentalRequest.deleteMany({ propertyId: property._id });
    await Favorite.deleteMany({ propertyId: property._id });
    await property.deleteOne();

    res.json({
      success: true,
      message: 'Property and associated requests removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties owned by current user
// @route   GET /api/properties/owner/mine
// @access  Private (Owner only)
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id }).sort({ createdAt: -1 });

    // Compute owner statistics
    const propertyIds = properties.map((p) => p._id);
    const totalRequests = await RentalRequest.countDocuments({ propertyId: { $in: propertyIds } });
    const pendingRequests = await RentalRequest.countDocuments({
      propertyId: { $in: propertyIds },
      status: 'pending',
    });
    const acceptedRequests = await RentalRequest.countDocuments({
      propertyId: { $in: propertyIds },
      status: 'accepted',
    });
    const totalViews = properties.reduce((acc, curr) => acc + (curr.views || 0), 0);

    res.json({
      success: true,
      data: properties,
      stats: {
        totalProperties: properties.length,
        totalViews,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        acceptanceRate: totalRequests > 0 ? Math.round((acceptedRequests / totalRequests) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
