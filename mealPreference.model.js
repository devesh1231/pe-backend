const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the MealPreference schema
const MealPreferenceSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  meals: {
    breakfast: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealTable'
    }],
    lunch: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealTable'
    }],
    dinner: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealTable'
    }],
    snacks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealTable'
    }]
  }
}, { timestamps: true });


const MealPreference = mongoose.model('MealPreference', MealPreferenceSchema);


module.exports = MealPreference;
