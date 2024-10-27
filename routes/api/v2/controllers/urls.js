import express from 'express';
import getURLPreview from '../utils/urlPreviews.js';

var router = express.Router();

router.get('/preview', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const previewHtml = await getURLPreview(url);
    res.status(200).send(previewHtml);
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    res.status(500).json({ error: 'Failed to fetch URL preview' });
  }
});

export default router;
