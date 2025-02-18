const express = require('express');
const axios = require('axios');
const sharp = require('sharp');

const app = express();

app.get('/image-proxy', async (req, res) => {
  const imageUrl = req.query.url;
  const quality = parseInt(req.query.quality) || 80; 

  if (!imageUrl) {
    return res.status(400).send('Image URL is required');
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://mangadex.org/',
        'Origin': 'https://mangadex.org'
      }
    });

    const buffer = Buffer.from(response.data);
    
   
    const compressedImage = await sharp(buffer)
      .jpeg({ quality }) 
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(compressedImage);
  } catch (error) {
    console.error('Error fetching or processing image:', error.message);
    res.status(500).send('Error fetching or processing image.');
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
