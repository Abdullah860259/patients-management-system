const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000
};

const sendTokenResponse = (user, res, statusCode) => {
  const token = user.getSignedJwtToken();

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id, idNumber: user.idNumber, firstName: user.firstName, lastName: user.lastName,
      email: user.email, role: user.role, phone: user.phone
    }
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, dateOfBirth, gender, address, emergencyContact } = req.body;

    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await authService.createUser({
      firstName, lastName, email, password, phone, dateOfBirth, gender, address, emergencyContact
    });

    sendTokenResponse(user, res, 201);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, res, 200);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.findUserById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000)
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await authService.findUserByEmail(req.user.email);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    await authService.changeUserPassword(req.user.id, newPassword);
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender, address, emergencyContact, dentalHistory, allergies } = req.body;
    const user = await authService.updateUserById(req.user.id, {
      firstName, lastName, phone, dateOfBirth, gender, address, emergencyContact, dentalHistory, allergies
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
