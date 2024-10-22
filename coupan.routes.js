const express = require('express');
const couponController = require('../controllers/coupan.controller');
const { isCoach, userAuth } = require('../middleware/auth.middleware');
const router = express.Router();

// CRUD routes
router.post('/add-coupons', isCoach, couponController.createCoupon);
router.get('/get-coupons', couponController.getAllCoupons);
router.get('/get-coupons/:id', couponController.getCouponById);
router.put('/get-coupons/:id', isCoach, couponController.updateCoupon);
router.delete('/delete-coupons/:id', isCoach, couponController.deleteCoupon);

router.put('/redeem', userAuth, couponController.redeemCoupon);

module.exports = router;
