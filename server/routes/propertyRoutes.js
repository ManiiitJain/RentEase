const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Owner specific route (must come before /:id)
router.get('/owner/mine', protect, authorize('owner'), getMyProperties);

router.route('/')
  .get(getProperties)
  .post(protect, authorize('owner'), createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, authorize('owner'), updateProperty)
  .delete(protect, authorize('owner'), deleteProperty);

module.exports = router;
