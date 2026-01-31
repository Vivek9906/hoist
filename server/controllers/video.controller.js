const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

// Generate a token for VideoSDK
exports.getToken = (req, res) => {
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

    if (!API_KEY || !SECRET_KEY) {
        return res.status(500).json({ error: "VideoSDK keys not configured on server" });
    }

    const options = {
        expiresIn: '24h',
        algorithm: 'HS256'
    };

    const payload = {
        apikey: API_KEY,
        permissions: ["allow_join", "allow_mod"], // Host should have allow_mod, others maybe just join
        version: 2, // VideoSDK version
        // roles: [] // Optional
    };

    try {
        const token = jwt.sign(payload, SECRET_KEY, options);
        res.json({ token });
    } catch (error) {
        console.error("Token Generation Error:", error);
        res.status(500).json({ error: "Failed to generate token" });
    }
};

exports.createMeeting = async (req, res) => {
    // 1. Generate Token
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

    const options = { expiresIn: '10m', algorithm: 'HS256' };
    const payload = { apikey: API_KEY, permissions: ["allow_join", "allow_mod"], version: 2 };
    const token = jwt.sign(payload, SECRET_KEY, options);

    // 2. Call VideoSDK API to create meeting
    try {
        const response = await fetch('https://api.videosdk.live/v2/rooms', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const data = await response.json();

        if (data.roomId) {
            res.json({ meetingId: data.roomId });
        } else {
            console.error("VideoSDK API Error:", data);
            res.status(500).json({ error: "Failed to create meeting ID" });
        }
    } catch (error) {
        console.error("Create Meeting Error:", error);
        res.status(500).json({ error: "Server failed to contact VideoSDK" });
    }
};
