const express = require('express');
const router = express.Router();
const mealPriceTableController = require('../controllers/mealPrice.controller');

// Create a new meal price
router.post('/add', mealPriceTableController.createMealPrice);

router.get('/get-all', mealPriceTableController.getAllMealPrices);

router.put('/get-price', mealPriceTableController.getMealPriceByQuery);

// Get a meal price by ID
router.get('/get/:id', mealPriceTableController.getMealPriceById);






router.put('/update/:id', mealPriceTableController.updateMealPrice);

// Delete a meal price by ID
router.delete('/delete/:id', mealPriceTableController.deleteMealPrice);

module.exports = router;
