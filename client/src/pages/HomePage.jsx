import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Zap, Shield, Video, Globe } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
            {/* Background Animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[150px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">

                {/* Hero Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-6 drop-shadow-2xl tracking-tight">
                        HOIST
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                        Watch Together. Anywhere. Anytime.
                    </p>
                </motion.div>

                {/* Main Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-24">
                    {/* Host Card */}
                    <Link to="/host" className="group">
                        <motion.div
                            whileHover={{ scale: 1.03, rotate: -1 }}
                            className="h-full bg-gradient-to-br from-purple-900/60 to-gray-900/60 border border-purple-500/30 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl shadow-purple-900/20 group-hover:shadow-purple-700/40 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Plus className="w-32 h-32" />
                            </div>
                            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-600/40">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Host a Party</h2>
                            <p className="text-gray-400 leading-relaxed">Create a new room, invite your friends, and control the playback.</p>
                        </motion.div>
                    </Link>

                    {/* Join Card */}
                    <Link to="/join" className="group">
                        <motion.div
                            whileHover={{ scale: 1.03, rotate: 1 }}
                            className="h-full bg-gradient-to-br from-blue-900/60 to-gray-900/60 border border-blue-500/30 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl shadow-blue-900/20 group-hover:shadow-blue-700/40 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users className="w-32 h-32" />
                            </div>
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/40">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Join a Party</h2>
                            <p className="text-gray-400 leading-relaxed">Have a code? Jump right into an existing party with your friends.</p>
                        </motion.div>
                    </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center w-full max-w-5xl">
                    <FeatureItem icon={<Zap className="w-6 h-6 text-yellow-400" />} text="Lightning Fast" />
                    <FeatureItem icon={<Shield className="w-6 h-6 text-green-400" />} text="No Sign Up" />
                    <FeatureItem icon={<Video className="w-6 h-6 text-pink-400" />} text="Video Chat" />
                    <FeatureItem icon={<Globe className="w-6 h-6 text-blue-400" />} text="Any Site" />
                </div>
            </div>

            <footer className="absolute bottom-6 w-full text-center text-gray-600 text-sm">
                &copy; 2026 Hoist Inc.
            </footer>
        </div>
    );
};

const FeatureItem = ({ icon, text }) => (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-white/10 shadow-lg">
            {icon}
        </div>
        <span className="font-bold text-gray-300">{text}</span>
    </div>
);

export default HomePage;
