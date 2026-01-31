import { io } from 'socket.io-client';

// Singleton socket instance
let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io('/', {
            path: '/socket.io',
            reconnection: true,
            reconnectionAttempts: 5,
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
