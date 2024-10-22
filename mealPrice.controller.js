const MealPriceTable = require('../models/mealPrice.model');
const { getCurrentDateTime } = require('../utils/index')
const createMealPrice = async (req, res) => {
  try {
    const { days, meal, displayPrice, actualPrice } = req.body;


    const newMealPrice = new MealPriceTable({
      days,
      meal,
      actualPrice,
      displayPrice,
      createdDate: getCurrentDateTime(),
      updatedDate: getCurrentDateTime(),
    });

    await newMealPrice.save();
    res.status(201).json({
      success: true,
      data: newMealPrice,
      message: 'Meal price created successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




const getAllMealPrices = async (req, res) => {
  try {
    const result = await MealPriceTable.insertMany(mealData);
    const mealPrices = await MealPriceTable.find();
    res.status(200).json({ success: true, data: mealPrices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getMealPriceById = async (req, res) => {
  try {
    const mealPrice = await MealPriceTable.findById(req.params.id);
    if (!mealPrice) {
      return res.status(404).json({ success: false, error: 'Meal price record not found' });
    }
    res.status(200).json({ success: true, data: mealPrice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateMealPrice = async (req, res) => {
  try {
    const { goal, totalDays, meal, CuisineType, price } = req.body;

    // Fetch the meal price record by ID
    let mealPrice = await MealPriceTable.findById(req.params.id);
    if (!mealPrice) {
      return res.status(404).json({
        success: false,
        message: 'Meal price record not found.',
      });
    }

    // Update fields if provided
    mealPrice.goal = goal || mealPrice.goal;                  // Update only if provided
    mealPrice.totalDays = totalDays !== undefined ? totalDays : mealPrice.totalDays;
    mealPrice.meal = meal || mealPrice.meal;                  // Enum validation will ensure proper meal values
    mealPrice.CuisineType = CuisineType || mealPrice.CuisineType;
    mealPrice.price = price !== undefined ? price : mealPrice.price;
    mealPrice.updatedDate = getCurrentDateTime();             // Always update the updated date

    await mealPrice.save();
    res.status(200).json({
      success: true,
      data: mealPrice,
      message: 'Meal price updated successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a specific meal price record by ID
const deleteMealPrice = async (req, res) => {
  try {
    const mealPrice = await MealPriceTable.findByIdAndDelete(req.params.id);
    if (!mealPrice) {
      return res.status(404).json({ success: false, error: 'Meal price record not found' });
    }
    res.status(200).json({ success: true, data: mealPrice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getMealPriceByQuery = async (req, res) => {
  try {
    const { goal, totalDays, meal, CuisineType } = req.body; // Expecting body

    // Build the query object based on provided parameters
    let query = {};

    if (goal) {
      query.goal = goal;  // Exact match for goal
    }

    if (totalDays) {
      query.totalDays = Number(totalDays);  // Convert to Number since totalDays is numeric
    }

    if (Array.isArray(meal) && meal.length > 0) {
      query.meal = meal; // Match the complete meal array
    }

    if (CuisineType) {
      query.CuisineType = CuisineType;  // Exact match for cuisine type
    }

    // Execute the query
    const mealPrice = await MealPriceTable.findOne(query);

    if (!mealPrice) {
      return res.status(404).json({
        success: false,
        message: 'No meal price record found for the given query parameters.',
      });
    }

    res.status(200).json({
      success: true,
      data: mealPrice
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  createMealPrice,
  deleteMealPrice,
  updateMealPrice,
  getAllMealPrices,
  getMealPriceByQuery,
  getMealPriceById
}