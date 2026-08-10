const express = require('express');
const router = express.Router();

const { listTours, getTourDetails } = require('../controllers/tourController');

router.get('/', listTours);
router.get('/:id', getTourDetails);

module.exports = router;
