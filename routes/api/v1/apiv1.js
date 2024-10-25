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

    const favicon = root.querySelector('link[rel="icon"]')?.getAttribute('href') || '';
    let faviconUrl = favicon;

    if (favicon && !favicon.startsWith('http')) {
      const baseUrl = new URL(url);
      faviconUrl = `${baseUrl.origin}${favicon}`;
    }

    const ogTitle = root.querySelector('meta[property="og:title"]')?.getAttribute('content') || root.querySelector('title')?.text || url;
    const ogDescription = root.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    let imageUrl = root.querySelector('meta[property="og:image"]')?.getAttribute('content') || root.querySelector('img')?.getAttribute('src');
    
    if (imageUrl && !imageUrl.startsWith('http')) {
      const baseUrl = new URL(url);
      imageUrl = `${baseUrl.origin}${imageUrl}`;
    }

    const previewHtml = `
      <div style="max-width: 300px; border: 1px solid; padding: 10px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 8px;">
        ${faviconUrl ? `<img src="${faviconUrl}" alt="Favicon" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 5px;">` : ''}
        ${imageUrl ? `<img src="${imageUrl}" alt="Preview Image" style="max-height: 200px; max-width: 270px; display: block; margin: 10px auto;">` : ''}
        <h2><a href="${url}" style="color: #007BFF; text-decoration: none;">${ogTitle}</a></h2>
        ${ogDescription ? `<p style="font-size: 14px; color: #555;">${ogDescription}</p>` : ''}
      </div>
    `;

    res.header('Content-Type', 'text/html');
    res.send(previewHtml);

  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).send('Error processing URL');
  }
});

export default router;
