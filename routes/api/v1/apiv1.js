import express from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('API v1 is working');
});

router.get('/urls/preview', async (req, res) => {
  try {
    const url = req.query.url;

    // Validate URL
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).send('Invalid URL');
    }

    const response = await fetch(url);
    const html = await response.text();
    const root = parse(html);

    // Optional chaining for null safety
    const ogUrl = root.querySelector('meta[property="og:url"]');
    const ogTitle = root.querySelector('meta[property="og:title"]');
    const ogImage = root.querySelector('meta[property="og:image"]');
    const ogDescription = root.querySelector('meta[property="og:description"]');

    let previewHtml = `
      <div class="preview-box">
        <img src="${ogImage?.getAttribute('content') || ''}" alt="Preview Image">
        <h2>${ogTitle?.getAttribute('content') || ''}</h2>
        ${ogDescription?.getAttribute('content') ? `<p>${ogDescription.getAttribute('content')}</p>` : ''}
        <a href="${ogUrl?.getAttribute('content') || ''}">Visit ${ogUrl?.getAttribute('content') || ''}</a>
      </div>
    `;
    
    res.header('Content-Type', 'text/html');
    res.send(previewHtml);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing URL');
  }
});

export default router;