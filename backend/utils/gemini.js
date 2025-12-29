import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Mock recipe generation for development
const generateMockRecipe = (recipeName, dietaryPreferences = [], servings = 2) => {
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const cuisines = ['Mediterranean', 'Asian', 'Mexican', 'Italian', 'American'];
  const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
  const randomMealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];

  return {
    _id: `ai-${Date.now()}`,
    name: `${randomCuisine} ${recipeName}`,
    description: `A delicious ${randomCuisine.toLowerCase()} inspired ${recipeName.toLowerCase()} that's perfect for ${randomMealType.toLowerCase()}. This healthy recipe is packed with flavor and nutrition.`,
    ingredients: [
      { name: 'Fresh protein source', quantity: '200', unit: 'g' },
      { name: 'Seasonal vegetables', quantity: '2', unit: 'cups' },
      { name: 'Whole grains', quantity: '1', unit: 'cup' },
      { name: 'Healthy fats', quantity: '1', unit: 'tbsp' },
      { name: 'Herbs and spices', quantity: '2', unit: 'tsp' },
      { name: 'Citrus or vinegar', quantity: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Prepare all ingredients by washing and chopping as needed',
      'Cook the main components using healthy methods',
      'Combine ingredients thoughtfully for maximum flavor',
      'Season with herbs, spices, and your preferred seasonings',
      'Cook until perfectly done and serve immediately'
    ],
    prepTime: Math.floor(Math.random() * 10) + 5,
    cookTime: Math.floor(Math.random() * 25) + 15,
    servings: servings,
    calories: Math.floor(Math.random() * 200) + 300,
    protein: Math.floor(Math.random() * 20) + 15,
    carbs: Math.floor(Math.random() * 30) + 20,
    fat: Math.floor(Math.random() * 10) + 5,
    dietaryTags: dietaryPreferences.length > 0 ? dietaryPreferences : ['Healthy', 'Balanced'],
    cuisine: randomCuisine,
    mealType: randomMealType,
    aiGenerated: true,
    createdAt: new Date().toISOString()
  };
};

// Real Gemini recipe generation
const generateAIRecipe = async (recipeName, dietaryPreferences = [], servings = 2) => {
  if (!genAI) {
    console.log('🤖 Using mock recipe generation (No Gemini API key)');
    return generateMockRecipe(recipeName, dietaryPreferences, servings);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Create a detailed, healthy recipe for: "${recipeName}"
      Dietary preferences: ${dietaryPreferences.join(', ') || 'None'}
      Servings: ${servings}
      
      Please provide the recipe in this exact JSON format:
      {
        "name": "Creative recipe name",
        "description": "Appetizing description",
        "ingredients": [
          {"name": "ingredient name", "quantity": "amount", "unit": "unit"}
        ],
        "instructions": ["step 1", "step 2", "step 3", "step 4", "step 5"],
        "prepTime": number,
        "cookTime": number,
        "servings": number,
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "dietaryTags": ["tag1", "tag2", "tag3"],
        "cuisine": "type of cuisine",
        "mealType": "Breakfast/Lunch/Dinner/Snack"
      }
      
      Make it healthy, delicious, easy to follow, and nutritionally balanced.
      Return ONLY the JSON, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipeText = response.text();
    
    // Clean the response and parse JSON
    const cleanJson = recipeText.replace(/```json\n?|\n?```/g, '').trim();
    const recipe = JSON.parse(cleanJson);
    
    return {
      ...recipe,
      _id: `gemini-${Date.now()}`,
      aiGenerated: true,
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.log('🤖 Falling back to mock recipe generation');
    return generateMockRecipe(recipeName, dietaryPreferences, servings);
  }
};

// Gemini Chat response
const generateChatResponse = async (message, conversationHistory = []) => {
  if (!genAI) {
    return "I'm your AI nutrition assistant! While I'm currently in demo mode, I can help you with general nutrition advice. For personalized AI responses, please add your Google Gemini API key to the environment variables.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const context = `
      You are NutritionAI, a friendly and knowledgeable nutritionist and chef. You help people with:
      - Healthy recipe suggestions
      - Meal planning advice
      - Nutritional information
      - Dietary guidance
      - Cooking tips
      
      Be encouraging, practical, and provide accurate information. Keep responses conversational but informative.
      Current conversation history: ${JSON.stringify(conversationHistory.slice(-6))}
    `;

    const prompt = `${context}\n\nUser: ${message}\n\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();

  } catch (error) {
    console.error('❌ Gemini chat error:', error);
    return "I apologize, but I'm having trouble connecting to my AI services right now. Please try again later or check your API configuration.";
  }
};

export { generateAIRecipe, generateChatResponse, generateMockRecipe };