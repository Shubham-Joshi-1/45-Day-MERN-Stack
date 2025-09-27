const validateWorkExperience = (req, res, next) => {
  const errors = [];

  if (!req.body.company?.trim()) errors.push('Company name is required');
  if (!req.body.position?.trim()) errors.push('Position is required');
  if (!req.body.startDate) errors.push('Start date is required');

  if (req.body.endDate && req.body.startDate &&
    new Date(req.body.endDate) < new Date(req.body.startDate)) {
    errors.push('End date must be after start date');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = validateWorkExperience;
