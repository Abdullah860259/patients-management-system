const Treatment = require('../models/Treatment');

const findTreatments = async (query, sortBy, limit, skip) => {
  return Treatment.find(query)
    .sort(sortBy)
    .limit(limit)
    .skip(skip);
};

const countTreatments = async (query) => {
  return Treatment.countDocuments(query);
};

const findTreatmentById = async (treatmentId) => {
  return Treatment.findById(treatmentId);
};

const getTreatmentStats = async () => {
  const [total, costAgg] = await Promise.all([
    Treatment.countDocuments(),
    Treatment.aggregate([
      { $group: { _id: null, total: { $sum: '$cost' } } }
    ])
  ]);

  return {
    totalTreatments: total,
    totalCost: costAgg.length > 0 ? costAgg[0].total : 0
  };
};

module.exports = {
  findTreatments,
  countTreatments,
  findTreatmentById,
  getTreatmentStats
};
