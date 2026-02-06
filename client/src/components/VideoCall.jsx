import React, { useEffect, useState, useRef } from 'react';
import { MeetingProvider, MeetingConsumer, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

// 1. Participant View Component
const ParticipantView = ({ participantId }) => {
    const webcamRef = useRef(null);
    const micRef = useRef(null);
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);

    useEffect(() => {
        if (webcamRef.current) {
            if (webcamOn && webcamStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(webcamStream.track);
                webcamRef.current.srcObject = mediaStream;
                webcamRef.current.play().catch(error => console.error("videoPlay", error));
            } else {
                webcamRef.current.srcObject = null;
            }
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);
                micRef.current.srcObject = mediaStream;
                micRef.current.play().catch(error => console.error("audioPlay", error));
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    return (
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video border border-gray-700 shadow-md">
            <audio ref={micRef} autoPlay muted={isLocal} />

            {webcamOn ? (
                <video
                    ref={webcamRef}
                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror local video or all? Usually mirror local.
                    style={{ transform: isLocal ? 'scaleX(-1)' : 'none' }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <span className="text-2xl font-bold text-gray-400">{displayName?.substring(0, 2).toUpperCase() || "USER"}</span>
                </div>
            )}

            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs flex items-center gap-2">
                <span className="font-medium">{displayName} {isLocal && "(You)"}</span>
                {!micOn && <MicOff className="w-3 h-3 text-red-500" />}
            </div>
        </div>
    );
};

// 2. Main Controls & Grid
const MeetingView = ({ onLeave, meetingId }) => {
    const { join, leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn, participants } = useMeeting({
        onMeetingJoined: () => {
            console.log("Joined Meeting");
        },
        onMeetingLeft: () => {
            onLeave();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const participantIds = [...participants.keys()]; // Array of participant IDs

    return (
        <div className="flex flex-col h-full bg-gray-900">
            {/* Grid */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-min">
                    {participantIds.map(participantId => (
                        <ParticipantView key={participantId} participantId={participantId} />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-center gap-4">
                <button
                    onClick={() => toggleMic()}
                    className={cn("p-3 rounded-full transition-colors", localMicOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600")}
                >
                    {localMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                    onClick={() => toggleWebcam()}
                    className={cn("p-3 rounded-full transition-colors", localWebcamOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600")}
                >
                    {localWebcamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button
                    onClick={() => leave()}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white"
                >
                    <PhoneOff className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// 3. Wrapper Component
const VideoCall = ({ meetingId, user, onLeave, audioOnly = false }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || '';
                const res = await fetch(`${API_URL}/api/video/get-token`);
                const data = await res.json();
                if (data.token) {
                    setToken(data.token);
                } else {
                    toast.error("VideoSDK keys missing on server!");
                }
            } catch (error) {
                console.error("Failed to get token", error);
                toast.error("Failed to initialize video");
            }
        };
        fetchToken();
    }, []);

    if (!token) {
        return <div className="p-6 text-center text-gray-400">Loading Video System...</div>;
    }

    return (
        <MeetingProvider
            config={{
                meetingId,
                micEnabled: true,
                webcamEnabled: !audioOnly,
                name: user.username,
            }}
            token={token}
            joinWithoutUserInteraction={true} // Auto join
        >
            <MeetingView onLeave={onLeave} meetingId={meetingId} />
        </MeetingProvider>
    );
};

export default VideoCall;
