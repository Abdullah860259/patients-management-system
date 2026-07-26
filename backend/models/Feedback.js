const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Feedback category is required'],
    enum: [
      'General',
      'Service Quality',
      'Staff Behavior',
      'Cleanliness',
      'Wait Time',
      'Pricing',
      'Facilities',
      'Treatment Experience',
      'Recommendation',
      'Complaint',
      'Suggestion'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: 200
  },
  message: {
    type: String,
    required: [true, 'Feedback message is required'],
    maxlength: 2000
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  treatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment',
    default: null
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Acknowledged', 'Resolved', 'Closed'],
    default: 'Submitted'
  },
  ceoResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

FeedbackSchema.index({ patient: 1, createdAt: -1 });
FeedbackSchema.index({ status: 1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);
