const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  waterIntake: {
    type: Number, // in liters
    min: [0, 'Water intake cannot be negative'],
    max: [10, 'Water intake seems too high']
  },
  weight: {
    type: Number, // in kg
    min: [30, 'Weight must be at least 30 kg'],
    max: [300, 'Weight must be less than 300 kg']
  },
  sleepDuration: {
    type: Number, // in hours
    min: [0, 'Sleep duration cannot be negative'],
    max: [24, 'Sleep duration cannot exceed 24 hours']
  },
  workoutDuration: {
    type: Number, // in minutes
    min: [0, 'Workout duration cannot be negative'],
    max: [480, 'Workout duration seems too long']
  },
  workoutType: String,
  caloriesConsumed: {
    type: Number,
    min: [0, 'Calories consumed cannot be negative'],
    max: [10000, 'Calories consumed seems too high']
  },
  proteinConsumed: Number,
  carbsConsumed: Number,
  fatConsumed: Number
}, {
  timestamps: true
});

// Compound index for user logs per day
HealthLogSchema.index({ userId: 1, date: 1 }, { unique: false });

module.exports = mongoose.model('HealthLog', HealthLogSchema);