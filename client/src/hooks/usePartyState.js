import { useState, useEffect, useCallback } from 'react';
import { getSocket } from '../lib/socketManager';
import toast from 'react-hot-toast';

export const usePartyState = (partyCode, user) => {
    const [party, setParty] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!partyCode || !user) return;

        const socket = getSocket();

        const onConnect = () => {
            setIsConnected(true);
            console.log('Socket Connected');
            socket.emit('party:join', { partyCode, user });
        };

        const onDisconnect = () => setIsConnected(false);

        const onPartyUpdated = (updatedParty) => {
            setParty(updatedParty);
        };

        const onSyncState = (state) => {
            // Initial sync state from server (for late joiners)
            console.log('Received initial sync state:', state);
        };

        const onChatMessage = (message) => {
            setMessages(prev => [...prev, message]);
        };

        const onError = ({ message }) => {
            toast.error(message);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('party:updated', onPartyUpdated);
        socket.on('sync:state', onSyncState);
        socket.on('chat:message', onChatMessage);
        socket.on('error', onError);

        // If already connected manually join
        if (socket.connected) {
            onConnect();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('party:updated', onPartyUpdated);
            socket.off('sync:state', onSyncState);
            socket.off('chat:message', onChatMessage);
            socket.off('error', onError);
        };
    }, [partyCode, user]);

    const sendMessage = useCallback((text) => {
        const socket = getSocket();
        const message = {
            id: crypto.randomUUID(),
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            text,
            timestamp: new Date().toISOString()
        };
        // Optimistic update
        // setMessages(prev => [...prev, message]); 
        // Better to wait for server echo for consistency in this simple setup
        socket.emit('chat:message', { partyCode, message });
    }, [partyCode, user]);

    return { party, messages, isConnected, sendMessage };
};
