const mongoose = require('mongoose');

const PartySchema = new mongoose.Schema({
    partyCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    hostId: {
        type: String,
        required: true
    },
    currentUrl: {
        type: String,
        default: ''
    },
    isPlaying: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Number,
        default: 0
    },
    videoMeetingId: {
        type: String,
        default: null
    },
    participants: [{
        userId: String,
        username: String,
        avatar: String,
        socketId: String,
        isHost: Boolean
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Expire after 24 hours
    }
});

module.exports = mongoose.model('Party', PartySchema);
