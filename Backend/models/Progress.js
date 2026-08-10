const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Clerk user ID
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  completedSections: [{ type: Number }], // Array of section order numbers completed
  completed: { type: Boolean, default: false }, // Whether the entire tour is completed
}, { timestamps: true });

// Compound index to quickly find a user's progress on a specific tour
progressSchema.index({ userId: 1, tourId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
