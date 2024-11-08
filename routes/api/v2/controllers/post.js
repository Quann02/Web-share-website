import express from 'express';
const router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

router.get('/', async (req, res) => {
  try {
    const { Post } = req.models;
    const posts = await Post.find({});
    const formattedPosts = posts.map(post => ({
      ...post._doc,
      time_posted: post.created_date.toLocaleString()
    }));
    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { Post } = req.models;
    const { url, description } = req.body;
    if (!isValidUrl(url)) {
      return res.status(400).json({ status: "error", error: "Invalid URL format" });
    }
    const previewData = await getURLPreview(url);
    const newPost = new Post({
      url,
      description,
      title: previewData.title,
      previewDescription: previewData.description,
      image: previewData.image,
      created_date: new Date()
    });
    await newPost.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    if (error.message === 'Invalid URL') {
      res.status(400).json({ status: "error", error: "Could not generate preview: Invalid URL" });
    } else {
      console.error("Error saving post:", error);
      res.status(500).json({ status: "error", error: error.message });
    }
  }
});

export default router;
