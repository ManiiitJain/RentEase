const express = require('express');
const router = express.Router();
const { uploadImages } = require('../controllers/uploadController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Accept single 'image' or array 'images' (up to 6 files)
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 6 },
  ]),
  (req, res, next) => {
    // Flatten files to array for uploadImages controller
    let files = [];
    if (req.files) {
      if (req.files.image) files = files.concat(req.files.image);
      if (req.files.images) files = files.concat(req.files.images);
    } else if (req.file) {
      files = [req.file];
    }
    req.files = files;
    next();
  },
  uploadImages
);

module.exports = router;
