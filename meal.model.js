const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getCurrentDateTime } = require('../utils/index')
// Define the MealTable schema
const MealTableSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  ingredients: {
    type: Object,
    default: {}
  },
  img: {
    type: String,
    default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Findian-food&psig=AOvVaw1MhiwMiptKCWcJD1ZzOTDA&ust=1727538657802000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOCCppS944gDFQAAAAAdAAAAABAJ"
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    required: true
  },
  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  mealDay: {
    type: String,
    enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  carbs: {
    type: String,
  },
  protiens: {
    type: String,
  },
  CuisineType: {
    type: String,
    default: "",
    enum: ["veg", 'non-veg', 'ovo']
  },
  goal: {
    type: String,
    enum: ["gain", "loss", "maintain"],
    default: "gain"
  },
  energy: {
    type: String,
  },
  fat: {
    type: String,
  },
  createdDate: {
    type: String,
    default: getCurrentDateTime()
  },
  updatedDate: {
    type: String,
    default: getCurrentDateTime()
  }
});


MealTableSchema.pre('save', function (next) {
  this.updatedDate = getCurrentDateTime()
  next();
});


//const MealTable = mongoose.model('MyMeals', MealTableSchema);
const MealTable = mongoose.model('MealTables', MealTableSchema);
module.exports = MealTable
