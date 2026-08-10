const plantService = require('../services/plantService');

const searchPlants = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query (q) is required' });
    }

    const plants = await plantService.searchPlants(query);
    res.json(plants);
  } catch (error) {
    next(error);
  }
};

const getPlantDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Plant ID is required' });
    }

    const plant = await plantService.getPlantDetails(id);
    res.json(plant);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchPlants,
  getPlantDetails
};
