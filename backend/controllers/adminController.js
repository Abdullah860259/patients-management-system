const adminService = require('../services/adminService');
const Payment = require('../models/Payment');
const generatePDF = require('../pdf/generatePrescription');
const generateTreatmentPDF = require('../pdf/generateTreatment');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

exports.getDashboard = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const stats = await adminService.getDashboardStats(isAdmin ? req.user.id : null);
    const promises = [adminService.findAllTreatments({}, '-createdAt', 5, 0)];
    if (!isAdmin) {
      promises.push(adminService.findAllFeedbacks({}, '-createdAt', 5, 0));
    }
    const [recentTreatments, recentFeedbacks] = await Promise.all(promises);
    res.status(200).json({ success: true, stats, recentTreatments, ...(recentFeedbacks ? { recentFeedbacks } : {}) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllTreatments = async (req, res) => {
  try {
    const { sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = {};

    const [treatments, total] = await Promise.all([
      adminService.findAllTreatments(query, sortBy, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)),
      adminService.countAllTreatments(query)
    ]);

    res.status(200).json({
      success: true, count: treatments.length, total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page), treatments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getTreatmentStats = async (req, res) => {
  try {
    const total = await adminService.countAllTreatments({});
    res.status(200).json({ success: true, stats: { total } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createTreatment = async (req, res) => {
  try {
    const { name, description, cost, durationDays, minimumAdvanceAmount } = req.body;
    if (!name || !description || !cost) {
      return res.status(400).json({ success: false, message: 'Name, description, and cost are required' });
    }
    const Treatment = require('../models/Treatment');
    const treatment = await Treatment.create({ name, description, cost, durationDays, minimumAdvanceAmount });
    res.status(201).json({ success: true, treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateTreatment = async (req, res) => {
  try {
    const { name, description, cost, durationDays, minimumAdvanceAmount } = req.body;
    const Treatment = require('../models/Treatment');
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, {
      name, description, cost, durationDays, minimumAdvanceAmount
    }, { new: true, runValidators: true });
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    res.status(200).json({ success: true, treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteTreatment = async (req, res) => {
  try {
    const Treatment = require('../models/Treatment');
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    res.status(200).json({ success: true, message: 'Treatment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const { sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = {};
    if (req.user.role === 'admin') query.processedBy = req.user.id;

    const [payments, total] = await Promise.all([
      adminService.findAllPayments(query, sortBy, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)),
      adminService.countAllPayments(query)
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

exports.createPayment = async (req, res) => {
  try {
    const { patient, treatment, paidAmount, paymentMethod, paymentDate, notes } = req.body;
    if (!patient || !treatment || !paidAmount || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Patient, treatment, paid amount, and payment method are required' });
    }

    const Treatment = require('../models/Treatment');
    const Payment = require('../models/Payment');
    const User = require('../models/User');

    const treatmentDoc = await Treatment.findById(treatment);
    if (!treatmentDoc) {
      return res.status(404).json({ success: false, message: 'Treatment not found' });
    }

    if (paidAmount > treatmentDoc.cost) {
      return res.status(400).json({ success: false, message: `Payment amount ($${paidAmount}) cannot exceed treatment cost ($${treatmentDoc.cost})` });
    }

    const user = await User.findById(patient);
    const ongoingEntry = user.treatments.find(t => t.treatment.toString() === treatment && t.status === 'ongoing');

    if (ongoingEntry) {
      if (ongoingEntry.totalPaid + paidAmount > treatmentDoc.cost) {
        const remaining = treatmentDoc.cost - ongoingEntry.totalPaid;
        return res.status(400).json({ success: false, message: `Total paid ($${ongoingEntry.totalPaid + paidAmount}) would exceed treatment cost ($${treatmentDoc.cost}). Remaining balance: $${remaining}` });
      }
    }

    const payment = await Payment.create({
      patient, treatment, paidAmount, paymentMethod,
      paymentDate, notes,
      processedBy: req.user.id
    });

    if (ongoingEntry) {
      ongoingEntry.payments.push(payment._id);
      ongoingEntry.totalPaid = (ongoingEntry.totalPaid || 0) + paidAmount;
      if (ongoingEntry.totalPaid >= treatmentDoc.cost) {
        ongoingEntry.status = 'completed';
      }
    } else {
      user.treatments.push({
        treatment: treatmentDoc._id,
        name: treatmentDoc.name,
        status: paidAmount >= treatmentDoc.cost ? 'completed' : 'ongoing',
        totalCost: treatmentDoc.cost,
        totalPaid: paidAmount,
        payments: [payment._id]
      });
    }
    await user.save();

    const populated = await Payment.findById(payment._id)
      .populate({ path: 'treatment', select: 'name cost' })
      .populate('patient', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName');

    res.status(201).json({ success: true, payment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getPaymentStats = async (req, res) => {
  try {
    const match = {};
    if (req.user.role === 'admin') match.processedBy = new mongoose.Types.ObjectId(req.user.id);

    const [totalRevenue] = await Promise.all([
      Payment.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const { status, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;

    const [feedbacks, total] = await Promise.all([
      adminService.findAllFeedbacks(query, sortBy, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)),
      adminService.countAllFeedbacks(query)
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

exports.getFeedbackStats = async (req, res) => {
  try {
    const total = await adminService.countAllFeedbacks({});
    const submitted = await adminService.countAllFeedbacks({ status: 'Submitted' });
    const resolved = await adminService.countAllFeedbacks({ status: 'Resolved' });
    res.status(200).json({ success: true, stats: { total, submitted, resolved } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.respondToFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Response message is required' });
    }
    const feedback = await adminService.respondToFeedback(req.params.id, message, req.user.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.status(200).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const { search, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const createdBy = req.user.role === 'admin' ? req.user.id : null;

    const [patients, total] = await Promise.all([
      adminService.findAllPatients(query, sortBy, parseInt(limit), (parseInt(page) - 1) * parseInt(limit), createdBy),
      adminService.countAllPatients(query, createdBy)
    ]);

    res.status(200).json({
      success: true, count: patients.length, total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page), patients
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender } = req.body;
    if (!firstName || !lastName || !email || !phone || !dateOfBirth || !gender) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await require('../services/authService').findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const patient = await require('../services/adminService').createPatient({
      firstName, lastName, email, password: 'temp123', phone, dateOfBirth, gender,
      role: 'patient', createdBy: req.user.id
    });

    patient.password = String(patient.idNumber);
    await patient.save();

    const Treatment = require('../models/Treatment');
    const Payment = require('../models/Payment');
    const checkup = await Treatment.findOne({ name: { $regex: /checkup/i } });
    if (checkup) {
      const payment = await Payment.create({
        patient: patient._id,
        treatment: checkup._id,
        paidAmount: checkup.cost,
        paymentMethod: 'Cash',
        paymentDate: new Date(),
        processedBy: req.user.id,
        notes: 'Auto-created on patient registration'
      });

      patient.treatments.push({
        treatment: checkup._id,
        name: checkup.name,
        status: 'completed',
        totalCost: checkup.cost,
        totalPaid: checkup.cost,
        payments: [payment._id]
      });
      await patient.save();
    }

    res.status(201).json({ success: true, patient: { ...patient.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const Treatment = require('../models/Treatment');
    const Payment = require('../models/Payment');
    const User = require('../models/User');
    const Feedback = require('../models/Feedback');

    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.paymentDate = {};
      if (startDate) dateFilter.paymentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.paymentDate.$lte = new Date(endDate);
    }
    const paymentMatch = Object.keys(dateFilter).length ? { $match: dateFilter } : null;

    const buildPipeline = (extraStages = []) => {
      const stages = [];
      if (paymentMatch) stages.push(paymentMatch);
      stages.push(...extraStages);
      return stages;
    };

    const [
      revenueByMonth,
      paymentCountByMonth,
      treatmentPopularity,
      treatmentRevenue,
      paymentMethodDist,
      paymentMethodOverTime,
      patientGrowth,
      patientGenderDist,
      feedbackRatings,
      feedbackByCategory,
      feedbackByMonth,
      totalRevenue,
      totalPaymentsCount,
      totalPatients,
      totalTreatments,
      adminRevenue,
      adminPaymentCount,
      adminPatientsCreated,
      adminMethodBreakdown
    ] = await Promise.all([
      Payment.aggregate(buildPipeline([
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } }, revenue: { $sum: '$paidAmount' } } },
        { $sort: { _id: 1 } }
      ])),
      Payment.aggregate(buildPipeline([
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])),
      Payment.aggregate(buildPipeline([
        { $group: { _id: '$treatment', count: { $sum: 1 }, total: { $sum: '$paidAmount' } } },
        { $lookup: { from: 'treatments', localField: '_id', foreignField: '_id', as: 'treatment' } },
        { $unwind: '$treatment' },
        { $project: { name: '$treatment.name', count: 1, total: 1 } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])),
      Payment.aggregate(buildPipeline([
        { $group: { _id: '$treatment', count: { $sum: 1 }, total: { $sum: '$paidAmount' } } },
        { $lookup: { from: 'treatments', localField: '_id', foreignField: '_id', as: 'treatment' } },
        { $unwind: '$treatment' },
        { $project: { name: '$treatment.name', count: 1, total: 1 } },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ])),
      Payment.aggregate(buildPipeline([
        { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$paidAmount' } } },
        { $sort: { total: -1 } }
      ])),
      Payment.aggregate(buildPipeline([
        { $group: { _id: { month: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } }, method: '$paymentMethod' }, count: { $sum: 1 }, total: { $sum: '$paidAmount' } } },
        { $sort: { '_id.month': 1 } }
      ])),
      User.aggregate([
        { $match: { role: 'patient' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      User.aggregate([
        { $match: { role: 'patient' } },
        { $group: { _id: '$gender', count: { $sum: 1 } } }
      ]),
      Feedback.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Feedback.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
        { $sort: { count: -1 } }
      ]),
      Feedback.aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
        { $sort: { _id: 1 } }
      ]),
      Payment.aggregate(buildPipeline([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }])),
      Payment.aggregate(buildPipeline([{ $group: { _id: null, count: { $sum: 1 } } }])),
      User.countDocuments({ role: 'patient' }),
      Treatment.countDocuments(),
      Payment.aggregate(buildPipeline([
        { $group: { _id: '$processedBy', revenue: { $sum: '$paidAmount' }, count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'admin' } },
        { $unwind: '$admin' },
        { $project: { name: { $concat: ['$admin.firstName', ' ', '$admin.lastName'] }, revenue: 1, count: 1 } },
        { $sort: { revenue: -1 } }
      ])),
      Payment.aggregate(buildPipeline([
        { $group: { _id: '$processedBy', count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'admin' } },
        { $unwind: '$admin' },
        { $project: { name: { $concat: ['$admin.firstName', ' ', '$admin.lastName'] }, count: 1 } },
        { $sort: { count: -1 } }
      ])),
      User.aggregate([
        { $match: { role: 'patient', createdBy: { $exists: true } } },
        { $group: { _id: '$createdBy', count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'admin' } },
        { $unwind: '$admin' },
        { $project: { name: { $concat: ['$admin.firstName', ' ', '$admin.lastName'] }, count: 1 } },
        { $sort: { count: -1 } }
      ]),
      Payment.aggregate(buildPipeline([
        { $group: { _id: { admin: '$processedBy', method: '$paymentMethod' }, count: { $sum: 1 }, revenue: { $sum: '$paidAmount' } } },
        { $lookup: { from: 'users', localField: '_id.admin', foreignField: '_id', as: 'admin' } },
        { $unwind: '$admin' },
        { $project: { name: { $concat: ['$admin.firstName', ' ', '$admin.lastName'] }, method: '$_id.method', count: 1, revenue: 1 } },
        { $sort: { revenue: -1 } }
      ]))
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        revenueByMonth,
        paymentCountByMonth,
        treatmentPopularity,
        treatmentRevenue,
        paymentMethodDist,
        paymentMethodOverTime,
        patientGrowth,
        patientGenderDist,
        feedbackRatings,
        feedbackByCategory,
        feedbackByMonth,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalPayments: totalPaymentsCount[0]?.count || 0,
        totalPatients,
        totalTreatments,
        adminRevenue,
        adminPaymentCount,
        adminPatientsCreated,
        adminMethodBreakdown
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.generatePrescription = async (req, res) => {
  try {
    const User = require('../models/User');
    const patient = await User.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const dob = new Date(patient.dateOfBirth);
    const age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));

    const Treatment = require('../models/Treatment');
    const Payment = require('../models/Payment');
    const checkup = await Treatment.findOne({ name: { $regex: /checkup/i } });
    if (checkup) {
      const payment = await Payment.create({
        patient: patient._id,
        treatment: checkup._id,
        paidAmount: checkup.cost,
        paymentMethod: 'Cash',
        paymentDate: new Date(),
        processedBy: req.user.id,
        notes: 'Auto-created on prescription print'
      });

      patient.treatments.push({
        treatment: checkup._id,
        name: checkup.name,
        status: 'completed',
        totalCost: checkup.cost,
        totalPaid: checkup.cost,
        payments: [payment._id]
      });
      await patient.save();
    }

    const pdfBuffer = await generatePDF({
      name: `${patient.firstName} ${patient.lastName}`,
      age: String(age),
      sex: patient.gender,
      adminName: `${req.user.firstName} ${req.user.lastName}`,
      adminEmail: req.user.email,
      patientEmail: patient.email
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
      "Content-Disposition": `inline; filename=prescription_${patient._id}.pdf`
    });

    console.log(pdfBuffer);

    res.end(pdfBuffer);

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.generateTreatmentSummary = async (req, res) => {
  try {
    const Payment = require('../models/Payment');
    const Treatment = require('../models/Treatment');

    const payment = await Payment.findById(req.params.id)
      .populate('patient', 'firstName lastName email')
      .populate('treatment', 'name cost')
      .populate('processedBy', 'firstName lastName email');

    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    const allPayments = await Payment.find({ patient: payment.patient._id, treatment: payment.treatment._id });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const remaining = Math.max(0, payment.treatment.cost - totalPaid);

    const pdfBuffer = await generateTreatmentPDF({
      patientName: `${payment.patient.firstName} ${payment.patient.lastName}`,
      patientEmail: payment.patient.email,
      treatmentName: payment.treatment.name,
      paidAmount: `$${payment.paidAmount.toLocaleString()}`,
      remainingAmount: `$${remaining.toLocaleString()}`,
      adminName: `${payment.processedBy.firstName} ${payment.processedBy.lastName}`,
      adminEmail: payment.processedBy.email
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
      "Content-Disposition": `inline; filename=treatment_summary_${payment._id}.pdf`
    });

    res.end(pdfBuffer);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
