const express = require('express');
const shortid = require('shortid');
const app = express();

app.use(express.json());

const urlMap = {};

app.post('/shorten', (req, res) => {
    // Change `longUrl` to `originalUrl` to match the Postman request body.
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'originalUrl is required' });
    }

    const shortCode = shortid.generate();
    urlMap[shortCode] = originalUrl;

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    res.json({ shortUrl });
});

app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const longUrl = urlMap[shortCode];

    if (longUrl) {
        return res.redirect(longUrl);
    } else {
        return res.status(404).json({ error: 'Short URL not found' });
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
