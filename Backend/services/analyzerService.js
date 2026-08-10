const Tesseract = require('tesseract.js');
const Ingredient = require('../models/Ingredient');

const processImageAndMatch = async (imageBuffer) => {
  try {
    // 1. Run OCR to extract text from the image buffer
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
      // logger: m => console.log(m) // Optional: logging progress
    });

    console.log('Extracted Text from Image:', text);

    // 2. Clean the text and extract possible ingredients
    // Many ingredient lists wrap across lines. We replace newlines with spaces, 
    // and ONLY split by commas to keep multi-word ingredients together.
    const textWithoutNewlines = text.replace(/\n/g, ' ');
    
    // Remove "Ingredients:" or "Ingredient:" prefix (case-insensitive) so it doesn't merge with the first item
    const textWithoutPrefix = textWithoutNewlines.replace(/ingredients?\s*[:\-]?\s*/i, '');
    
    const rawTokens = textWithoutPrefix.split(',').map(token => token.trim()).filter(token => token.length > 2);
    
    // Sanitize characters and collapse any weird extra spaces that Tesseract or the newline replacement caused
    const sanitizedTokens = rawTokens.map(token => 
      token.replace(/[^a-zA-Z0-9\s-]/g, '')
           .replace(/\s+/g, ' ') // Collapse multiple spaces into a single space
           .trim()
    );

    // Remove duplicates
    const uniqueTokens = [...new Set(sanitizedTokens)];

    // Convert tokens to lowercase for exact match against the lowercase database
    const lowercaseTokens = uniqueTokens.map(token => token.toLowerCase());

    // 3. Match against MongoDB using exact matches (leveraging the index)
    // Find all matching ingredients in the database
    const matchedIngredients = await Ingredient.find({
      ingredient_name: { $in: lowercaseTokens }
    });

    // 4. Categorize results
    const results = {
      best: [],
      good: [],
      average: [],
      bad: [],
      worst: [],
      unknown: []
    };

    const matchedNames = new Set();

    matchedIngredients.forEach(ingredient => {
      const category = ingredient.rating.toLowerCase();
      if (results[category]) {
        results[category].push({
          ingredient_name: ingredient.ingredient_name,
          functions: ingredient.functions
        });
      }
      matchedNames.add(ingredient.ingredient_name.toLowerCase());
    });

    // Find the tokens that didn't match anything
    uniqueTokens.forEach(token => {
      if (!matchedNames.has(token.toLowerCase())) {
        // Exclude very short noisy words like "the", "and", etc.
        if (token.length > 3) {
          results.unknown.push(token);
        }
      }
    });

    return results;

  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to analyze image');
  }
};

module.exports = {
  processImageAndMatch
};
