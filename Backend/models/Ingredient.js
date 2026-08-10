const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  ingredient_name: { type: String, required: true , index: true },
  rating: { type: String, enum: ['BEST', 'GOOD', 'AVERAGE', 'BAD', 'WORST'], required: true },
  functions: { type: String } 
});

// Since the user used 'ingredients' (lower case) for the collection name
const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
