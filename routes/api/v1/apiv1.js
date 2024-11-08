// routes/api/v1/apiv1.js
import express from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API v1 is working');
});

router.get('/urls/preview', async (req, res) => {
  try {
    const url = req.query.url;

    if (!url || !url.startsWith('http')) {
      return res.status(400).send('Invalid URL');
    }

    const response = await fetch(url);
    const html = await response.text();
    const root = parse(html);

    // Extract Open Graph data
    const ogTitle = root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                    root.querySelector('title')?.text || url;

    const ogDescription = root.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                          root.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    let ogImage = root.querySelector('meta[property="og:image"]')?.getAttribute('content');

    // Handle relative image URLs
    if (ogImage && !ogImage.startsWith('http')) {
      const baseUrl = new URL(url);
      ogImage = new URL(ogImage, baseUrl).href;
    }

    // Creative Component: Extract Favicon
    let favicon = root.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                  root.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') || '';
    if (favicon && !favicon.startsWith('http')) {
      const baseUrl = new URL(url);
      favicon = new URL(favicon, baseUrl).href;
    }

    // Construct HTML preview
    let previewHtml = `
      <div style="max-width: 300px; border: solid 1px; padding: 10px; text-align: center; 
                  box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 8px;">
    `;

    if (favicon) {
      previewHtml += `<img src="${favicon}" alt="Favicon" style="width: 16px; height: 16px; 
                      display: inline-block; vertical-align: middle; margin-right: 5px;">`;
    }

    previewHtml += `<a href="${url}" style="text-decoration: none; color: inherit;">`;

    if (ogTitle) {
      previewHtml += `<h2 style="font-size: 18px; margin: 10px 0;">${ogTitle}</h2>`;
    }

    if (ogImage) {
      previewHtml += `<img src="${ogImage}" alt="Preview Image" style="max-height: 200px; 
                      max-width: 270px; display: block; margin: 10px auto;">`;
    }

    previewHtml += `</a>`;

    if (ogDescription) {
      previewHtml += `<p style="font-size: 14px; color: #555;">${ogDescription}</p>`;
    }

    previewHtml += `</div>`;

    res.header('Content-Type', 'text/html');
    res.send(previewHtml);

  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).send('Error processing URL');
  }
});

export default router;
