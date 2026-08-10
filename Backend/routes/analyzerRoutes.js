const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const { analyzeProduct } = require('../controllers/analyzerController');

// The route expects a multipart/form-data with a field named 'image'
// Protected: user must be logged in
router.post('/', requireAuth, analyzeProduct);

module.exports = router;
