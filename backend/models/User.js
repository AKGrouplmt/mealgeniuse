const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  age: {
    type: Number,
    required: [true, 'Please add your age'],
    min: [13, 'Age must be at least 13'],
    max: [120, 'Age must be less than 120']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  height: {
    type: Number, // in cm
    required: [true, 'Please add your height'],
    min: [100, 'Height must be at least 100 cm'],
    max: [250, 'Height must be less than 250 cm']
  },
  weight: {
    type: Number, // in kg
    required: [true, 'Please add your weight'],
    min: [30, 'Weight must be at least 30 kg'],
    max: [300, 'Weight must be less than 300 kg']
  },
  activityLevel: {
    type: String,
    enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'],
    default: 'Moderately Active'
  },
  dietaryPreferences: {
    type: [String],
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'High-Protein'],
    default: []
  },
  allergies: [String],
  healthConditions: [String],
  goal: {
    type: String,
    enum: ['Lose Weight', 'Gain Muscle', 'Maintain Weight', 'Improve Health'],
    default: 'Maintain Weight'
  },
  dailyCalories: Number,
  dailyProtein: Number,
  dailyCarbs: Number,
  dailyFat: Number
}, {
  timestamps: true
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate daily calories based on user data
UserSchema.methods.calculateDailyCalories = function() {
  // Basic BMR calculation (Mifflin-St Jeor Equation)
  let bmr;
  if (this.gender === 'Male') {
    bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
  } else {
    bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
  }

  // Activity multiplier
  const activityMultipliers = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    'Extremely Active': 1.9
  };

  let maintenanceCalories = bmr * activityMultipliers[this.activityLevel];

  // Adjust based on goal
  if (this.goal === 'Lose Weight') {
    maintenanceCalories -= 500; // 500 calorie deficit
  } else if (this.goal === 'Gain Muscle') {
    maintenanceCalories += 300; // 300 calorie surplus
  }

  this.dailyCalories = Math.round(maintenanceCalories);
  this.dailyProtein = Math.round((this.dailyCalories * 0.3) / 4); // 30% from protein
  this.dailyCarbs = Math.round((this.dailyCalories * 0.4) / 4); // 40% from carbs
  this.dailyFat = Math.round((this.dailyCalories * 0.3) / 9); // 30% from fat

  return this.dailyCalories;
};

module.exports = mongoose.model('User', UserSchema);