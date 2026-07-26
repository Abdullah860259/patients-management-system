const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const treatmentController = require('../controllers/treatmentController');
const paymentController = require('../controllers/paymentController');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();
router.use(protect);

router.get('/treatments/stats', treatmentController.getStats);
router.get('/treatments', treatmentController.getAll);
router.get('/treatments/:id', treatmentController.getById);

router.get('/payments/stats', paymentController.getStats);
router.get('/payments', paymentController.getAll);
router.get('/payments/:id', paymentController.getById);

const validateFeedback = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

router.get('/feedback/stats', feedbackController.getStats);
router.get('/feedback', feedbackController.getAll);
router.post('/feedback', validateFeedback, feedbackController.create);
router.get('/feedback/:id', feedbackController.getById);

module.exports = router;
