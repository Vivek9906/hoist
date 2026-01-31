import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const AVATARS = [
    "🐶", "🐱", "🦊", "🐼", "🐨",
    "🐯", "🦁", "🐮", "🐷", "🐸",
    "🐵", "🐔", "🦄", "🐙", "🦋"
];

const AvatarSelector = ({ selectedAvatar, onSelect }) => {
    return (
        <div className="grid grid-cols-5 gap-4">
            {AVATARS.map((avatar, index) => (
                <motion.button
                    key={index}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelect(avatar)}
                    className={cn(
                        "text-4xl p-4 rounded-xl transition-colors bg-gray-800 border-2",
                        selectedAvatar === avatar
                            ? "border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            : "border-transparent hover:bg-gray-700"
                    )}
                >
                    {avatar}
                </motion.button>
            ))}
        </div>
    );
};

export default AvatarSelector;
