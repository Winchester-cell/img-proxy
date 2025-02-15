const express = require('express');
const axios = require('axios');
const app = express();

app.get('/image-proxy', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Image URL is required');
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://mangadex.org/',  // وانمود می‌کنیم که درخواست از خود مانگادکس اومده
        'Origin': 'https://mangadex.org'
      }
    });

    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching image:', error.message);
    res.status(500).send('Error fetching image.');
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
