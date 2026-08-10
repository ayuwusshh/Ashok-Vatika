const Progress = require('../models/Progress');
const Tour = require('../models/Tour');

// Get all progress for the authenticated user
const getUserProgressAll = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const progress = await Progress.find({ userId }).populate('tourId', 'title category thumbnailUrl');
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

// Get progress for a specific tour
const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { tourId } = req.params;

    const progress = await Progress.findOne({ userId, tourId });
    res.json(progress || { completedSections: [], completed: false });
  } catch (error) {
    next(error);
  }
};

// Mark a section as completed
const updateSectionProgress = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { tourId } = req.params;
    const { sectionOrder } = req.body; // The order number of the completed section

    // Get the tour to know total sections
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Upsert the progress document
    let progress = await Progress.findOne({ userId, tourId });

    if (!progress) {
      progress = new Progress({ userId, tourId, completedSections: [] });
    }

    // Add section if not already completed
    if (!progress.completedSections.includes(sectionOrder)) {
      progress.completedSections.push(sectionOrder);
    }

    // Check if all sections are completed
    const totalSections = tour.sections.length;
    if (progress.completedSections.length >= totalSections) {
      progress.completed = true;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProgressAll,
  getUserProgress,
  updateSectionProgress,
};
