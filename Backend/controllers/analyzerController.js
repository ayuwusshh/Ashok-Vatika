const multer = require('multer');
const { processImageAndMatch } = require('../services/analyzerService');

// Configure multer to use memory storage (so we don't save files to disk unnecessarily)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image');

const analyzeProduct = (req, res, next) => {
  // Use multer middleware inside the controller to handle errors gracefully
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    try {
      // The image buffer is stored in req.file.buffer
      const results = await processImageAndMatch(req.file.buffer);
      res.json(results);
    } catch (error) {
      next(error);
    }
  });
};

module.exports = {
  analyzeProduct
};
