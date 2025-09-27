const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name too long']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position title too long']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  current: {
    type: Boolean,
    default: false
  },
  technologies: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('WorkExperience', workExperienceSchema);
