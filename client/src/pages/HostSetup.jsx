import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AvatarSelector from '../components/AvatarSelector';
import { ArrowRight, Sparkles } from 'lucide-react';

const HostSetup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('🐶');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('hoist_user');
        if (stored) {
            const u = JSON.parse(stored);
            setUsername(u.username);
            setAvatar(u.avatar);
        }
    }, []);

    const handleCreate = async () => {
        if (username.length < 3) {
            toast.error("Username must be at least 3 characters!");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Creating your party room...");

        try {
            // Updated User Storage
            const user = { username, avatar, id: localStorage.getItem('hoist_user_id') || crypto.randomUUID() };
            localStorage.setItem('hoist_user', JSON.stringify(user));
            localStorage.setItem('hoist_user_id', user.id); // Persist ID specifically

            const res = await fetch('/api/party/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hostId: user.id,
                    username: user.username,
                    avatar: user.avatar
                })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Party Ready! 🚀", { id: toastId });
                navigate(`/party/${data.partyCode}`);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create party", { id: toastId });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/40 via-gray-900 to-blue-900/40" />
            <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-lg w-full z-10 shadow-2xl relative"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mb-4 text-purple-400">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold">Host a Party</h2>
                    <p className="text-gray-400 mt-2">Set up your profile to get started.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Your Name</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your nickname..."
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Your Avatar</label>
                        <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreate}
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating..." : "Start Party"} <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default HostSetup;
