import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { getSocket } from '../lib/socketManager';

const WebFrame = ({ partyCode, isHost, initialUrl }) => {
    const socket = getSocket();
    const [url, setUrl] = useState(initialUrl || '');
    const [key, setKey] = useState(0); // Used to force reload iframe

    useEffect(() => {
        if (initialUrl) setUrl(initialUrl);
    }, [initialUrl]);

    useEffect(() => {
        const onUrlChange = (newUrl) => {
            // Basic protocol check
            if (!newUrl.startsWith('http')) {
                newUrl = 'https://' + newUrl;
            }
            setUrl(newUrl);
        };

        socket.on('sync:url-change', onUrlChange);
        return () => socket.off('sync:url-change', onUrlChange);
    }, [partyCode]);

    const reloadFrame = () => {
        setKey(prev => prev + 1);
    };

    return (
        <div className="w-full h-full bg-white relative flex flex-col">
            {/* Browser Toolbar */}
            <div className="h-8 bg-gray-100 flex items-center px-4 border-b border-gray-300 gap-2 text-xs text-gray-600">
                <button onClick={reloadFrame} className="hover:bg-gray-200 p-1 rounded">
                    <RefreshCw className="w-3 h-3" />
                </button>
                <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-0.5 truncate select-all">
                    {url || "about:blank"}
                </div>
                {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:bg-gray-200 p-1 rounded" title="Open in new tab (if blocked)">
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            {/* The Frame */}
            {url ? (
                <iframe
                    key={key}
                    src={url}
                    className="flex-1 w-full h-full border-0"
                    title="Party Frame"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-pointer-lock allow-presentation"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                    <div className="text-6xl mb-4">🌐</div>
                    <p>Enter a URL above to browse together.</p>
                    <p className="text-xs mt-2 text-gray-500 max-w-md text-center">
                        Note: Some websites (like Google, YouTube, Netflix) may refuse to connect due to security settings preventing them from being embedded.
                    </p>
                </div>
            )}

            {/* Click Blocker for Non-Hosts? 
                User said "watch together", usually implies standard browser behavior. 
                If we block clicks, they can't interact. Let's leave it open for now, 
                but realize interactions aren't synced.
            */}
        </div>
    );
};

export default WebFrame;
