const mongoose = require('mongoose');

const mealPriceSchema = new mongoose.Schema({
  days: {
    type: Number,
  },
  meal: [
    {
      type: String
    }
  ],
  displayPrice: {
    type: Number,
    required: true
  },
  actualPrice: {
    type: Number,
  }
});

const MealPriceTable = mongoose.model('MealPriceTable', mealPriceSchema);
module.exports = MealPriceTable;
