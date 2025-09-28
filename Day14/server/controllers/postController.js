const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, content, author, tags = [], published = false } = req.body;
    const post = await Post.create({ title, content, author, tags, published });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch {
    res.status(500).json({ success: false, error: "Server error" });
  }
};
