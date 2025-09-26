// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB configuration - Make sure these are defined at the top level
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'taskDB';
let db;

const PRIORITIES = ['high', 'medium', 'low'];

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


// Helpers
const parseISODateStrict = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

const startOfDay = (d) => {
  const dd = new Date(d);
  dd.setHours(0, 0, 0, 0);
  return dd;
};

const nextDay = (d) => {
  const dd = startOfDay(d);
  dd.setDate(dd.getDate() + 1);
  return dd;
};

const isValidPriority = (p) => PRIORITIES.includes(p);

// Routes

// Create task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description = '', priority = 'low', dueDate } = req.body;
    if (!title || !isValidPriority(priority)) return res.status(400).json({ success: false, error: 'Invalid title or priority' });

    let due = dueDate ? parseISODateStrict(dueDate) : null;
    if (due && startOfDay(due) < startOfDay(new Date())) return res.status(400).json({ success: false, error: 'dueDate cannot be in the past' });

    const now = new Date();
    const task = { title, description, priority, completed: false, dueDate: due, createdAt: now, updatedAt: now, completedAt: null };
    const result = await db.collection('tasks').insertOne(task);
    const inserted = await db.collection('tasks').findOne({ _id: result.insertedId });
    res.status(201).json({ success: true, data: inserted });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
});

// Get tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { completed, priority, dueDate, page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;
    const query = {};

    if (completed === 'true' || completed === 'false') query.completed = completed === 'true';
    if (priority && isValidPriority(priority)) query.priority = priority;
    if (dueDate) {
      const parsed = parseISODateStrict(dueDate);
      if (parsed) query.dueDate = { $gte: startOfDay(parsed), $lt: nextDay(parsed) };
    }

    const p = Math.max(1, parseInt(page));
    const lim = Math.max(1, Math.min(100, parseInt(limit)));
    const tasks = await db.collection('tasks').find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip((p - 1) * lim)
      .limit(lim)
      .toArray();
    const total = await db.collection('tasks').countDocuments(query);

    res.json({ success: true, page: p, limit: lim, count: tasks.length, total, totalPages: Math.ceil(total / lim), data: tasks });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, error: 'Invalid id' });

    const updates = {};
    const { title, description, priority, dueDate, completed } = req.body;

    if (title) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (priority && isValidPriority(priority)) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate ? parseISODateStrict(dueDate) : null;
    if (completed !== undefined) { updates.completed = !!completed; updates.completedAt = !!completed ? new Date() : null; }

    updates.updatedAt = new Date();

    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: result.value });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, error: 'Invalid id' });
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
});

// Mark complete
app.put('/api/tasks/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, error: 'Invalid id' });
    const now = new Date();
    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { completed: true, completedAt: now, updatedAt: now } },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: result.value });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to mark task complete' });
  }
});

// Stats
app.get('/api/tasks/stats', async (req, res) => {
  try {
    const coll = db.collection('tasks');
    const total = await coll.countDocuments({});
    const completed = await coll.countDocuments({ completed: true });
    const overdue = await coll.countDocuments({ completed: false, dueDate: { $lt: startOfDay(new Date()) } });
    const byPriority = {};
    for (const p of PRIORITIES) {
      byPriority[p] = await coll.countDocuments({ priority: p });
    }
    const completionRate = total ? Math.round((completed / total) * 10000) / 100 : 0;
    res.json({ success: true, total, completed, pending: total - completed, completionRate, overdue, byPriority });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// Connect to MongoDB - Fixed without deprecated options
MongoClient.connect(MONGO_URL)
  .then(client => {
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Task API running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });