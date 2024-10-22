const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Coach Schema
const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  coachCode: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  token: {
    type: String,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  createdAt: {
    type: String,
    default: "",
  },
  updatedAt: {
    type: String,
    default: "",
  }
});


coachSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = Date.now();
  next();
});


coachSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;
