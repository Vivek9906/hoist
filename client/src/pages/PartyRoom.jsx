import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Users, ArrowLeft, Video, LogOut, XCircle, Mic } from 'lucide-react';
import { usePartyState } from '../hooks/usePartyState';
import { getSocket } from '../lib/socketManager';
import WebFrame from '../components/WebFrame';
import VideoPlayer from '../components/VideoPlayer';
import VideoCall from '../components/VideoCall';
import ReactionOverlay from '../components/ReactionOverlay';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player';

const PartyRoom = () => {
    const { partyId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // API URL Helper
    const API_URL = import.meta.env.VITE_API_URL || '';
    const [activeTab, setActiveTab] = useState('chat');
    const [messageInput, setMessageInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [isVideoCallActive, setIsVideoCallActive] = useState(false);
    const [videoMeetingId, setVideoMeetingId] = useState(null); // New State
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('hoist_user');
        if (!storedUser) {
            navigate('/setup');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const { party, messages, sendMessage, isConnected } = usePartyState(partyId, user);

    // Derived State
    const isHost = party?.participants?.find(p => p.userId === user?.id)?.isHost;
    const currentUrl = party?.currentUrl || '';

    // Sync Video Meeting ID
    useEffect(() => {
        if (party?.videoMeetingId) {
            setVideoMeetingId(party.videoMeetingId);
        }

        const socket = getSocket();
        socket.on('sync:video-id', (id) => {
            console.log("Received Video ID:", id);
            setVideoMeetingId(id);
        });

        return () => {
            socket.off('sync:video-id');
        };
    }, [party]);

    const handleJoinVideo = async () => {
        if (videoMeetingId) {
            setIsVideoCallActive(true);
            return;
        }

        // If no ID, and Host -> Create one
        if (isHost) {
            const toastId = toast.loading("Initializing Video Room...");
            try {
                const res = await fetch(`${API_URL}/api/video/create-meeting`, { method: 'POST' });
                const data = await res.json();

                if (data.meetingId) {
                    setVideoMeetingId(data.meetingId);

                    // Sync with everyone
                    const socket = getSocket();
                    socket.emit('sync:video-id', { partyCode: partyId, videoMeetingId: data.meetingId });

                    toast.success("Room Ready!", { id: toastId });
                    setIsVideoCallActive(true);
                } else {
                    throw new Error("No meeting ID returned");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to start video server", { id: toastId });
            }
        } else {
            toast("Waiting for host to start the call...", { icon: "⏳" });
        }
    };

    // Auto-scroll chat
    useEffect(() => {
        if (activeTab === 'chat' && sidebarOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, activeTab, sidebarOpen]);

    useEffect(() => {
        if (isConnected) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            toast.success("Joined Party!", { icon: "🎉" });
        }

        const socket = getSocket();

        socket.on('party:ended', () => {
            toast.error("Host ended the party");
            navigate('/');
        });

        socket.on('user:left', ({ username }) => {
            toast(`${username} left the party`, { icon: '👋' });
        });

        return () => {
            socket.off('party:ended');
            socket.off('user:left');
        };
    }, [isConnected, navigate]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        sendMessage(messageInput);
        setMessageInput('');
    };

    const handleUrlSubmit = (e) => {
        if (e.key === 'Enter' && urlInput) {
            if (!party?.participants?.find(p => p.userId === user.id)?.isHost) return;

            let formattedUrl = urlInput;
            if (!formattedUrl.startsWith('http')) formattedUrl = 'https://' + formattedUrl;

            // Notice we DO NOT convert to embed here anymore, we let the smart renderer decide
            // unless ReactPlayer fails to play it, but ReactPlayer handles YT URLs fine.

            const socket = getSocket();
            socket.emit('sync:url-change', { partyCode: partyId, url: formattedUrl });
            toast.success("Loading...");
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
    };

    if (!user) return null;



    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans relative">
            <ReactionOverlay partyCode={partyId} />

            {/* Header */}
            <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 z-50 relative shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="hover:bg-gray-800 p-1 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="font-bold text-lg hidden md:block">Party: <span className="font-mono text-purple-400">{partyId}</span></h1>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold",
                        isConnected ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    )}>
                        <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                        {isConnected ? "Connected" : "Disconnected"}
                    </span>
                    <span className="bg-gray-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" /> {party?.participants?.length || 0}
                    </span>
                </div>
                <div className="flex gap-2">
                    {isHost ? (
                        <button
                            onClick={() => {
                                if (window.confirm("End party for everyone?")) {
                                    getSocket().emit('party:end', { partyCode: partyId });
                                }
                            }}
                            className="bg-red-600/20 text-red-500 hover:bg-red-600/30 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-red-900/50"
                        >
                            <XCircle className="w-4 h-4" /> <span className="hidden sm:inline">End</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                if (window.confirm("Leave party?")) {
                                    getSocket().emit('party:leave', { partyCode: partyId, userId: user.id, username: user.username });
                                    navigate('/');
                                }
                            }}
                            className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Leave</span>
                        </button>
                    )}
                    <button onClick={copyLink} className="bg-purple-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-purple-500 transition-colors">
                        <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative z-30">
                <div className="flex-1 flex flex-col bg-gray-950 relative">
                    {/* URL Bar */}
                    <div className="h-12 bg-gray-800/50 flex items-center px-4 gap-2 backdrop-blur-sm z-40 border-b border-white/5 relative">
                        <input
                            type="text"
                            disabled={!isHost}
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={handleUrlSubmit}
                            placeholder={isHost ? "Enter URL..." : "Waiting for host..."}
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50 text-white placeholder-gray-500 relative z-50"
                        />
                        {/* Indicator removed */}
                    </div>

                    {/* Unified Player/Frame Area */}
                    <div className="flex-1 bg-black relative overflow-hidden group z-0">
                        <div className="absolute inset-0">
                            <VideoPlayer
                                partyCode={partyId}
                                isHost={isHost}
                                initialUrl={currentUrl}
                                initialPlaying={party?.isPlaying}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                {sidebarOpen && (
                    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col absolute md:relative right-0 h-full z-50 shadow-xl md:shadow-none transition-all duration-300">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-800">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={cn("flex-1 py-3 text-xs font-bold uppercase transition-colors border-b-2", activeTab === 'chat' ? "border-purple-500 text-purple-400" : "border-transparent text-gray-400 hover:text-white")}
                            >
                                Chat
                            </button>
                            <button
                                onClick={() => setActiveTab('video')}
                                className={cn("flex-1 py-3 text-xs font-bold uppercase transition-colors border-b-2", activeTab === 'video' ? "border-green-500 text-green-400" : "border-transparent text-gray-400 hover:text-white")}
                            >
                                Video
                            </button>
                            <button
                                onClick={() => setActiveTab('voice')}
                                className={cn("flex-1 py-3 text-xs font-bold uppercase transition-colors border-b-2", activeTab === 'voice' ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-white")}
                            >
                                Voice
                            </button>
                        </div>

                        {/* Content Area */}

                        {/* CHAT TAB */}
                        {activeTab === 'chat' && (
                            <>
                                <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col scrollbar-thin scrollbar-thumb-gray-700">
                                    {messages.length === 0 && (
                                        <div className="text-center text-gray-500 text-sm mt-10">
                                            No messages yet. Say hi! 👋
                                        </div>
                                    )}
                                    {messages.map((msg, i) => (
                                        <div key={msg.id || i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-lg select-none">
                                                {msg.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-sm text-purple-400 truncate">{msg.username}</span>
                                                    <span className="text-[10px] text-gray-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className="text-sm text-gray-300 break-words leading-relaxed">{msg.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 bg-gray-900 sticky bottom-0 z-10">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="w-full bg-gray-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all border border-transparent focus:border-purple-500/50"
                                    />
                                </form>
                            </>
                        )}

                        {/* PEOPLE TAB REMOVED AS REQUESTED (Replaced by Voice) */}

                        {/* VIDEO & VOICE TABS */}
                        {(activeTab === 'video' || activeTab === 'voice') && (
                            <div className="flex-1 flex flex-col h-full bg-gray-900">
                                {isVideoCallActive ? (
                                    <VideoCall
                                        meetingId={videoMeetingId} // Use the REAL VideoSDK ID, not partyId
                                        user={user}
                                        audioOnly={activeTab === 'voice'}
                                        onLeave={() => {
                                            setIsVideoCallActive(false);
                                            setActiveTab('chat');
                                        }}
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                            {activeTab === 'video' ? <Video className="w-8 h-8 text-gray-400" /> : <Mic className="w-8 h-8 text-gray-400" />}
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">Join {activeTab === 'video' ? 'Video' : 'Voice'} Call</h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            {activeTab === 'video' ? "Hop in to hang out properly." : "Just talk, no camera required."}
                                        </p>
                                        <button
                                            onClick={handleJoinVideo}
                                            className={cn("px-6 py-3 rounded-xl font-bold transition-colors w-full text-white", activeTab === 'video' ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500")}
                                        >
                                            Join {activeTab === 'video' ? 'Video' : 'Voice'}
                                        </button>


                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartyRoom;
