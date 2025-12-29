const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
require('dotenv').config();

const dietRecipes = [
  {
    name: "Oats Upma",
    description: "A healthy South Indian twist on traditional upma made with oats and veggies.",
    ingredients: [
      { name: "Rolled oats", quantity: "1", unit: "cup" },
      { name: "Mixed vegetables", quantity: "1", unit: "cup" },
      { name: "Mustard seeds", quantity: "1", unit: "tsp" },
      { name: "Curry leaves", quantity: "5", unit: "leaves" },
      { name: "Olive oil", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      "Roast oats till light brown.",
      "Sauté mustard seeds, curry leaves, and veggies.",
      "Add water and bring to a boil.",
      "Add roasted oats, cook till soft.",
      "Serve hot with lemon juice."
    ],
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    calories: 280,
    protein: 9,
    carbs: 42,
    fat: 7,
    dietaryTags: ["Vegetarian", "Low-Fat"],
    cuisine: "Indian",
    mealType: "Breakfast",
    difficulty: "Easy"
  },

  {
    name: "Sprout Salad",
    description: "A crunchy, protein-rich salad with sprouts, tomato, and cucumber.",
    ingredients: [
      { name: "Mixed sprouts", quantity: "1", unit: "cup" },
      { name: "Tomato", quantity: "1", unit: "small" },
      { name: "Cucumber", quantity: "1", unit: "small" },
      { name: "Lemon juice", quantity: "1", unit: "tbsp" },
      { name: "Chaat masala", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Mix sprouts, tomato, and cucumber.",
      "Add lemon juice and chaat masala.",
      "Toss well and serve fresh."
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    calories: 180,
    protein: 11,
    carbs: 25,
    fat: 3,
    dietaryTags: ["Vegan", "High-Protein"],
    cuisine: "Indian",
    mealType: "Snack",
    difficulty: "Easy"
  },

  {
    name: "Grilled Paneer Tikka",
    description: "Low-oil version of the classic paneer tikka with yogurt marinade.",
    ingredients: [
      { name: "Paneer cubes", quantity: "200", unit: "g" },
      { name: "Greek yogurt", quantity: "2", unit: "tbsp" },
      { name: "Spices", quantity: "1", unit: "tsp" },
      { name: "Bell peppers", quantity: "1", unit: "cup" },
      { name: "Olive oil spray", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Mix yogurt and spices to marinate paneer.",
      "Thread onto skewers with veggies.",
      "Grill or bake until lightly charred.",
      "Serve hot with mint chutney."
    ],
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    calories: 290,
    protein: 21,
    carbs: 10,
    fat: 18,
    dietaryTags: ["Vegetarian", "High-Protein"],
    cuisine: "Indian",
    mealType: "Dinner",
    difficulty: "Medium"
  },

  {
    name: "Moong Dal Chilla",
    description: "Savory Indian pancakes made with moong dal, ideal for a protein-packed breakfast.",
    ingredients: [
      { name: "Moong dal", quantity: "1", unit: "cup" },
      { name: "Ginger", quantity: "1", unit: "tsp" },
      { name: "Chili", quantity: "1", unit: "small" },
      { name: "Onion", quantity: "1", unit: "small" },
      { name: "Olive oil", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Soak and blend moong dal with ginger and chili.",
      "Mix in chopped onion.",
      "Cook on non-stick pan with little oil.",
      "Serve with mint chutney."
    ],
    prepTime: 20,
    cookTime: 10,
    servings: 2,
    calories: 240,
    protein: 14,
    carbs: 30,
    fat: 6,
    dietaryTags: ["Vegan", "Gluten-Free"],
    cuisine: "Indian",
    mealType: "Breakfast",
    difficulty: "Easy"
  },

  {
    name: "Grilled Chicken Salad",
    description: "Lean grilled chicken with greens, olive oil, and herbs.",
    ingredients: [
      { name: "Chicken breast", quantity: "150", unit: "g" },
      { name: "Mixed greens", quantity: "2", unit: "cups" },
      { name: "Olive oil", quantity: "1", unit: "tbsp" },
      { name: "Lemon juice", quantity: "1", unit: "tbsp" },
      { name: "Salt and pepper", quantity: "to", unit: "taste" }
    ],
    instructions: [
      "Grill chicken till tender.",
      "Slice and add to greens.",
      "Drizzle olive oil and lemon juice.",
      "Serve fresh."
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    calories: 260,
    protein: 32,
    carbs: 5,
    fat: 11,
    dietaryTags: ["High-Protein", "Low-Carb"],
    cuisine: "American",
    mealType: "Lunch",
    difficulty: "Easy"
  },

  {
    name: "Vegetable Khichdi",
    description: "Wholesome one-pot meal made with rice, dal, and vegetables.",
    ingredients: [
      { name: "Rice", quantity: "1/2", unit: "cup" },
      { name: "Moong dal", quantity: "1/2", unit: "cup" },
      { name: "Vegetables", quantity: "1", unit: "cup" },
      { name: "Turmeric", quantity: "1/2", unit: "tsp" },
      { name: "Ghee", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Rinse rice and dal together.",
      "Cook with veggies, turmeric, and salt.",
      "Add ghee before serving."
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 310,
    protein: 13,
    carbs: 48,
    fat: 7,
    dietaryTags: ["Vegetarian", "Gluten-Free"],
    cuisine: "Indian",
    mealType: "Lunch",
    difficulty: "Easy"
  },

  {
    name: "Lentil Soup",
    description: "A hearty, fiber-rich soup with red lentils and vegetables.",
    ingredients: [
      { name: "Red lentils", quantity: "1/2", unit: "cup" },
      { name: "Carrot", quantity: "1", unit: "small" },
      { name: "Celery", quantity: "1", unit: "stick" },
      { name: "Olive oil", quantity: "1", unit: "tsp" },
      { name: "Garlic", quantity: "2", unit: "cloves" }
    ],
    instructions: [
      "Sauté garlic, carrot, and celery.",
      "Add lentils and water, simmer till soft.",
      "Blend and serve warm."
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 2,
    calories: 220,
    protein: 14,
    carbs: 30,
    fat: 4,
    dietaryTags: ["Vegan", "High-Protein"],
    cuisine: "Mediterranean",
    mealType: "Dinner",
    difficulty: "Easy"
  },

  {
    name: "Brown Rice Pulao",
    description: "Nutritious pulao made with brown rice and vegetables.",
    ingredients: [
      { name: "Brown rice", quantity: "1", unit: "cup" },
      { name: "Mixed vegetables", quantity: "1", unit: "cup" },
      { name: "Cumin seeds", quantity: "1", unit: "tsp" },
      { name: "Olive oil", quantity: "1", unit: "tbsp" },
      { name: "Salt", quantity: "to", unit: "taste" }
    ],
    instructions: [
      "Cook rice separately.",
      "Sauté cumin and veggies, add rice.",
      "Mix well and serve."
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 2,
    calories: 300,
    protein: 8,
    carbs: 58,
    fat: 6,
    dietaryTags: ["Vegan", "High-Protein"],
    cuisine: "Indian",
    mealType: "Lunch",
    difficulty: "Easy"
  },

  {
    name: "Avocado Toast with Egg",
    description: "Protein-packed breakfast toast with avocado and boiled egg.",
    ingredients: [
      { name: "Whole grain bread", quantity: "2", unit: "slices" },
      { name: "Avocado", quantity: "1/2", unit: "fruit" },
      { name: "Egg", quantity: "1", unit: "large" },
      { name: "Lemon juice", quantity: "1", unit: "tsp" },
      { name: "Salt and pepper", quantity: "to", unit: "taste" }
    ],
    instructions: [
      "Toast bread, spread mashed avocado.",
      "Top with sliced boiled egg and season."
    ],
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    calories: 250,
    protein: 11,
    carbs: 22,
    fat: 13,
    dietaryTags: ["High-Protein", "Low-Sugar"],
    cuisine: "Italian",
    mealType: "Breakfast",
    difficulty: "Easy"
  },

  {
    name: "Quinoa Vegetable Stir-Fry",
    description: "Protein-packed quinoa with fresh seasonal vegetables in light soy sauce",
    ingredients: [
      { name: "Quinoa", quantity: "1", unit: "cup" },
      { name: "Mixed vegetables", quantity: "2", unit: "cups" },
      { name: "Soy sauce", quantity: "2", unit: "tbsp" },
      { name: "Garlic", quantity: "3", unit: "cloves" },
      { name: "Olive oil", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      "Cook quinoa according to package instructions",
      "Heat oil in a wok, add minced garlic",
      "Add vegetables and stir-fry for 5-7 minutes",
      "Add cooked quinoa and soy sauce",
      "Mix well and serve hot"
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 320,
    protein: 12,
    carbs: 55,
    fat: 8,
    dietaryTags: ["Vegetarian", "High-Protein"],
    cuisine: "Asian",
    mealType: "Dinner",
    difficulty: "Easy"
  },
  {
    name: "Spinach and Feta Stuffed Chicken",
    description: "Juicy chicken breast stuffed with spinach and feta cheese",
    ingredients: [
      { name: "Chicken breast", quantity: "2", unit: "large" },
      { name: "Spinach", quantity: "2", unit: "cups" },
      { name: "Feta cheese", quantity: "1/2", unit: "cup" },
      { name: "Garlic", quantity: "2", unit: "cloves" },
      { name: "Olive oil", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Butterfly chicken breasts",
      "Mix spinach, feta, and garlic",
      "Stuff mixture into chicken",
      "Bake for 25-30 minutes"
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    calories: 280,
    protein: 35,
    carbs: 4,
    fat: 12,
    dietaryTags: ["High-Protein", "Low-Carb"],
    cuisine: "Mediterranean",
    mealType: "Dinner",
    difficulty: "Medium"
  },
  {
    name: "Greek Yogurt Parfait",
    description: "Layers of Greek yogurt, berries, and granola",
    ingredients: [
      { name: "Greek yogurt", quantity: "1", unit: "cup" },
      { name: "Mixed berries", quantity: "1/2", unit: "cup" },
      { name: "Granola", quantity: "1/4", unit: "cup" },
      { name: "Honey", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Layer yogurt in a glass",
      "Add layer of berries",
      "Sprinkle granola",
      "Drizzle honey",
      "Repeat layers"
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    calories: 220,
    protein: 18,
    carbs: 25,
    fat: 6,
    dietaryTags: ["Vegetarian", "High-Protein"],
    cuisine: "American",
    mealType: "Breakfast",
    difficulty: "Easy"
  },
  
  {
    name: "Keto Paneer Bhurji",
    description: "Scrambled paneer cooked with ghee, spices, and bell peppers — high-protein and low-carb.",
    ingredients: [
      { name: "Paneer", quantity: "200", unit: "g" },
      { name: "Ghee", quantity: "1", unit: "tbsp" },
      { name: "Bell pepper", quantity: "1/2", unit: "cup" },
      { name: "Onion", quantity: "1/4", unit: "cup" },
      { name: "Turmeric and chili powder", quantity: "1/2", unit: "tsp each" }
    ],
    instructions: [
      "Heat ghee, sauté onion and pepper.",
      "Add crumbled paneer and spices.",
      "Cook for 5 minutes and serve hot."
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    calories: 320,
    protein: 20,
    carbs: 6,
    fat: 24,
    dietaryTags: ["Keto", "Vegetarian", "Gluten-Free"],
    cuisine: "Indian",
    mealType: "Breakfast",
    difficulty: "Easy"
  },
  {
    name: "Butter Chicken (Keto Style)",
    description: "Creamy, rich butter chicken without added sugar or flour.",
    ingredients: [
      { name: "Chicken breast", quantity: "200", unit: "g" },
      { name: "Butter", quantity: "2", unit: "tbsp" },
      { name: "Cream", quantity: "3", unit: "tbsp" },
      { name: "Tomato puree", quantity: "1/4", unit: "cup" },
      { name: "Spices", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Cook chicken in butter and spices.",
      "Add tomato puree and cream.",
      "Simmer until thick and creamy."
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 420,
    protein: 36,
    carbs: 8,
    fat: 28,
    dietaryTags: ["Keto", "High-Fat"],
    cuisine: "Indian",
    mealType: "Dinner",
    difficulty: "Medium"
  },
  {
    name: "Keto Egg Muffins",
    description: "Mini baked egg cups with cheese and spinach for an easy breakfast.",
    ingredients: [
      { name: "Eggs", quantity: "4", unit: "large" },
      { name: "Spinach", quantity: "1/2", unit: "cup" },
      { name: "Cheddar cheese", quantity: "1/4", unit: "cup" },
      { name: "Butter", quantity: "1", unit: "tsp" },
      { name: "Salt & pepper", quantity: "to", unit: "taste" }
    ],
    instructions: [
      "Whisk eggs with cheese and spinach.",
      "Pour into muffin molds.",
      "Bake at 180°C for 15 minutes."
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    calories: 260,
    protein: 18,
    carbs: 3,
    fat: 20,
    dietaryTags: ["Keto", "High-Protein"],
    cuisine: "Mexican",
    mealType: "Breakfast",
    difficulty: "Easy"
  },
  {
    name: "Zucchini Noodles with Pesto",
    description: "Fresh zucchini noodles tossed with creamy basil pesto and parmesan.",
    ingredients: [
      { name: "Zucchini", quantity: "1", unit: "medium" },
      { name: "Basil pesto", quantity: "2", unit: "tbsp" },
      { name: "Parmesan", quantity: "1", unit: "tbsp" },
      { name: "Olive oil", quantity: "1", unit: "tsp" },
      { name: "Salt", quantity: "to", unit: "taste" }
    ],
    instructions: [
      "Spiralize zucchini into noodles.",
      "Toss with pesto and parmesan.",
      "Serve warm or chilled."
    ],
    prepTime: 10,
    cookTime: 10,
    servings: 1,
    calories: 210,
    protein: 9,
    carbs: 5,
    fat: 17,
    dietaryTags: ["Keto", "Vegetarian"],
    cuisine: "Japanese",
    mealType: "Lunch",
    difficulty: "Easy"
  },
  {
    name: "Keto Coconut Chia Pudding",
    description: "Creamy chia pudding with coconut milk and stevia for a guilt-free dessert.",
    ingredients: [
      { name: "Chia seeds", quantity: "2", unit: "tbsp" },
      { name: "Coconut milk", quantity: "1/2", unit: "cup" },
      { name: "Stevia", quantity: "1/4", unit: "tsp" },
      { name: "Vanilla extract", quantity: "1/4", unit: "tsp" },
      { name: "Unsweetened coconut flakes", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      "Mix all ingredients in a bowl.",
      "Refrigerate overnight.",
      "Top with coconut flakes before serving."
    ],
    prepTime: 5,
    cookTime: 20,
    servings: 1,
    calories: 190,
    protein: 5,
    carbs: 4,
    fat: 16,
    dietaryTags: ["Keto", "Vegan"],
    cuisine: "Korean",
    mealType: "Dessert",
    difficulty: "Easy"
  },
  {
    name: "Cauliflower Rice Pulao",
    description: "Low-carb Indian-style pulao made with grated cauliflower instead of rice.",
    ingredients: [
      { name: "Cauliflower", quantity: "1", unit: "cup" },
      { name: "Ghee", quantity: "1", unit: "tbsp" },
      { name: "Spices", quantity: "1", unit: "tsp" },
      { name: "Vegetables", quantity: "1/2", unit: "cup" },
      { name: "Salt", quantity: "to", unit: "taste" }
    ],
    instructions: [
      "Grate cauliflower finely.",
      "Sauté in ghee with spices and veggies.",
      "Cook for 5 minutes and serve."
    ],
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    calories: 180,
    protein: 7,
    carbs: 8,
    fat: 14,
    dietaryTags: ["Keto", "Vegetarian"],
    cuisine: "Indian",
    mealType: "Lunch",
    difficulty: "Easy"
  },
  {
    name: "Keto Chicken Curry",
    description: "Creamy coconut-based chicken curry without added starches.",
    ingredients: [
      { name: "Chicken", quantity: "250", unit: "g" },
      { name: "Coconut milk", quantity: "1/2", unit: "cup" },
      { name: "Curry powder", quantity: "1", unit: "tsp" },
      { name: "Olive oil", quantity: "1", unit: "tbsp" },
      { name: "Garlic", quantity: "2", unit: "cloves" }
    ],
    instructions: [
      "Cook garlic and spices in oil.",
      "Add chicken and brown lightly.",
      "Pour coconut milk, simmer till cooked."
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 350,
    protein: 33,
    carbs: 5,
    fat: 22,
    dietaryTags: ["Keto", "High-Protein"],
    cuisine: "Indian",
    mealType: "Dinner",
    difficulty: "Medium"
  },
  {
    name: "Keto Eggplant Pizza",
    description: "Low-carb pizza using eggplant slices as the base.",
    ingredients: [
      { name: "Eggplant", quantity: "1", unit: "medium" },
      { name: "Mozzarella", quantity: "1/2", unit: "cup" },
      { name: "Tomato sauce", quantity: "2", unit: "tbsp" },
      { name: "Olive oil", quantity: "1", unit: "tsp" },
      { name: "Oregano", quantity: "1/2", unit: "tsp" }
    ],
    instructions: [
      "Slice eggplant into rounds, brush with oil.",
      "Bake for 10 minutes, top with sauce and cheese.",
      "Bake again till cheese melts."
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    calories: 240,
    protein: 14,
    carbs: 7,
    fat: 17,
    dietaryTags: ["Keto", "Vegetarian"],
    cuisine: "Mexican",
    mealType: "Snack",
    difficulty: "Easy"
  },
  {
    name: "Avocado Smoothie",
    description: "Thick, creamy smoothie made with avocado, almond milk, and chia seeds.",
    ingredients: [
      { name: "Avocado", quantity: "1/2", unit: "fruit" },
      { name: "Unsweetened almond milk", quantity: "1", unit: "cup" },
      { name: "Chia seeds", quantity: "1", unit: "tbsp" },
      { name: "Stevia", quantity: "1/4", unit: "tsp" },
      { name: "Ice cubes", quantity: "3", unit: "pieces" }
    ],
    instructions: [
      "Blend all ingredients until smooth.",
      "Serve chilled."
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    calories: 220,
    protein: 6,
    carbs: 5,
    fat: 18,
    dietaryTags: ["Keto", "Vegan"],
    cuisine: "Turkish",
    mealType: "Drink",
    difficulty: "Easy"
  },
  {
    name: "Keto Masala Omelette",
    description: "Indian-style omelette made with eggs, cheese, and spices — keto classic.",
    ingredients: [
      { name: "Eggs", quantity: "2", unit: "large" },
      { name: "Cheese", quantity: "2", unit: "tbsp" },
      { name: "Onion", quantity: "2", unit: "tbsp" },
      { name: "Green chili", quantity: "1", unit: "small" },
      { name: "Butter", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Beat eggs with onion, chili, and cheese.",
      "Cook on buttered pan till golden.",
      "Fold and serve."
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    calories: 250,
    protein: 14,
    carbs: 2,
    fat: 21,
    dietaryTags: ["Keto", "High-Fat"],
    cuisine: "Indian",
    mealType: "Breakfast",
    difficulty: "Easy"
  },
  {
    name: "Keto Avocado Egg Bowl",
    description: "Creamy avocado with baked eggs and cheese",
    ingredients: [
      { name: "Avocado", quantity: "1", unit: "large" },
      { name: "Eggs", quantity: "2", unit: "large" },
      { name: "Cheddar cheese", quantity: "1/4", unit: "cup" },
      { name: "Bacon bits", quantity: "2", unit: "tbsp" }
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Cut avocado in half, remove pit",
      "Scoop out some flesh to make room for eggs",
      "Crack egg into each avocado half",
      "Top with cheese and bacon",
      "Bake for 15 minutes"
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    calories: 350,
    protein: 20,
    carbs: 8,
    fat: 28,
    dietaryTags: ["Keto", "Low-Carb", "High-Protein"],
    cuisine: "American",
    mealType: "Breakfast",
    difficulty: "Easy"
  },
  {
    name: "Keto Cauliflower Mac and Cheese",
    description: "Creamy cheese sauce over roasted cauliflower",
    ingredients: [
      { name: "Cauliflower", quantity: "1", unit: "head" },
      { name: "Cheddar cheese", quantity: "1", unit: "cup" },
      { name: "Heavy cream", quantity: "1/2", unit: "cup" },
      { name: "Cream cheese", quantity: "2", unit: "tbsp" }
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Cut cauliflower into florets",
      "Roast for 20 minutes",
      "Make cheese sauce with remaining ingredients",
      "Combine and bake for 15 minutes"
    ],
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    calories: 280,
    protein: 15,
    carbs: 8,
    fat: 22,
    dietaryTags: ["Keto", "Low-Carb", "Vegetarian"],
    cuisine: "American",
    mealType: "Dinner",
    difficulty: "Easy"
  },
  {
    name: "Vegan Buddha Bowl",
    description: "Colorful bowl with quinoa, roasted veggies, and tahini dressing",
    ingredients: [
      { name: "Quinoa", quantity: "1", unit: "cup" },
      { name: "Sweet potato", quantity: "1", unit: "large" },
      { name: "Chickpeas", quantity: "1", unit: "can" },
      { name: "Avocado", quantity: "1", unit: "sliced" },
      { name: "Tahini", quantity: "2", unit: "tbsp" }
    ],
    instructions: [
      "Cook quinoa",
      "Roast sweet potato cubes",
      "Mix tahini with water for dressing",
      "Assemble all ingredients in bowl",
      "Drizzle with tahini dressing"
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    calories: 420,
    protein: 15,
    carbs: 65,
    fat: 18,
    dietaryTags: ["Vegan", "Gluten-Free", "High-Protein"],
    cuisine: "Mediterranean",
    mealType: "Lunch",
    difficulty: "Easy"
  },


  {
    name: "Zucchini Noodles with Turkey Meatballs",
    description: "Light zucchini noodles with lean turkey meatballs in marinara",
    ingredients: [
      { name: "Zucchini", quantity: "3", unit: "medium" },
      { name: "Ground turkey", quantity: "1", unit: "lb" },
      { name: "Marinara sauce", quantity: "1", unit: "cup" },
      { name: "Egg", quantity: "1", unit: "tbsp" },
    ],
    instructions: [
      "Spiralize zucchini into noodles",
      "Mix turkey with egg and seasonings",
      "Form meatballs and bake at 400°F for 20 minutes",
      "Heat marinara sauce",
      "Combine zucchini noodles with sauce and meatballs"
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    calories: 280,
    protein: 25,
    carbs: 12,
    fat: 8,
    dietaryTags: ["Low-Calorie", "Low-Carb", "High-Protein"],
    cuisine: "Italian",
    mealType: "Dinner",
    difficulty: "Medium"
  },


  {
    name: "Protein Power Smoothie",
    description: "Ultimate protein-packed smoothie for muscle recovery",
    ingredients: [
      { name: "Protein powder", quantity: "1", unit: "scoop" },
      { name: "Greek yogurt", quantity: "1/2", unit: "cup" },
      { name: "Banana", quantity: "1", unit: "sliced" },
      { name: "Almond milk", quantity: "1", unit: "cup" },
      { name: "Peanut butter", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      "Add all ingredients to blender",
      "Blend until smooth",
      "Serve immediately"
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    calories: 320,
    protein: 35,
    carbs: 25,
    fat: 8,
    dietaryTags: ["High-Protein", "Vegetarian"],
    cuisine: "American",
    mealType: "Snack",
    difficulty: "Easy"
  },

  
  {
    name: "Gluten-Free Banana Bread",
    description: "Moist and delicious banana bread without gluten",
    ingredients: [
      { name: "Almond flour", quantity: "2", unit: "cups" },
      { name: "Bananas", quantity: "3", unit: "ripe" },
      { name: "Eggs", quantity: "3", unit: "large" },
      { name: "Honey", quantity: "1/4", unit: "cup" }
    ],
    instructions: [
      "Preheat oven to 350°F",
      "Mash bananas",
      "Mix all ingredients",
      "Bake for 45-50 minutes",
      "Cool before slicing"
    ],
    prepTime: 10,
    cookTime: 50,
    servings: 8,
    calories: 180,
    protein: 6,
    carbs: 20,
    fat: 10,
    dietaryTags: ["Gluten-Free", "Vegetarian"],
    cuisine: "American",
    mealType: "Snack",
    difficulty: "Easy"
  },

  {
    name: "Baked Salmon with Asparagus",
    description: "Healthy salmon fillet with roasted asparagus",
    ingredients: [
      { name: "Salmon fillet", quantity: "2", unit: "pieces" },
      { name: "Asparagus", quantity: "1", unit: "bunch" },
      { name: "Lemon", quantity: "1", unit: "tbsp" },
      { name: "Olive oil", quantity: "2", unit: "tbsp" }
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Season salmon and asparagus",
      "Arrange on baking sheet",
      "Bake for 12-15 minutes",
      "Serve with lemon wedges"
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    calories: 320,
    protein: 35,
    carbs: 8,
    fat: 18,
    dietaryTags: ["Pescatarian", "High-Protein", "Low-Carb"],
    cuisine: "Mediterranean",
    mealType: "Dinner",
    difficulty: "Easy"
  },

  
  {
    name: "Green Detox Smoothie",
    description: "Cleansing smoothie with greens and fruits",
    ingredients: [
      { name: "Spinach", quantity: "2", unit: "cups" },
      { name: "Green apple", quantity: "1", unit: "sliced" },
      { name: "Cucumber", quantity: "1/2", unit: "sliced" },
      { name: "Lemon juice", quantity: "1", unit: "tbsp" },
      { name: "Water", quantity: "1", unit: "cup" }
    ],
    instructions: [
      "Add all ingredients to blender",
      "Blend until smooth",
      "Serve immediately"
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    calories: 120,
    protein: 3,
    carbs: 28,
    fat: 20,
    dietaryTags: ["Vegan", "Gluten-Free", "Low-Calorie"],
    cuisine: "American",
    mealType: "Beverage",
    difficulty: "Easy"
  },

  {
    name: "Chocolate Avocado Mousse",
    description: "Rich chocolate mousse made with avocado",
    ingredients: [
      { name: "Avocado", quantity: "2", unit: "ripe" },
      { name: "Cocoa powder", quantity: "1/4", unit: "cup" },
      { name: "Maple syrup", quantity: "3", unit: "tbsp" },
      { name: "Vanilla extract", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Scoop avocado flesh into blender",
      "Add all other ingredients",
      "Blend until smooth and creamy",
      "Chill for 1 hour before serving"
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    calories: 180,
    protein: 3,
    carbs: 20,
    fat: 12,
    dietaryTags: ["Vegan", "Gluten-Free", "Dairy-Free"],
    cuisine: "American",
    mealType: "Dessert",
    difficulty: "Easy"
  }
];

const seedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Insert new recipes
    await Recipe.insertMany(dietRecipes);
    console.log(`✅ Successfully seeded ${dietRecipes.length} diet recipes!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding recipes:', error);
    process.exit(1);
  }
};

seedRecipes();