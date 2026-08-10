const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Medicinal', 'Shrub'
  description: { type: String, required: true },
  thumbnailUrl: { type: String },
  sections: [
    {
      title: { type: String, required: true },
      order: { type: Number, required: true },
      content: { type: String, required: true }, // Markdown or HTML content
      quiz: {
        questions: [
          {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true }
          }
        ],
        passingScore: { type: Number, required: true, default: 1 } // Minimum correct answers
      }
    }
  ]
}, { timestamps: true });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
