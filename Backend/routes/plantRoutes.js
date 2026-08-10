const express = require('express');
const router = express.Router();

const { searchPlants, getPlantDetails } = require('../controllers/plantController');

router.get('/search', searchPlants);
router.get('/:id', getPlantDetails);

module.exports = router;
