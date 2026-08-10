const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { getUserProgressAll, getUserProgress, updateSectionProgress } = require('../controllers/progressController');

// All progress routes require authentication
router.get('/', requireAuth, getUserProgressAll);
router.get('/:tourId', requireAuth, getUserProgress);
router.post('/:tourId/section', requireAuth, updateSectionProgress);

module.exports = router;
