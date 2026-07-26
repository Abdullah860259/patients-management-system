const Feedback = require('../models/Feedback');

const findFeedbacks = async (query, sortBy, limit, skip) => {
  return Feedback.find(query)
    .populate('treatment', 'name')
    .sort(sortBy)
    .limit(limit)
    .skip(skip);
};

const countFeedbacks = async (query) => {
  return Feedback.countDocuments(query);
};

const findFeedbackById = async (patientId, feedbackId) => {
  return Feedback.findOne({ _id: feedbackId, patient: patientId })
    .populate('treatment', 'name description')
    .populate('ceoResponse.respondedBy', 'firstName lastName');
};

const createFeedback = async (data) => {
  return Feedback.create(data);
};

const getFeedbackStats = async (userId) => {
  const [total, avgRating, byCategory, byStatus, recent] = await Promise.all([
    Feedback.countDocuments({ patient: userId }),
    Feedback.aggregate([
      { $match: { patient: userId } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]),
    Feedback.aggregate([
      { $match: { patient: userId } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { count: -1 } }
    ]),
    Feedback.aggregate([
      { $match: { patient: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Feedback.find({ patient: userId }).sort('-createdAt').limit(5)
  ]);

  return {
    totalFeedbacks: total,
    averageRating: avgRating.length > 0 ? avgRating[0].avg.toFixed(1) : 0,
    byCategory,
    byStatus,
    recentFeedbacks: recent
  };
};

module.exports = {
  findFeedbacks,
  countFeedbacks,
  findFeedbackById,
  createFeedback,
  getFeedbackStats
};
