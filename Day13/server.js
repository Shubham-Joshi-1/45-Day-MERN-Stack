const express = require('express');
const mongoose = require('mongoose');
const workExperienceRoutes = require('./routes/workExperienceRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.use('/api/work-experience', workExperienceRoutes);

// Error Handling
app.use(errorHandler);

// MongoDB
mongoose.connect('mongodb://localhost:27017/workExperienceDB')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error('DB Connection Failed:', err));
