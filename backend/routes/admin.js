const express = require('express');
const adminController = require('../controllers/adminController');
const adminManagementController = require('../controllers/adminManagementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/dashboard', authorize('admin', 'ceo'), adminController.getDashboard);
router.get('/analytics', authorize('ceo'), adminController.getAnalytics);

router.get('/treatments', authorize('admin', 'ceo'), adminController.getAllTreatments);
router.post('/treatments', authorize('ceo'), adminController.createTreatment);
router.put('/treatments/:id', authorize('ceo'), adminController.updateTreatment);
router.delete('/treatments/:id', authorize('ceo'), adminController.deleteTreatment);
router.get('/treatments/stats', authorize('admin', 'ceo'), adminController.getTreatmentStats);

router.get('/payments', authorize('admin', 'ceo'), adminController.getAllPayments);
router.post('/payments', authorize('admin', 'ceo'), adminController.createPayment);
router.get('/payments/stats', authorize('admin', 'ceo'), adminController.getPaymentStats);
router.get('/payments/:id/treatment-summary', authorize('admin', 'ceo'), adminController.generateTreatmentSummary);

router.get('/feedback', authorize('ceo'), adminController.getAllFeedbacks);
router.get('/feedback/stats', authorize('ceo'), adminController.getFeedbackStats);
router.put('/feedback/:id/respond', authorize('ceo'), adminController.respondToFeedback);

router.get('/patients', authorize('admin', 'ceo'), adminController.getAllPatients);
router.post('/patients', authorize('admin', 'ceo'), adminController.createPatient);
router.get('/patients/:id/prescription', authorize('admin', 'ceo'), adminController.generatePrescription);

router.get('/admins', authorize('ceo'), adminManagementController.getAllAdmins);
router.post('/admins', authorize('ceo'), adminManagementController.createAdmin);
router.put('/admins/:id', authorize('ceo'), adminManagementController.updateAdmin);
router.delete('/admins/:id', authorize('ceo'), adminManagementController.deleteAdmin);

module.exports = router;
