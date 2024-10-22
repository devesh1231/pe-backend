const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Order schema
const OrderSchema = new Schema({
  meals: {
    type: Object,
    default: {}
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryTime: {
    type: String,
  },
  address: {
    type: String,
    required: true
  },
  couponUsed: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
  },
  totalDays: {
    type: Number,
    default: 1
  },
  // Razorpay related fields
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
