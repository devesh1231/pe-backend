const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  percentage: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  },
  maxUsage: {
    type: Number,
    default: 1
  },
  usageCount: {
    type: Number,
    default: 0
  },
  refNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
  },
  expirationDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: String,

  },
  updatedAt: {
    type: String,

  }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
