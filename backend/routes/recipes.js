const express = require('express');
const Recipe = require('../models/Recipe');
const { OpenAI } = require('openai');
const router = express.Router();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Search recipes by name, ingredients, or tags
router.get('/search', async (req, res) => {
  try {
    const { q, dietaryTags, mealType, cuisine, maxCalories, maxTime } = req.query;
    
    let query = {};

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Filter by dietary tags
    if (dietaryTags) {
      query.dietaryTags = { $in: dietaryTags.split(',') };
    }

    // Filter by meal type
    if (mealType) {
      query.mealType = mealType;
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = cuisine;
    }

    // Filter by max calories
    if (maxCalories) {
      query.calories = { $lte: parseInt(maxCalories) };
    }

    // Filter by max preparation time
    if (maxTime) {
      query.$expr = { 
        $lte: [ 
          { $add: ["$prepTime", "$cookTime"] }, 
          parseInt(maxTime) 
        ] 
      };
    }

    const recipes = await Recipe.find(query)
      .sort({ calories: 1 })
      .limit(50);

    res.json({
      success: true,
      count: recipes.length,
      recipes: recipes
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get recipes by dietary preference
router.get('/diet/:dietType', async (req, res) => {
  try {
    const { dietType } = req.params;
    const { limit = 20 } = req.query;

    const recipes = await Recipe.find({ 
      dietaryTags: dietType 
    })
    .sort({ calories: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      dietType: dietType,
      count: recipes.length,
      recipes: recipes
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get quick recipes (under 30 minutes total)
router.get('/quick', async (req, res) => {
  try {
    const recipes = await Recipe.find({
      $expr: { 
        $lte: [ 
          { $add: ["$prepTime", "$cookTime"] }, 
          30 
        ] 
      }
    })
    .sort({ calories: 1 })
    .limit(30);

    res.json({
      success: true,
      count: recipes.length,
      recipes: recipes
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get low-calorie recipes (under 300 calories)
router.get('/low-calorie', async (req, res) => {
  try {
    const recipes = await Recipe.find({
      calories: { $lte: 300 }
    })
    .sort({ calories: 1 })
    .limit(30);

    res.json({
      success: true,
      count: recipes.length,
      recipes: recipes
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// AI recipe generation (kept from previous)
router.post('/generate-from-name', async (req, res) => {
  // ... same AI generation code as before
});

module.exports = router;