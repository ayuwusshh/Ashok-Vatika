const Tour = require('../models/Tour');

const listTours = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    // Base search object
    let searchObj = {};
    if (query) {
      // Case-insensitive search on title
      searchObj.title = { $regex: query, $options: 'i' };
    }

    // Exclude sections from the list view to save bandwidth
    const tours = await Tour.find(searchObj).select('-sections');
    res.json(tours);
  } catch (error) {
    next(error);
  }
};

const getTourDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json(tour);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTours,
  getTourDetails
};
