const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/fetch', async (req, res) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: 'No URL provided' });

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            responseType: 'text' // Ensure we get text
        });

        let html = response.data;
        // Inject base tag to fix relative links
        // Simple regex replace; for robustness consider a parser but this is "nuclear" fix level
        if (html.includes('<head>')) {
            html = html.replace('<head>', `<head><base href="${url}">`);
        } else {
            html = `<base href="${url}">` + html;
        }

        res.send(html);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

module.exports = router;
