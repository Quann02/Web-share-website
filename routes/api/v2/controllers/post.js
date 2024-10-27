import express from 'express';
import mongoose from 'mongoose';
import getURLPreview from '../utils/urlPreviews.js';

const router = express.Router();

const Post = mongoose.model('Post', new mongoose.Schema({
  url: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
}));

router.post('/', async (req, res) => {
  try {
    const { url, description } = req.body;


    const newPost = new Post({
      url,
      description,
      createdAt: new Date()
    });

    await newPost.save();

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();

    const postData = await Promise.all(
      posts.map(async post => {
        try {
          const htmlPreview = await getURLPreview(post.url);
          return { description: post.description, htmlPreview };
        } catch (error) {
          return { description: post.description, htmlPreview: `Error: ${error.message}` };
        }
      })
    );

    res.json(postData);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;
