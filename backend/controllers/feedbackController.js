const { validationResult } = require('express-validator');
const feedbackService = require('../services/feedbackService');

exports.getAll = async (req, res) => {
  try {
    const { status, category, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = { patient: req.user.id };
    if (status) query.status = status;
    if (category) query.category = category;

    const [feedbacks, total] = await Promise.all([
      feedbackService.findFeedbacks(query, sortBy, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)),
      feedbackService.countFeedbacks(query)
    ]);

    res.status(200).json({
      success: true, count: feedbacks.length, total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page), feedbacks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { category, subject, message, rating, treatment, isAnonymous } = req.body;
    const feedback = await feedbackService.createFeedback({
      patient: req.user.id, category, subject, message, rating, treatment, isAnonymous
    });

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await feedbackService.getFeedbackStats(req.user.id);
    res.status(200).json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const feedback = await feedbackService.findFeedbackById(req.user.id, req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.status(200).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
