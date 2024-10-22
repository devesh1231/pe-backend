const Coach = require('../models/coach.model');
const Coupon = require('../models/coupan.model');
const bcrypt = require('bcrypt');
const Order = require('../models/order.model');
const jwt = require('jsonwebtoken');
const { getCurrentDateTime } = require('../utils/index')
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, bio } = req.body;

    // Check if the email already exists
    const existingCoach = await Coach.findOne({ email });
    if (existingCoach) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    console.log(getCurrentDateTime());

    // Create new coach
    const newCoach = new Coach({
      name,
      email,
      password,
      phone,
      bio,
      createdAt: getCurrentDateTime(),
      updatedAt: getCurrentDateTime(),
    });

    await newCoach.save();
    res.status(201).json({ message: 'Coach signed up successfully', coach: newCoach });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for Coach login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the coach by email
    const coach = await Coach.findOne({ email });
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Check if the password matches
    const isMatch = await coach.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: coach._id, email: coach.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    coach.token = token;
    await coach.save();

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for updating coach details
const updateCoachDetails = async (req, res) => {
  try {
    const { name, phone, bio } = req.body;
    const coachId = req.params.id;

    // Find the coach by ID and update details
    const updatedCoach = await Coach.findByIdAndUpdate(
      coachId,
      { name, phone, bio, updatedAt: getCurrentDateTime() },
      { new: true }
    );

    if (!updatedCoach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.status(200).json({ message: 'Coach details updated successfully', coach: updatedCoach });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const getDashbaord = async (req, res) => {
  try {
    const coach = req.coach;
    const order = await Order.find({ couponUsed: coach.coachCode }).select('_id createdAt price discount');
    return res.json({
      data: { coach, order },
      message: "fetced"
    })

  }
  catch (error) {
    console.log(error);
    return res.json({
      status: 200,
      message: "something went wrong"
    })
  }
}



module.exports = {
  signup,
  login,
  updateCoachDetails,
  getDashbaord
}