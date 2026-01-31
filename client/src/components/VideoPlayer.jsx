import React, { useState, useEffect } from 'react';
import { getSocket } from '../lib/socketManager';

// ROBUST RAW PLAYER
// - Replaces ReactPlayer to ensure stability
// - Manually handles converting standard URLs to Embed URLs
// - Syncs URL changes from Host
const VideoPlayer = ({ partyCode, initialUrl }) => {
    const socket = getSocket();
    const [url, setUrl] = useState(initialUrl || '');

    // Socket: Listen for URL updates
    useEffect(() => {
        const onUrlChange = (u) => setUrl(u);
        const onStateSync = (s) => { if (s.currentUrl) setUrl(s.currentUrl); };

        socket.on('sync:url-change', onUrlChange);
        socket.on('sync:state', onStateSync);

        return () => {
            socket.off('sync:url-change');
            socket.off('sync:state');
        };
    }, []);

    // Props: Sync initial load
    useEffect(() => {
        if (initialUrl) setUrl(initialUrl);
    }, [initialUrl]);

    // Helper: Convert "Watch" URLs to "Embed" URLs for Iframe
    const getEmbedUrl = (inputUrl) => {
        if (!inputUrl) return '';
        try {
            let u = inputUrl;
            if (!u.startsWith('http')) u = 'https://' + u;

            const urlObj = new URL(u);

            // YouTube: /watch?v=ID -> /embed/ID
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
                if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`;
            }

            // Vimeo: /12345 -> /video/12345
            if (urlObj.hostname.includes('vimeo.com')) {
                const videoId = urlObj.pathname.split('/').pop();
                if (videoId && !isNaN(videoId)) return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
            }

            // Twitch: /channel -> player.twitch.tv
            if (urlObj.hostname.includes('twitch.tv')) {
                const channel = urlObj.pathname.split('/').pop();
                return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
            }

            // Fallback (Direct URL)
            return u;
        } catch (e) {
            console.warn("URL Parse Error:", e);
            return inputUrl;
        }
    };

    const embedUrl = getEmbedUrl(url);

    return (
        <div className="w-full h-full bg-black flex items-center justify-center relative group">
            {embedUrl ? (
                <iframe
                    key={embedUrl} // Force reload on URL change
                    src={embedUrl}
                    className="w-full h-full border-0 shadow-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Party Content"
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                    <div className="animate-pulse">Waiting for host to select a video...</div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
