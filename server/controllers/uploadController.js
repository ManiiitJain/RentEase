const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Upload single or multiple images
// @route   POST /api/upload
// @access  Private
const uploadImages = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one image file to upload.',
      });
    }

    const uploadedUrls = [];

    // Check if Cloudinary is configured
    const isCloudinaryActive = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    for (const file of files) {
      if (isCloudinaryActive) {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'rentease/properties',
          resource_type: 'image',
        });
        uploadedUrls.push(result.secure_url);
        // Clean up temporary local file after Cloudinary upload
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } else {
        // Serve locally via Express static
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;
        uploadedUrls.push(fileUrl);
      }
    }

    res.json({
      success: true,
      message: 'Image(s) uploaded successfully.',
      urls: uploadedUrls,
      url: uploadedUrls[0], // Convenience for single image upload
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImages };
