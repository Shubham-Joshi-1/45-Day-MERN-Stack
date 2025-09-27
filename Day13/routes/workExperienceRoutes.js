const express = require('express');
const router = express.Router();
const { createWorkExperience, getWorkExperiences, getWorkExperience, updateWorkExperience, deleteWorkExperience } = require('../controllers/workExperienceController');
const validateWorkExperience = require('../middleware/validation');

router.route('/')
  .get(getWorkExperiences)
  .post(validateWorkExperience, createWorkExperience);

router.route('/:id')
  .get(getWorkExperience)
  .put(validateWorkExperience, updateWorkExperience)
  .delete(deleteWorkExperience);

module.exports = router;
