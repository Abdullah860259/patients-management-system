const Payment = require('../models/Payment');

const findPayments = async (query, sortBy, limit, skip) => {
  return Payment.find(query)
    .populate({ path: 'treatment', select: 'name description' })
    .sort(sortBy)
    .limit(limit)
    .skip(skip);
};

const countPayments = async (query) => {
  return Payment.countDocuments(query);
};

const findPaymentById = async (patientId, paymentId) => {
  return Payment.findOne({ _id: paymentId, patient: patientId })
    .populate({
      path: 'treatment',
      select: 'name description'
    });
};

const getPaymentStats = async (userId) => {
  const [totalPaid, recentPayments] = await Promise.all([
    Payment.aggregate([
      { $match: { patient: userId } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]),
    Payment.find({ patient: userId })
      .populate({ path: 'treatment', select: 'name description' })
      .sort('-paymentDate')
      .limit(5)
  ]);

  return {
    totalPaid: totalPaid.length > 0 ? totalPaid[0].total : 0,
    recentPayments
  };
};

module.exports = {
  findPayments,
  countPayments,
  findPaymentById,
  getPaymentStats
};
