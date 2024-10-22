
// Import required modules
const express = require('express');
const MealTable = require('./api/models/meal.model');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();
const Razorpay = require('razorpay');
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const app =  express();
const sequelize = require("./api/config/database");

// Middleware
app.use(cors()); // Enable CORS
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream })); // Enable logging


app.use(morgan('dev'));
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.text());

app.get("/", (req, res) => {
  res.json({ message: "Backend Deployed successfully", version: 21});
});

console.log(process.env.JWT_SECRET)
const userRoutes = require("./api/routes/user.routes");
app.use("/api/user", userRoutes);


const MealRoutes = require("./api/routes/meal.routes");
app.use("/api/meal", MealRoutes);


const CouponRoutes = require("./api/routes/coupan.routes");
app.use("/api/coupon", CouponRoutes);


const CoachRoutes = require("./api/routes/coach.routes");
app.use("/api/coach", CoachRoutes);

const PriceRoutes = require("./api/routes/mealPrice.routes");
app.use("/api/price", PriceRoutes);


const port =  8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
