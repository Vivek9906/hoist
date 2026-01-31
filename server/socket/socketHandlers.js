const Party = require('../models/Party.model');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join Party
        socket.on('party:join', async ({ partyCode, user }) => {
            try {
                const party = await Party.findOne({ partyCode });
                if (!party) {
                    socket.emit('error', { message: 'Party not found' });
                    return;
                }

                socket.join(partyCode);

                // Add user to participants if not already present
                const isParticipant = party.participants.find(p => p.userId === user.id);
                if (!isParticipant) {
                    party.participants.push({
                        ...user,
                        userId: user.id, // Ensure consistent ID mapping
                        socketId: socket.id,
                        isHost: party.hostId === user.id
                    });
                    await party.save();
                }

                // Broadcast to room
                io.to(partyCode).emit('party:updated', party);

                // Send current state to new user
                socket.emit('sync:state', {
                    currentUrl: party.currentUrl,
                    isPlaying: party.isPlaying,
                    timestamp: party.timestamp
                });

                console.log(`${user.username} joined party ${partyCode}`);

            } catch (error) {
                console.error('Join Error:', error);
                socket.emit('error', { message: 'Failed to join party' });
            }
        });

        // Sync Events
        socket.on('sync:update', async ({ partyCode, state }) => {
            // Broadcast sync state to everyone ELSE in the room
            socket.to(partyCode).emit('sync:update', state);

            // Update DB (debounced/optional optimization later)
            // await Party.updateOne({ partyCode }, state);
        });

        socket.on('chat:message', ({ partyCode, message }) => {
            io.to(partyCode).emit('chat:message', message);
        });

        // Sync VideoSDK Meeting ID
        socket.on('sync:video-id', async ({ partyCode, videoMeetingId }) => {
            console.log(`Video Meeting ID synced for ${partyCode}: ${videoMeetingId}`);
            try {
                // Update DB
                await Party.updateOne({ partyCode }, { videoMeetingId });
                // Broadcast to everyone
                io.to(partyCode).emit('sync:video-id', videoMeetingId);
            } catch (err) {
                console.error('Failed to update videoMeetingId in DB', err);
            }
        });

        socket.on('sync:url-change', async ({ partyCode, url }) => {
            console.log(`URL change in ${partyCode}: ${url}`);

            // Broadcast to all (including sender so they update their player)
            io.to(partyCode).emit('sync:url-change', url);

            // Update DB
            try {
                await Party.updateOne({ partyCode }, { currentUrl: url, isPlaying: true });
            } catch (err) {
                console.error('Failed to update URL in DB', err);
            }
        });

        socket.on('reaction:send', ({ partyCode, emoji }) => {
            // Broadcast to everyone (including sender if we wanted specific server ID confirmation, but strict broadcast excludes sender usually in pure broadcast logic. Here we use io.to to include sender or socket.to to exclude. Frontend handles local opt.)
            // We use socket.to to exclude sender since they animated locally already
            socket.to(partyCode).emit('reaction:send', { emoji, from: socket.id });
        });

        // Leave Party
        socket.on('party:leave', async ({ partyCode, userId, username }) => {
            console.log(`${username} leaving party ${partyCode}`);
            socket.leave(partyCode);

            // Remove from DB participation list
            try {
                await Party.updateOne(
                    { partyCode },
                    { $pull: { participants: { userId } } }
                );
                socket.to(partyCode).emit('user:left', { userId, username });
                io.to(partyCode).emit('party:updated', await Party.findOne({ partyCode })); // Send full update
            } catch (e) {
                console.error("Leave Error:", e);
            }
        });

        // End Party (Host only)
        socket.on('party:end', async ({ partyCode }) => {
            console.log(`Party ${partyCode} ended by host`);
            io.to(partyCode).emit('party:ended');

            // Optional: Soft delete or mark inactive
            try {
                await Party.deleteOne({ partyCode });
            } catch (e) {
                console.error("End Party Error:", e);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Handle leaving logic if needed (remove from list or mark offline)
        });
    });
};
