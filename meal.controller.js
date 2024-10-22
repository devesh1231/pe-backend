const MealTable = require('../models/meal.model');
const jwt = require('jsonwebtoken');
const { getCurrentDateTime } = require('../utils/index')
require("dotenv/config")
const mealData = [
  { name: 'Butter Chicken', cuisineType: 'non-veg', ingredients: ['Chicken', 'Spices', 'Yogurt', 'Butter'], description: 'A rich, creamy dish with marinated chicken in spiced tomato sauce.' },
  { name: 'Chicken Tikka Masala', cuisineType: 'non-veg', ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Spices'], description: 'A popular Indian dish with roasted chicken chunks in a spicy sauce.' },
  { name: 'Paneer Butter Masala', cuisineType: 'veg', ingredients: ['Paneer', 'Tomatoes', 'Butter', 'Spices'], description: 'A creamy tomato-based dish with tender paneer cubes.' },
  { name: 'Veg Biryani', cuisineType: 'veg', ingredients: ['Rice', 'Veggies', 'Yogurt', 'Ghee'], description: 'A fragrant rice dish made with mixed vegetables and aromatic spices.' },
  { name: 'Fruit Salad', cuisineType: 'veg', ingredients: ['Banana', 'Apple', 'Grapes', 'Orange'], description: 'A refreshing blend of seasonal fruits, perfect for a light snack.' },
  { name: 'Omelette', cuisineType: 'ovo', ingredients: ['Eggs', 'Cheese', 'Onions', 'Butter'], description: 'A protein-packed dish with fluffy eggs and cheese.' },
  { name: 'Pasta Alfredo', cuisineType: 'veg', ingredients: ['Pasta', 'Cream', 'Mushrooms', 'Cheese'], description: 'A creamy pasta dish with mushrooms and parmesan.' },
  { name: 'Grilled Sandwich', cuisineType: 'veg', ingredients: ['Bread', 'Cheese', 'Tomato', 'Butter'], description: 'A toasted sandwich with cheese and fresh vegetables.' },
  { name: 'Mango Smoothie', cuisineType: 'veg', ingredients: ['Mango', 'Yogurt', 'Milk', 'Honey'], description: 'A sweet and creamy tropical smoothie.' },
  { name: 'Banana Pancakes', cuisineType: 'veg', ingredients: ['Banana', 'Milk', 'Flour', 'Honey'], description: 'Fluffy pancakes made with fresh bananas and honey.' },
  { name: 'Egg Fried Rice', cuisineType: 'ovo', ingredients: ['Eggs', 'Rice', 'Vegetables', 'Soy Sauce'], description: 'A simple yet flavorful fried rice dish with scrambled eggs and veggies.' },
  { name: 'Chicken Caesar Salad', cuisineType: 'non-veg', ingredients: ['Chicken', 'Lettuce', 'Caesar Dressing', 'Croutons'], description: 'A classic salad with grilled chicken, crisp lettuce, and Caesar dressing.' },
  { name: 'Paneer Tikka', cuisineType: 'veg', ingredients: ['Paneer', 'Spices', 'Yogurt', 'Capsicum'], description: 'Marinated paneer cubes grilled to perfection with veggies.' },
  { name: 'Masala Dosa', cuisineType: 'veg', ingredients: ['Rice Batter', 'Potato', 'Spices', 'Ghee'], description: 'A crispy Indian crepe stuffed with spiced mashed potatoes.' },
  { name: 'Fish Curry', cuisineType: 'non-veg', ingredients: ['Fish', 'Coconut Milk', 'Spices', 'Curry Leaves'], description: 'A tangy and spicy fish curry made with coconut milk.' },
  { name: 'Shakshuka', cuisineType: 'ovo', ingredients: ['Eggs', 'Tomato', 'Spices', 'Onions'], description: 'A Middle Eastern dish with poached eggs in a spicy tomato sauce.' },
  { name: 'Vegetable Stir Fry', cuisineType: 'veg', ingredients: ['Broccoli', 'Carrots', 'Bell Peppers', 'Soy Sauce'], description: 'A quick and healthy stir fry loaded with veggies.' },
  { name: 'Chicken Shawarma', cuisineType: 'non-veg', ingredients: ['Chicken', 'Yogurt', 'Garlic', 'Pita Bread'], description: 'Middle Eastern marinated chicken served in pita with garlic sauce.' },
  { name: 'Palak Paneer', cuisineType: 'veg', ingredients: ['Paneer', 'Spinach', 'Spices', 'Cream'], description: 'A healthy and delicious dish made with paneer cubes in spinach gravy.' },
  { name: 'Aloo Paratha', cuisineType: 'veg', ingredients: ['Wheat Flour', 'Potato', 'Spices', 'Ghee'], description: 'Indian flatbread stuffed with spiced mashed potatoes, perfect for breakfast.' },
  { name: 'Scrambled Eggs', cuisineType: 'ovo', ingredients: ['Eggs', 'Milk', 'Butter', 'Salt'], description: 'Light and fluffy scrambled eggs, a breakfast classic.' },
  { name: 'Chicken Kebab', cuisineType: 'non-veg', ingredients: ['Chicken', 'Spices', 'Yogurt', 'Garlic'], description: 'Juicy and flavorful chicken skewers grilled to perfection.' },
  { name: 'Dal Makhani', cuisineType: 'veg', ingredients: ['Lentils', 'Butter', 'Cream', 'Spices'], description: 'A creamy lentil dish cooked with butter and spices, a North Indian favorite.' },
  { name: 'Veg Pulao', cuisineType: 'veg', ingredients: ['Rice', 'Vegetables', 'Spices', 'Ghee'], description: 'A simple and flavorful rice dish made with mixed veggies.' },
  { name: 'Egg Curry', cuisineType: 'ovo', ingredients: ['Eggs', 'Tomato', 'Onions', 'Spices'], description: 'Hard-boiled eggs simmered in a spiced curry sauce.' },
  { name: 'Mutton Biryani', cuisineType: 'non-veg', ingredients: ['Mutton', 'Rice', 'Spices', 'Yogurt'], description: 'A fragrant rice dish with tender mutton pieces and aromatic spices.' },
  { name: 'Chole Bhature', cuisineType: 'veg', ingredients: ['Chickpeas', 'Spices', 'Flour', 'Yogurt'], description: 'A hearty dish of spicy chickpeas served with fried bread.' },
  { name: 'Cheese Omelette', cuisineType: 'ovo', ingredients: ['Eggs', 'Cheese', 'Onions', 'Tomatoes'], description: 'A cheesy omelette packed with onions and tomatoes.' },
  { name: 'Fish and Chips', cuisineType: 'non-veg', ingredients: ['Fish', 'Potatoes', 'Flour', 'Oil'], description: 'A British classic, fried fish served with crispy fries.' },
  { name: 'Rajma Chawal', cuisineType: 'veg', ingredients: ['Kidney Beans', 'Rice', 'Spices', 'Tomato'], description: 'A comforting dish of spiced kidney beans served with rice.' },
  { name: 'Egg Bhurji', cuisineType: 'ovo', ingredients: ['Eggs', 'Onions', 'Tomato', 'Spices'], description: 'Spicy scrambled eggs with Indian spices, perfect for breakfast.' },
  { name: 'Chicken Noodles', cuisineType: 'non-veg', ingredients: ['Chicken', 'Noodles', 'Vegetables', 'Soy Sauce'], description: 'Stir-fried noodles with chicken and vegetables.' },
  { name: 'Paneer Kathi Roll', cuisineType: 'veg', ingredients: ['Paneer', 'Tortilla', 'Vegetables', 'Spices'], description: 'A delicious wrap filled with grilled paneer and veggies.' },
  { name: 'Vegan Smoothie Bowl', cuisineType: 'veg', ingredients: ['Banana', 'Almond Milk', 'Berries', 'Chia Seeds'], description: 'A nutrient-packed vegan smoothie bowl with fresh fruits.' },
  { name: 'Chicken Tandoori', cuisineType: 'non-veg', ingredients: ['Chicken', 'Spices', 'Yogurt', 'Garlic'], description: 'Char-grilled chicken marinated in yogurt and spices.' },
  { name: 'Pav Bhaji', cuisineType: 'veg', ingredients: ['Potato', 'Tomato', 'Butter', 'Spices'], description: 'A popular street food with spiced mashed vegetables served with buttered bread.' },
  { name: 'Egg Salad', cuisineType: 'ovo', ingredients: ['Eggs', 'Lettuce', 'Mayonnaise', 'Mustard'], description: 'A simple yet flavorful salad with eggs and a creamy dressing.' },
  { name: 'Prawn Curry', cuisineType: 'non-veg', ingredients: ['Prawns', 'Coconut Milk', 'Spices', 'Curry Leaves'], description: 'A flavorful and spicy curry made with prawns and coconut milk.' },
  { name: 'Mushroom Risotto', cuisineType: 'veg', ingredients: ['Mushrooms', 'Rice', 'Cheese', 'Wine'], description: 'A creamy Italian rice dish with sautéed mushrooms.' },
  { name: 'Lamb Chops', cuisineType: 'non-veg', ingredients: ['Lamb', 'Garlic', 'Rosemary', 'Butter'], description: 'Grilled lamb chops marinated with garlic and rosemary.' },
  { name: 'Gobi Manchurian', cuisineType: 'veg', ingredients: ['Cauliflower', 'Soy Sauce', 'Onions', 'Spices'], description: 'A spicy Indo-Chinese dish made with crispy fried cauliflower.' },
  { name: 'Eggplant Parmesan', cuisineType: 'veg', ingredients: ['Eggplant', 'Cheese', 'Tomato Sauce', 'Breadcrumbs'], description: 'A baked dish with layers of eggplant, cheese, and tomato sauce.' },
  { name: 'Shrimp Scampi', cuisineType: 'non-veg', ingredients: ['Shrimp', 'Garlic', 'Butter', 'Lemon'], description: 'A quick and easy seafood dish with shrimp in a garlic butter sauce.' }
];


// Function to generate random meal data
function generateRandomMeal() {
  const randomMeal = mealData[Math.floor(Math.random() * mealData.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomDay = daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)];
  const randomMealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];

  return {
    name: randomMeal.name,
    description: randomDescription,
    ingredients: {
      ingredient1: randomMeal.ingredients[0],
      ingredient2: randomMeal.ingredients[1],
      ingredient3: randomMeal.ingredients[2],
      ingredient4: randomMeal.ingredients[3]
    },
    // img: imageUrls[Math.floor(Math.random() * imageUrls.length)],  // Placeholder for image URLs
    mealType: randomMealType,
    mealDay: randomDay,
    carbs: `${Math.floor(Math.random() * 50) + 10}g`,   // Random carbs between 10g and 60g
    proteins: `${Math.floor(Math.random() * 20) + 5}g`, // Random proteins between 5g and 25g
    energy: `${Math.floor(Math.random() * 400) + 100}kcal`, // Random energy between 100 and 500 kcal
    fat: `${Math.floor(Math.random() * 20) + 1}g`,      // Random fat between 1g and 20g
    CuisineType: randomMeal.cuisineType,                // Assign correct CuisineType
    createdDate: getCurrentDateTime(),
    updatedDate: getCurrentDateTime()
  };
}
function randomMealType() {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
  return mealTypes[Math.floor(Math.random() * mealTypes.length)];
}
function randomDayOfWeek() {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)];
}
function generateRandomMeal() {
  const randomMeal = mealData[Math.floor(Math.random() * mealData.length)];
  return {
    name: randomMeal.name,
    description: randomMeal.description,  // Add description here
    ingredients: {
      ingredient1: randomMeal.ingredients[0],
      ingredient2: randomMeal.ingredients[1],
      ingredient3: randomMeal.ingredients[2],
      ingredient4: randomMeal.ingredients[3]
    },
    //  img: randomImage(),
    mealType: randomMealType(),
    mealDay: randomDayOfWeek(),
    carbs: `${Math.floor(Math.random() * 50) + 10}g`,   // Random carbs between 10g and 60g
    proteins: `${Math.floor(Math.random() * 20) + 5}g`, // Random proteins between 5g and 25g
    energy: `${Math.floor(Math.random() * 400) + 100}kcal`, // Random energy between 100 and 500 kcal
    fat: `${Math.floor(Math.random() * 20) + 1}g`,      // Random fat between 1g and 20g
    CuisineType: randomMeal.cuisineType,                // Assign correct CuisineType
    createdDate: getCurrentDateTime(),
    updatedDate: getCurrentDateTime()
  };
}

// Create multiple randomly generated meals and insert them into the database
const insertRandomMeals = async (req, res) => {
  try {
    const mealDocs = [];
    console.log("hii");

    // Generate 50 random meal documents
    for (let i = 0; i < 50; i++) {
      const newMeal = generateRandomMeal();
      mealDocs.push(newMeal);
    }

    // Insert the randomly generated meals into the database
    const savedMeals = await MealTable.insertMany(mealDocs);

    res.status(201).json({
      status_code: 201,
      message: `${savedMeals.length} random meals created successfully`,
      data: savedMeals
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status_code: 500,
      message: 'Server error during random meal insertion',
      error: err.message
    });
  }
};


// Arrays of random values for name, description, and ingredients

const createMeal = async (req, res) => {
  const { name, CuisineType, description, ingredients, img, mealType, mealDay, carbs, protiens, energy, fat } = req.body;
  //const userId = req.user._id; // Assuming you extract the user ID from the JWT token

  try {
    const meal = new MealTable({
      name,
      description,
      ingredients,
      img,
      CuisineType,
      mealType,
      mealDay,
      carbs,
      protiens,
      energy,
      fat,
    });

    const savedMeal = await meal.save();

    res.status(201).json({
      status_code: 201,
      message: 'Meal created successfully',
      data: savedMeal
    });
  } catch (err) {
    res.status(500).json({
      status_code: 500,
      message: 'Server error',
      error: err.message
    });
  }
};

// Get all meals for the authenticated user
const getMeals = async (req, res) => {
  try {
    const meals = await MealTable.find({});
    res.status(200).json({
      status_code: 200,
      data: meals
    });
  } catch (err) {
    res.status(500).json({
      status_code: 500,
      message: 'Server error',
      error: err.message
    });
  }
};

// Get a specific meal by ID
const getMealById = async (req, res) => {
  const { id } = req.params;

  try {
    const meal = await MealTable.findById(id);

    if (!meal) {
      return res.status(404).json({
        status_code: 404,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      status_code: 200,
      data: meal
    });
  } catch (err) {
    res.status(500).json({
      status_code: 500,
      message: 'Server error',
      error: err.message
    });
  }
};

// Update a meal by ID
const updateMeal = async (req, res) => {
  const { id } = req.params;
  const { name, description, CuisineType, ingredients, img, mealType, mealDay, carbs, protiens, energy, fat } = req.body;

  try {
    const updatedMeal = await MealTable.findByIdAndUpdate(id, {
      name,
      description,
      ingredients,
      img,
      CuisineType,
      mealType,
      mealDay,
      carbs,
      protiens,
      energy,
      fat,
      updatedDate: getCurrentDateTime()
    }, { new: true });

    if (!updatedMeal) {
      return res.status(404).json({
        status_code: 404,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      status_code: 200,
      message: 'Meal updated successfully',
      data: updatedMeal
    });
  } catch (err) {
    res.status(500).json({
      status_code: 500,
      message: 'Server error',
      error: err.message
    });
  }
};

// Delete a meal by ID
const deleteMeal = async (req, res) => {
  const { id } = req.params;

  try {
    const meal = await MealTable.findByIdAndDelete(id);

    if (!meal) {
      return res.status(404).json({
        status_code: 404,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      status_code: 200,
      message: 'Meal deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status_code: 500,
      message: 'Server error',
      error: err.message
    });
  }
};


const mealOptions = async (req, res) => {
  try {
    const { mealId } = req.query;
    const meal = await MealTable.findOne({ _id: mealId });
    const goal = meal.goal;
    const mealType = meal.mealType;
    console.log(meal)
    const mealOption = await MealTable.find({ goal, mealType, CuisineType: meal.CuisineType }).limit(20);
    return res.json({
      status: true,
      data: mealOption,
      message: "all alternative meals fetched sucessfully"
    })
  }
  catch (error) {
    console.log(error);
    return res.json({
      data: "",
      message: "something went wrong"
    })
  }
}

module.exports = { createMeal, getMeals, getMealById, updateMeal, deleteMeal, insertRandomMeals, mealOptions };
