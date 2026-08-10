const mongoose = require('mongoose');
require('dotenv').config();

const Ingredient = require('../models/Ingredient');

const runMigration = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    console.log('Fetching all ingredients...');
    const ingredients = await Ingredient.find({});
    console.log(`Found ${ingredients.length} ingredients.`);
    
    let updatedCount = 0;

    for (let ing of ingredients) {
      if (ing.ingredient_name && ing.ingredient_name !== ing.ingredient_name.toLowerCase()) {
        ing.ingredient_name = ing.ingredient_name.toLowerCase();
        await ing.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} ingredients to lowercase.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
