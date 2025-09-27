const WorkExperience = require('../models/WorkExperience');

// CREATE
const createWorkExperience = async (req, res, next) => {
  try {
    const workExperience = new WorkExperience(req.body);
    await workExperience.save();
    res.status(201).json({ success: true, data: workExperience, message: 'Work experience created successfully' });
  } catch (error) {
    next(error);
  }
};

// READ ALL (with filters, pagination)
const getWorkExperiences = async (req, res, next) => {
  try {
    const { current, technology, company, sort = '-startDate', limit = 10, page = 1 } = req.query;

    let query = {};
    if (current !== undefined) query.current = current === 'true';
    if (technology) query.technologies = { $in: technology.split(',') };
    if (company) query.company = new RegExp(company, 'i');

    const experiences = await WorkExperience.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await WorkExperience.countDocuments(query);

    res.json({
      success: true,
      data: experiences,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// READ SINGLE
const getWorkExperience = async (req, res, next) => {
  try {
    const experience = await WorkExperience.findById(req.params.id);
    if (!experience) return res.status(404).json({ success: false, message: 'Work experience not found' });
    res.json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateWorkExperience = async (req, res, next) => {
  try {
    const updated = await WorkExperience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Work experience not found' });
    res.json({ success: true, data: updated, message: 'Work experience updated successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteWorkExperience = async (req, res, next) => {
  try {
    const deleted = await WorkExperience.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Work experience not found' });
    res.json({ success: true, message: 'Work experience deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createWorkExperience, getWorkExperiences, getWorkExperience, updateWorkExperience, deleteWorkExperience };
