const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  treatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment',
    required: true
  },
  paidAmount: {
    type: Number,
    required: [true, 'Paid amount is required']
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment'],
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

PaymentSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const prefix = 'RCPT';
    const timestamp = date.getFullYear().toString().slice(-2) +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.receiptNumber = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

PaymentSchema.index({ patient: 1, paymentDate: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);
