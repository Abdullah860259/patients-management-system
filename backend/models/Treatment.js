const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Treatment name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Treatment description is required']
  },
  cost: {
    type: Number,
    required: [true, 'Treatment cost is required']
  },
  durationDays: {
    type: Number,
    default: 0
  },
  minimumAdvanceAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Treatment', TreatmentSchema);
