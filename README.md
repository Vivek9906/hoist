# Hoist - Watch Party Application

Hoist is a real-time watch party application that allows users to watch videos together, chat, and interact via video/voice calls. Built with the MERN stack (MongoDB, Express, React, Node.js), Socket.IO for real-time synchronization, and VideoSDK for video conferencing.

## Features

- **Real-time Video Synchronization**: Watch YouTube and other direct video links in perfect sync with friends.
- **Video & Voice Calling**: Integrated video and voice chat powered by VideoSDK.
- **Live Chat**: Text chat with real-time messaging.
- **Host Controls**: Hosts can control video playback, seek, and manage the party.
- **Interactive Reactions**: Send confetti and other reactions.
- **Responsive Design**: Works on desktop and mobile.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React, Socket.IO Client.
- **Backend**: Node.js, Express, Socket.IO, MongoDB (Mongoose).
- **Video/Audio**: VideoSDK, React Player.

## Prerequisites

Before you begin, ensure you have the following installed/set up:
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- [VideoSDK Account](https://videosdk.live/) (for API keys)

## Environment Variables

### Server (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hoist  # Or your MongoDB Atlas connection string
VIDEOSDK_API_KEY=your_videosdk_api_key
VIDEOSDK_SECRET_KEY=your_videosdk_secret_key
```

### Client (`client/.env`)
Create a `.env` file in the `client` directory (optional for local dev, required for production if decoupled):

```env
VITE_SERVER_URL=http://localhost:5000 # Use your deployed backend URL in production
```

## Installation & Running Locally

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd hoist
    ```

2.  **Setup Server**
    ```bash
    cd server
    npm install
    # Create .env file as shown above
    npm run dev
    ```

3.  **Setup Client**
    ```bash
    cd ../client
    npm install
    # Create .env file as shown above (optional for local)
    npm run dev
    ```

4.  **Access the App**
    Open your browser and navigate to `http://localhost:5173`.

## Project Structure

- `client/`: React frontend application.
- `server/`: Node.js/Express backend server.
- `server/socket/`: Socket.IO event handlers.
- `server/controllers/`: API controllers (VideoSDK token generation, etc.).
