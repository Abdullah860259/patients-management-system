const User = require('../models/User');
const Treatment = require('../models/Treatment');
const Payment = require('../models/Payment');
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

const findAllTreatments = async (query, sortBy, limit, skip) => {
  return Treatment.find(query)
    .sort(sortBy)
    .limit(limit)
    .skip(skip);
};

const countAllTreatments = async (query) => Treatment.countDocuments(query);

const findAllPayments = async (query, sortBy, limit, skip) => {
  const data = await Payment.find(query)
    .populate({ path: 'treatment', select: 'name description' })
    .populate('patient', 'firstName lastName email')
    .populate('processedBy', 'firstName lastName')
    .sort(sortBy)
    .limit(limit)
    .skip(skip);

  return data;
};

const countAllPayments = async (query) => Payment.countDocuments(query);

const findAllFeedbacks = async (query, sortBy, limit, skip) => {
  return Feedback.find(query)
    .populate('patient', 'firstName lastName email')
    .populate('treatment', 'name')
    .sort(sortBy)
    .limit(limit)
    .skip(skip);
};

const countAllFeedbacks = async (query) => Feedback.countDocuments(query);

const findAllPatients = async (query, sortBy, limit, skip, createdBy = null) => {
  const filter = { ...query, role: 'patient' };
  if (createdBy) filter.createdBy = createdBy;
  return User.find(filter)
    .select('-password')
    .sort(sortBy)
    .limit(limit)
    .skip(skip);
};

const countAllPatients = async (query, createdBy = null) => {
  const filter = { ...query, role: 'patient' };
  if (createdBy) filter.createdBy = createdBy;
  return User.countDocuments(filter);
};

const getDashboardStats = async (adminId = null) => {
  const paymentMatch = adminId ? { processedBy: new mongoose.Types.ObjectId(adminId) } : {};
  const promises = [
    User.countDocuments({ role: 'patient' }),
    Treatment.countDocuments(),
    Payment.aggregate([
      { $match: paymentMatch },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ])
  ];

  if (adminId) {
    promises.push(User.countDocuments({ role: 'patient', createdBy: adminId }));
  } else {
    promises.push(
      Feedback.countDocuments(),
      Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
      Feedback.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    );
  }

  const [totalPatients, totalTreatments, totalRevenue, ...rest] = await Promise.all(promises);

  const result = {
    totalPatients,
    totalTreatments,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
  };

  if (adminId) {
    result.patientsCreated = rest[0];
  } else {
    const [totalFeedbacks, avgRating, feedbackByStatus] = rest;
    result.totalFeedbacks = totalFeedbacks;
    result.averageRating = avgRating.length > 0 ? avgRating[0].avg.toFixed(1) : 0;
    result.feedbackByStatus = feedbackByStatus;
  }

  return result;
};

const respondToFeedback = async (feedbackId, message, adminId) => {
  return Feedback.findByIdAndUpdate(feedbackId, {
    status: 'Acknowledged',
    ceoResponse: {
      message,
      respondedAt: new Date(),
      respondedBy: adminId
    }
  }, { new: true });
};

const findAllAdmins = async (query, sortBy, limit, skip) => {
  return User.find({ ...query, role: 'admin' })
    .select('-password')
    .sort(sortBy)
    .limit(limit)
    .skip(skip);
};

const countAllAdmins = async (query) => User.countDocuments({ ...query, role: 'admin' });

const createAdmin = async (data) => {
  return User.create({ ...data, role: 'admin' });
};

const updateAdminById = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
};

const deleteAdminById = async (id) => {
  return User.findByIdAndDelete(id);
};

const createPatient = async (data) => {
  return User.create(data);
};

module.exports = {
  findAllTreatments, countAllTreatments,
  findAllPayments, countAllPayments,
  findAllFeedbacks, countAllFeedbacks,
  findAllPatients, countAllPatients, createPatient,
  findAllAdmins, countAllAdmins,
  createAdmin, updateAdminById, deleteAdminById,
  getDashboardStats,
  respondToFeedback
};
