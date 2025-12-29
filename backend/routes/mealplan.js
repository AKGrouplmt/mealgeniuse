const express = require('express');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Get today's meal plan for user
router.get('/today/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let mealPlan = await MealPlan.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('meals.recipeId');

    // If no meal plan exists for today, create a default one
    if (!mealPlan) {
      // Find recipes that match common preferences
      const defaultRecipes = await Recipe.aggregate([
        { $sample: { size: 4 } }
      ]);

      if (defaultRecipes.length === 4) {
        mealPlan = await MealPlan.create({
          userId,
          date: today,
          meals: [
            { mealType: 'Breakfast', recipeId: defaultRecipes[0]._id },
            { mealType: 'Lunch', recipeId: defaultRecipes[1]._id },
            { mealType: 'Dinner', recipeId: defaultRecipes[2]._id },
            { mealType: 'Snack', recipeId: defaultRecipes[3]._id }
          ]
        });
        
        mealPlan = await MealPlan.findById(mealPlan._id).populate('meals.recipeId');
      }
    }

    res.json(mealPlan || { meals: [] });
  } catch (error) {
    console.error('Error getting meal plan:', error);
    res.status(500).json({ message: error.message });
  }
});

// Generate new meal plan
router.post('/generate', async (req, res) => {
  try {
    const { userId, dietaryPreferences, goal } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build query based on preferences
    let query = {};
    if (dietaryPreferences && dietaryPreferences.length > 0) {
      query.dietaryTags = { $in: dietaryPreferences };
    }

    // Get recipes for each meal type
    const breakfastRecipes = await Recipe.find({ ...query, mealType: 'Breakfast' }).limit(5);
    const lunchRecipes = await Recipe.find({ ...query, mealType: 'Lunch' }).limit(5);
    const dinnerRecipes = await Recipe.find({ ...query, mealType: 'Dinner' }).limit(5);
    const snackRecipes = await Recipe.find({ ...query, mealType: 'Snack' }).limit(5);

    // Select random recipes for each meal type
    const getRandomRecipe = (recipes) => recipes[Math.floor(Math.random() * recipes.length)];

    const meals = [];
    if (breakfastRecipes.length > 0) {
      meals.push({ mealType: 'Breakfast', recipeId: getRandomRecipe(breakfastRecipes)._id });
    }
    if (lunchRecipes.length > 0) {
      meals.push({ mealType: 'Lunch', recipeId: getRandomRecipe(lunchRecipes)._id });
    }
    if (dinnerRecipes.length > 0) {
      meals.push({ mealType: 'Dinner', recipeId: getRandomRecipe(dinnerRecipes)._id });
    }
    if (snackRecipes.length > 0) {
      meals.push({ mealType: 'Snack', recipeId: getRandomRecipe(snackRecipes)._id });
    }

    // Create or update meal plan
    const mealPlan = await MealPlan.findOneAndUpdate(
      {
        userId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      {
        userId,
        date: today,
        meals
      },
      { upsert: true, new: true }
    ).populate('meals.recipeId');

    res.json(mealPlan);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update meal consumption status
router.put('/meal/:mealPlanId/:mealIndex', async (req, res) => {
  try {
    const { mealPlanId, mealIndex } = req.params;
    const { consumed } = req.body;

    const mealPlan = await MealPlan.findById(mealPlanId);
    if (mealPlan && mealPlan.meals[mealIndex]) {
      mealPlan.meals[mealIndex].consumed = consumed;
      if (consumed) {
        mealPlan.meals[mealIndex].consumedAt = new Date();
      } else {
        mealPlan.meals[mealIndex].consumedAt = null;
      }

      const updatedMealPlan = await mealPlan.save();
      res.json(updatedMealPlan);
    } else {
      res.status(404).json({ message: 'Meal plan or meal not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;