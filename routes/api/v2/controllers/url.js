import express from 'express';
const router = express.Router();
import getURLPreview from '../utils/urlPreviews.js';

router.get('/preview', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const previewData = await getURLPreview(url);
    res.status(200).json(previewData);
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    res.status(500).json({ error: 'Failed to retrieve URL preview' });
  }
});

export default router;
