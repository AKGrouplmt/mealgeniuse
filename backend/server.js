const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running perfectly!',
    timestamp: new Date().toISOString()
  });
});

// Mock recipe generation endpoint
app.post('/api/recipes/generate-from-name', (req, res) => {
  const { recipeName, dietaryPreferences, servings } = req.body;
  
  console.log('📝 Generating recipe for:', recipeName);
  
  // Simulate AI processing
  setTimeout(() => {
    const mockRecipe = {
  success: true,
  recipe: {
    _id: 'ai-' + Date.now(),
    name: `AI Generated: ${recipeName}`,
    description: `A delicious and healthy ${recipeName} created with artificial intelligence.`,
    ingredients: [
      { name: 'Main ingredient', quantity: '200', unit: 'g' },
      { name: 'Vegetables', quantity: '1', unit: 'cup' },
      { name: 'Spices', quantity: 'to taste', unit: '' }
    ],
    instructions: [
      'Prepare all ingredients.',
      'Cook gently with spices.',
      'Serve hot and fresh.'
    ],
    prepTime: 10,
    cookTime: 20,
    servings: servings || 2,
    calories: 350,
    protein: 25,
    carbs: 45,
    fat: 12,
    dietaryTags: dietaryPreferences?.length ? dietaryPreferences : ['Vegetarian'],
    cuisine: 'Other',
    mealType: 'Dinner',
    aiGenerated: true,
    createdAt: new Date().toISOString()
  }
};

    
    res.json(mockRecipe);
  }, 1500);
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working perfectly!',
    endpoints: [
      'GET /api/health',
      'POST /api/recipes/generate-from-name',
      'GET /api/test'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🎉 ==================================');
  console.log('🚀 BACKEND SERVER STARTED SUCCESSFULLY');
  console.log('📍 Port:', PORT);
  console.log('📡 Health Check:', `http://localhost:${PORT}/api/health`);
  console.log('🤖 Recipe API:', `POST http://localhost:${PORT}/api/recipes/generate-from-name`);
  console.log('🎉 ==================================');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down gracefully...');
  process.exit(0);
});