const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    required: true
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  consumed: {
    type: Boolean,
    default: false
  },
  consumedAt: Date
});

const MealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meals: [MealSchema]
}, {
  timestamps: true
});

// Compound index to ensure one meal plan per user per day
MealPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MealPlan', MealPlanSchema);