const adminService = require('../services/adminService');
const authService = require('../services/authService');

exports.getAllAdmins = async (req, res) => {
  try {
    const { search, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [admins, total] = await Promise.all([
      adminService.findAllAdmins(query, sortBy, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)),
      adminService.countAllAdmins(query)
    ]);

    res.status(200).json({
      success: true, count: admins.length, total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page), admins
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth, gender } = req.body;
    if (!firstName || !lastName || !email || !password || !phone || !dateOfBirth || !gender) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const admin = await adminService.createAdmin({
      firstName, lastName, email, password, phone, dateOfBirth, gender
    });

    res.status(201).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender } = req.body;
    const data = {};
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) {
      const existing = await authService.findUserByEmail(email);
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Email already in use by another user' });
      }
      data.email = email;
    }
    if (phone) data.phone = phone;
    if (dateOfBirth) data.dateOfBirth = dateOfBirth;
    if (gender) data.gender = gender;

    const admin = await adminService.updateAdminById(req.params.id, data);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await adminService.deleteAdminById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({ success: true, message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
