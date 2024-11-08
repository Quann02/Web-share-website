import fetch from 'node-fetch';
import parser from 'node-html-parser';

async function getURLPreview(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }
    
    const html = await response.text();
    const root = parser.parse(html);
    
    const title = root.querySelector('title')?.text || 'No title available';
    const description = root.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description available';
    const image = root.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

    return {
      title,
      description,
      image,
      url
    };
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    throw new Error('Could not generate URL preview');
  }
}

export default getURLPreview;
