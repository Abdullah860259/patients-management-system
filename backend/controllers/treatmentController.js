const treatmentService = require('../services/treatmentService');

exports.getAll = async (req, res) => {
  try {
    const { sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = {};

    const [treatments, total] = await Promise.all([
      treatmentService.findTreatments(query, sortBy, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)),
      treatmentService.countTreatments(query)
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

exports.getStats = async (req, res) => {
  try {
    const stats = await treatmentService.getTreatmentStats();
    res.status(200).json({ success: true, stats });  
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const treatment = await treatmentService.findTreatmentById(req.params.id);
    if (!treatment) {
      return res.status(404).json({ success: false, message: 'Treatment not found' });
    }
    res.status(200).json({ success: true, treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
