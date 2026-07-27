const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
