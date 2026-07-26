const paymentService = require('../services/paymentService');

exports.getAll = async (req, res) => {
  try {
    const { sortBy = '-paymentDate', page = 1, limit = 10 } = req.query;
    const query = { patient: req.user.id };

    const [payments, total] = await Promise.all([
      paymentService.findPayments(query, sortBy, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)),
      paymentService.countPayments(query)
    ]);

    res.status(200).json({
      success: true, count: payments.length, total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page), payments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await paymentService.getPaymentStats(req.user.id);
    res.status(200).json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const payment = await paymentService.findPaymentById(req.user.id, req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
