const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
      propertyId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Property is already in your favorites.',
      });
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      propertyId,
    });

    res.status(201).json({
      success: true,
      message: 'Property added to favorites.',
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      propertyId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Property was not found in your favorites.',
      });
    }

    res.json({
      success: true,
      message: 'Property removed from favorites.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorite properties
// @route   GET /api/favorites
// @access  Private
const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate({
        path: 'propertyId',
        populate: {
          path: 'ownerId',
          select: 'name email phone avatar',
        },
      })
      .sort({ createdAt: -1 });

    // Filter out any favorites where the property may have been deleted
    const validFavorites = favorites
      .filter((fav) => fav.propertyId)
      .map((fav) => fav.propertyId);

    res.json({
      success: true,
      count: validFavorites.length,
      data: validFavorites,
      favoriteIds: validFavorites.map((p) => p._id.toString()),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getMyFavorites,
};
