const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Email is required'],
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required'],
    unique: true // Optional, if you want usernames to be unique
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);
