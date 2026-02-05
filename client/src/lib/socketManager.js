import { io } from 'socket.io-client';

// Singleton socket instance
let socket;

export const getSocket = () => {
    if (!socket) {
        const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        socket = io(SERVER_URL, {
            path: '/socket.io',
            reconnection: true,
            reconnectionDelay: 1000,
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
