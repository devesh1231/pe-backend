
const express = require('express');
const routes = express.Router();

// Import controllers
const { registerController, getAllUsersController, deleteUserController, viewProfileController, loginController, updateProfileController, getMealController, replaceMeal, checkOut, viewOrder, updateOrder, generateOrderId, coachAppoinntment } = require('../controllers/user.controller');
const { userAuth } = require('../middleware/auth.middleware');

routes.get("/profile", userAuth, viewProfileController);
routes.post("/register", registerController);
routes.post("/login", loginController);
routes.put("/update-user", userAuth, updateProfileController);
routes.delete("/delete-user", deleteUserController);
routes.get("/users", getAllUsersController);
routes.get("/get-meal", userAuth, getMealController);
routes.post("/replace-meal", userAuth, replaceMeal);
routes.post("/checkout", userAuth, checkOut);
routes.get("/view-order", userAuth, viewOrder);
routes.put("/update-order", userAuth, updateOrder);
routes.post("/orderId", userAuth, generateOrderId);
routes.post("/appoinment", userAuth, coachAppoinntment);

module.exports = routes;