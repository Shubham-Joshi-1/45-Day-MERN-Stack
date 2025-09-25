const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;


const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;


app.use(express.json());


// post if used to create data

app.post('/api/projects', async (req, res) => {
  try {
    const project = req.body;
    console.log("📩 Incoming project:", project); 

    if (!project.title || !project.description) {
      return res.status(400).json({ success: false, error: "Title and description are required" });
    }

    project.createdAt = new Date();
    project.updatedAt = new Date();

    const result = await db.collection('projects').insertOne(project);
    console.log("✅ Insert result:", result); 

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { ...project, _id: result.insertedId }
    });
  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ success: false, error: "Failed to create project" });
  }
});


// get is used to read data

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.collection('projects').find({}).toArray();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ success: false, error: "Failed to fetch projects" });
  }
});



app.get('/api/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error("❌ Error fetching project:", err);
    res.status(500).json({ success: false, error: "Failed to fetch project" });
  }
});

// put - used for update the data

app.put('/api/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    updateData.updatedAt = new Date();

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, message: "Project updated successfully" });
  } catch (err) {
    console.error("❌ Error updating project:", err);
    res.status(500).json({ success: false, error: "Failed to update project" });
  }
});


// delete - used to delete the data

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting project:", err);
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
});


MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));
