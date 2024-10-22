const Coupon = require('../models/coupan.model');

// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const { name, description, discount, percentage, code, active, maxUsage, usageCount, expirationDate } = req.body;

    const refNumber = req.coach._id;
    const newCoupon = new Coupon({
      name,
      description,
      discount,
      percentage,
      code,
      active,
      maxUsage,
      usageCount,
      refNumber,
      expirationDate
    });

    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific coupon by ID
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a coupon by ID
const updateCoupon = async (req, res) => {
  try {
    const { name, description, discount, percentage, code, active, maxUsage, usageCount, expirationDate } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        discount,
        percentage,
        code,
        active,
        maxUsage,
        usageCount,
        expirationDate
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Redeem a coupon
const redeemCoupon = async (req, res) => {
  try {
    const { code, price } = req.body;
    const user = req.user;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if the coupon is active and not expired
    if (!coupon.active || new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon is inactive or expired' });
    }

    // Check if the coupon usage has reached its max usage limit
    if (coupon.usageCount >= coupon.maxUsage) {
      return res.status(400).json({ message: 'Coupon has been fully used' });
    }

    // Calculate the discount
    let discountedPrice;
    if (coupon.percentage) {
      discountedPrice = price - (price * (coupon.discount / 100));
    } else {
      discountedPrice = price - coupon.discount;
    }

    // Check if the user ID is already present in the userId array
    const isUserPresent = coupon.userId.filter((id) => id.toString() === user._id.toString()).length > 0;

    if (!isUserPresent) {
      // If user is not present, add user ID to the userId array and increment usage count
      coupon.userId.push(user._id);
      coupon.usageCount += 1;
      await coupon.save(); // Save the updated coupon
    }

    res.status(200).json({ originalPrice: price, discountedPrice });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  redeemCoupon,
}