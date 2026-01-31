const Party = require('../models/Party.model');

exports.createParty = async (req, res) => {
    try {
        const { hostId, username, avatar } = req.body;

        // Generate unique 6-char code
        let partyCode;
        let isUnique = false;
        while (!isUnique) {
            partyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existing = await Party.findOne({ partyCode });
            if (!existing) isUnique = true;
        }

        const newParty = new Party({
            partyCode,
            hostId,
            participants: [{
                userId: hostId,
                username,
                avatar,
                isHost: true
            }]
        });

        await newParty.save();

        res.status(201).json({ success: true, partyCode, party: newParty });

    } catch (error) {
        console.error('Create Party Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getParty = async (req, res) => {
    try {
        const { code } = req.params;
        const party = await Party.findOne({ partyCode: code });

        if (!party) {
            return res.status(404).json({ success: false, message: 'Party not found' });
        }

        res.status(200).json({ success: true, party });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
