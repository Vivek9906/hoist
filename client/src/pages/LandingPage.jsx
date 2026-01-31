import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Video, Users, MessageSquare, Zap } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative selection:bg-purple-500 selection:text-white">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        HOIST
                    </span>
                </div>
                <button className="text-sm font-medium hover:text-purple-400 transition-colors">
                    Login / Sign Up
                </button>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                        Watch Together, <br className="hidden md:block" /> Anywhere.
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Seamlessly sync videos, chat in real-time, and hang out with friends in a virtual space designed for shared experiences.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <button
                            onClick={() => navigate('/setup?mode=host')}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            Host a Party <span className="text-xl">🎉</span>
                        </button>
                        <button
                            onClick={() => navigate('/setup?mode=join')}
                            className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-full font-bold text-lg hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            Join Party <span className="text-xl">🎊</span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Features Preview */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                >
                    <FeatureCard
                        icon={<Video className="w-6 h-6 text-purple-400" />}
                        title="Frame-Perfect Sync"
                        description="Watch YouTube, Vimeo, and more in 100% sync with friends."
                    />
                    <FeatureCard
                        icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
                        title="Real-time Chat"
                        description="Text, emojis, and reactions while you watch."
                    />
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-pink-400" />}
                        title="Instant Setup"
                        description="No login required. Just create a code and share."
                    />
                </motion.div>
            </main>
        </div>
    );
};

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 rounded-2xl bg-gray-800/50 border border-white/5 hover:bg-gray-800/80 transition-all backdrop-blur-sm text-center md:text-left"> // Updated to support left align on md
            <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center mb-4 mx-auto md:mx-0">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    )
}

export default LandingPage;
