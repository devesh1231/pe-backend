const mongoose = require('mongoose');
const { getCurrentDateTime } = require('../utils/index')
const userSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    phone: {
        type: String,

    },
    email: {
        type: String,
    },
    fcm: {
        type: String
    },
    password: {
        type: String,

    },
    token: {
        type: String
    },
    loginTime: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'non-binary', 'other']
    },
    height: {
        type: Number
    },
    weight: {
        type: Number,
        default: 0.0,
    },
    goal: {
        type: String,
        default: "maintain"
    },
    weightlossinkg: {
        type: Number,
        default: 0,
    },
    diet: {
        type: String,
        enum: ["veg", 'non-veg', 'ovo']
    },
    meal: [{
        type: String,
        enum: ['lunch', 'dinner', 'breakfast', 'snacks']
    }],
    scheduleMeal: {
        type: Number,
    },
    workOutSchedule: {
        type: String,
    },
    appleId: {
        type: String,
    },
    duration: {
        type: Number
    },
    createdAt: {
        type: String,
        default: getCurrentDateTime()
    },
    dailyMacros: {
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        kcal: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    },
    breakfastMacros: {
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        kcal: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
    },
    lunchMacros: {
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        kcal: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
    },
    dinnerMacros: {
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        kcal: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
    },
    snackMacros: {
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        kcal: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
    },
    updatedAt: {
        type: String,
        default: getCurrentDateTime()
    },
    isFirstTime: {
        type: Boolean,
        default: true
    },
    address: [{
        type: String,
        default: "",
    }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;
