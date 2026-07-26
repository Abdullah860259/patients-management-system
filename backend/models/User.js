const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  idNumber: {
    type: Number,
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    maxlength: 20
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  dentalHistory: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['patient', 'admin', 'ceo'],
    default: 'patient'
  },
  avatar: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  treatments: [{
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treatment'
    },
    name: String,
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
      default: 'ongoing'
    },
    totalCost: Number,
    totalPaid: {
      type: Number,
      default: 0
    },
    payments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    }]
  }]
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.idNumber) {
    let idNumber;
    let exists = true;
    while (exists) {
      idNumber = Math.floor(1000000000 + Math.random() * 9000000000);
      exists = await mongoose.model('User').exists({ idNumber });
    }
    this.idNumber = idNumber;
  }
  next();
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', UserSchema);
