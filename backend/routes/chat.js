const express = require('express');
const { OpenAI } = require('openai');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat with AI nutritionist
router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user context if userId is provided
    let userContext = {};
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userContext = {
          dietaryPreferences: user.dietaryPreferences,
          healthConditions: user.healthConditions,
          goal: user.goal,
          activityLevel: user.activityLevel
        };
      }
    }

    const systemPrompt = `You are MealGenius, a friendly and professional AI nutritionist. 
    Provide helpful, accurate nutrition advice and healthy meal suggestions.
    Be encouraging and supportive in your responses.
    Always consider dietary preferences and health goals when giving advice.
    
    User context: ${JSON.stringify(userContext)}
    
    Important guidelines:
    - Always provide practical, evidence-based advice
    - Suggest specific foods and recipes when appropriate
    - Consider the user's dietary preferences and restrictions
    - Be motivational and positive
    - Keep responses concise but informative
    - If suggesting a recipe, provide clear instructions
    - Never provide medical advice - always recommend consulting healthcare professionals for medical concerns`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const aiResponse = completion.choices[0].message.content;

    // Save chat message to database if userId is provided
    if (userId) {
      await ChatMessage.create({
        userId,
        message,
        response: aiResponse,
        context: userContext
      });
    }

    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ 
      message: 'Error processing chat message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get chat history for user
router.get('/history/:userId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50); // Last 50 messages

    res.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;