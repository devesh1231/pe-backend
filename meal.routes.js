const express = require('express');
const MealRoutes = express.Router();
const { createMeal, getMeals, getMealById, updateMeal, deleteMeal, insertRandomMeals, mealOptions } = require('../controllers/meal.controller'); // Assuming you have an auth middleware for JWT token verification

// Create a new meal
MealRoutes.post('/add-meal', createMeal);

MealRoutes.post('/random-meal', insertRandomMeals);

// Get all meals
MealRoutes.get('/get-meal', getMeals);

// Get a specific meal by ID
MealRoutes.get('/get-meal-by/:id', getMealById);

// Update a meal by ID
MealRoutes.put('/update-meal/:id', updateMeal);

// Delete a meal by ID
MealRoutes.delete('/delete-meal/:id', deleteMeal);
MealRoutes.get('/meal-option', mealOptions);

module.exports = MealRoutes;
