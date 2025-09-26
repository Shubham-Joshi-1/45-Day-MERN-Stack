const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'blogDB';
let db;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

//post - to create post

app.post('/api/posts', async (req, res) => {
  try {
    const post = req.body;
    console.log("Incoming post:", post);

    if (!post.title || !post.content || !post.author) {
      return res.status(400).json({ success: false, error: "Title, content and author are required" });
    }

    post.tags = post.tags || [];
    post.published = post.published || false;
    post.createdAt = new Date();
    post.updatedAt = new Date();

    const result = await db.collection('posts').insertOne(post);
    console.log("Insert result:", result);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: { ...post, _id: result.insertedId }
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ success: false, error: "Failed to create post" });
  }
});


//GET - To get All the data

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.collection('posts').find({}).toArray();
    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, error: "Failed to fetch posts" });
  }
});


//GET with ID - TO get data of a particular ID

app.get('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ success: false, error: "Failed to fetch post" });
  }
});


// PUT - For Updating the Data of post

app.put('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    updateData.updatedAt = new Date();

    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({ success: true, message: "Post updated successfully" });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ success: false, error: "Failed to update post" });
  }
});

// DELETE - just to delete the post

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ success: false, error: "Failed to delete post" });
  }
});


MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB connection failed:", err));
