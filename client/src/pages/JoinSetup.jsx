import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AvatarSelector from '../components/AvatarSelector';
import { LogIn, UserCircle } from 'lucide-react';

const JoinSetup = () => {
    const navigate = useNavigate();
    const [partyCode, setPartyCode] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('🐼');
    const [hasUser, setHasUser] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('hoist_user');
        if (stored) {
            setHasUser(true);
            const u = JSON.parse(stored);
            setUsername(u.username);
            setAvatar(u.avatar);
        }
    }, []);

    const handleJoin = () => {
        if (partyCode.length < 4) {
            toast.error("Invalid Party Code");
            return;
        }

        if (!hasUser && username.length < 3) {
            toast.error("Please enter a valid username");
            return;
        }

        if (!hasUser) {
            const user = { username, avatar, id: crypto.randomUUID() };
            localStorage.setItem('hoist_user', JSON.stringify(user));
        }

        navigate(`/party/${partyCode.toUpperCase()}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 z-0 bg-gradient-to-bl from-blue-900/40 via-gray-900 to-purple-900/40" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-md w-full z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-4 text-blue-400">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold">Join Party</h2>
                    <p className="text-gray-400 mt-2">Enter the code to jump in.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Party Code</label>
                        <input
                            type="text"
                            value={partyCode}
                            onChange={(e) => setPartyCode(e.target.value.toUpperCase())}
                            placeholder="ABCD"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-4 text-2xl font-mono text-center tracking-[0.5em] focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:tracking-normal placeholder:normal-case placeholder:text-base placeholder:font-sans"
                            autoFocus
                        />
                    </div>

                    {!hasUser && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-4 border-t border-gray-700/50 space-y-4"
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <UserCircle className="w-4 h-4" /> Setup your profile
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2"
                            />
                            <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} size="sm" />
                        </motion.div>
                    )}

                    <button
                        onClick={handleJoin}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all mt-2"
                    >
                        Join Now
                    </button>

                    {hasUser && (
                        <div className="text-center">
                            <button onClick={() => setHasUser(false)} className="text-xs text-gray-500 hover:text-white underline">
                                Not {username}? Change Profile
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default JoinSetup;
