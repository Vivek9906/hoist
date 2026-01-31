require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/party', require('./routes/party.routes'));
app.use('/api/video', require('./routes/video.routes'));
app.use('/api/proxy', require('./routes/proxy.routes'));

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for now, restrict in production
        methods: ['GET', 'POST']
    }
});

// Database Connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoist'; // Fallback to local
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        // process.exit(1); // Optional: exit if DB fails
    }
};
connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('Hoist Server is Running');
});

// Socket Event Handlers
// Socket Event Handlers
require('./socket/socketHandlers')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
