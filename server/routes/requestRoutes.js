const express = require('express');
const router = express.Router();
const {
  createRentalRequest,
  getMyRequests,
  getOwnerRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('renter'), createRentalRequest);
router.get('/my', protect, authorize('renter'), getMyRequests);
router.get('/owner', protect, authorize('owner'), getOwnerRequests);
router.put('/:id', protect, authorize('owner'), updateRequestStatus);

module.exports = router;
