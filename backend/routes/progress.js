const express = require('express');
const HealthLog = require('../models/HealthLog');
const User = require('../models/User');
const router = express.Router();

// Get user's daily progress
router.get('/daily/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's health log
    const healthLog = await HealthLog.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Get user goals
    const user = await User.findById(userId);
    
    const progress = {
      calories: {
        consumed: healthLog?.caloriesConsumed || 0,
        goal: user?.dailyCalories || 2000
      },
      protein: {
        consumed: healthLog?.proteinConsumed || 0,
        goal: user?.dailyProtein || 50
      },
      carbs: {
        consumed: healthLog?.carbsConsumed || 0,
        goal: user?.dailyCarbs || 250
      },
      fat: {
        consumed: healthLog?.fatConsumed || 0,
        goal: user?.dailyFat || 70
      },
      water: {
        consumed: healthLog?.waterIntake || 0,
        goal: 2.5 // Default water goal
      },
      weight: healthLog?.weight || user?.weight,
      sleep: healthLog?.sleepDuration || 0
    };

    res.json({
      success: true,
      progress: progress,
      user: {
        name: user?.name,
        goal: user?.goal
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Update daily progress
router.post('/log', async (req, res) => {
  try {
    const { userId, type, value } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updateField = {};
    switch (type) {
      case 'calories':
        updateField.caloriesConsumed = value;
        break;
      case 'protein':
        updateField.proteinConsumed = value;
        break;
      case 'carbs':
        updateField.carbsConsumed = value;
        break;
      case 'fat':
        updateField.fatConsumed = value;
        break;
      case 'water':
        updateField.waterIntake = value;
        break;
      case 'weight':
        updateField.weight = value;
        break;
      case 'sleep':
        updateField.sleepDuration = value;
        break;
    }

    const healthLog = await HealthLog.findOneAndUpdate(
      { userId, date: today },
      { ...updateField, userId, date: today },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      healthLog: healthLog
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Update user goals
router.put('/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { dailyCalories, dailyProtein, dailyCarbs, dailyFat, goal } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        dailyCalories, 
        dailyProtein, 
        dailyCarbs, 
        dailyFat,
        goal 
      },
      { new: true }
    );

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;