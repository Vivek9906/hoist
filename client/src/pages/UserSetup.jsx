import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AvatarSelector from '../components/AvatarSelector';
import { ArrowRight } from 'lucide-react';

const UserSetup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'join'; // 'host' or 'join'

    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('🐶');

    const handleContinue = () => {
        if (username.length < 3) {
            toast.error("Username must be at least 3 characters!");
            return;
        }

        // Save user to localStorage (temporary auth)
        const user = { username, avatar, id: crypto.randomUUID() };
        localStorage.setItem('hoist_user', JSON.stringify(user));

        toast.success("Ready to party! 🎉");

        // Navigate based on intent
        if (mode === 'host') {
            navigate('/dashboard?action=host');
        } else {
            navigate('/dashboard?action=join');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-lg w-full z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Who are you?
                    </h2>
                    <p className="text-gray-400 mt-2">Create your party persona</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. MovieBuff99"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Choose Avatar</label>
                        <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinue}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        Ready to Party! <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default UserSetup;
