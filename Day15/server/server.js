const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // if you have DB config
const taskRoutes = require('./routes/tasksRoutes')  // Add .js extension
const authRoutes = require('./routes/authRoutes'); // if you have user routes

const app = express();
dotenv.config();
connectDB();

app.use(express.json());


app.use('/api/tasks', taskRoutes);
app.use('/api/users', authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
