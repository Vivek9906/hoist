import React, { useEffect, useState, useCallback } from 'react';
import { getSocket } from '../lib/socketManager';

const REACTIONS = ["❤️", "😂", "🔥", "👍", "👎", "🎉", "😱"];

const ReactionOverlay = ({ partyCode }) => {
    const socket = getSocket();
    const [flyingEmojis, setFlyingEmojis] = useState([]);

    const addReaction = useCallback((emoji) => {
        const id = crypto.randomUUID();
        // Randomize start position slightly
        const startLeft = 40 + Math.random() * 20; // 40-60% width centerish

        setFlyingEmojis(prev => [...prev, { id, emoji, left: startLeft }]);

        // Cleanup
        setTimeout(() => {
            setFlyingEmojis(prev => prev.filter(item => item.id !== id));
        }, 3000);
    }, []);

    useEffect(() => {
        const onReaction = ({ emoji }) => addReaction(emoji);
        socket.on('reaction:send', onReaction);
        return () => socket.off('reaction:send', onReaction);
    }, [addReaction]);

    const sendReaction = (emoji) => {
        addReaction(emoji); // Local immediate feedback
        socket.emit('reaction:send', { partyCode, emoji });
    };

    return (
        <>
            {/* Flying Area (Pointer Events None to click through) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                {flyingEmojis.map(({ id, emoji, left }) => (
                    <div
                        key={id}
                        className="absolute bottom-0 text-4xl animate-float-up opacity-0"
                        style={{ left: `${left}%` }}
                    >
                        {emoji}
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-2">
                {REACTIONS.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => sendReaction(emoji)}
                        className="bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full backdrop-blur-md transition-transform hover:scale-125 border border-white/10 shadow-lg"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </>
    );
};

export default ReactionOverlay;
