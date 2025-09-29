const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  status: { type: String, default: 'active' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  startDate: Date,
  endDate: Date,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  milestones: [
    {
      name: String,
      date: Date,
      completed: Boolean
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
