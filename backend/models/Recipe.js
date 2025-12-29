const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a recipe name'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  ingredients: [IngredientSchema],
  instructions: [{
    type: String,
    required: true
  }],
  prepTime: {
    type: Number,
    required: true
  },
  cookTime: {
    type: Number,
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  dietaryTags: {
    type: [String],
    enum: [
      'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 
      'Low-Carb', 'High-Protein', 'Low-Fat', 'Low-Calorie', 'Sugar-Free',
      'Nut-Free', 'Egg-Free', 'Soy-Free', 'Heart-Healthy', 'Diabetic-Friendly',
      'Anti-Inflammatory', 'Mediterranean', 'DASH', 'Whole30', 'Pescatarian', 'Low-Sugar', 'High-Fat'
    ],
    default: []
  },
  cuisine: {
    type: String,
    enum: [
      'Indian', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American',
      'Thai', 'Chinese', 'Japanese', 'Korean', 'French', 'Middle Eastern',
      'Greek', 'Spanish', 'Vietnamese', 'Lebanese', 'Turkish', 'Other',
    ],
    default: 'Other'
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Drink'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  image: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  originalRequest: String,
  tags: [String]
}, {
  timestamps: true
});

// Text index for search
RecipeSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text',
  dietaryTags: 'text'
});

module.exports = mongoose.model('Recipe', RecipeSchema);