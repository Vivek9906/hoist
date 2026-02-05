# Deployment Guide

This guide describes how to deploy the Hoist application.

## Strategy: Client (Vercel) + Server (Render)

This is the recommended strategy for a free/low-cost deployment.

### 1. Prerequisites
- **GitHub Account**: Push your code to a GitHub repository.
- **Render Account**: For deploying the backend.
- **Vercel Account**: For deploying the frontend.
- **VideoSDK Account**: For API keys.
- **MongoDB Atlas**: For a cloud database.

### 2. Deploy Backend (Render)

1.  Log in to [Render](https://render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Settings:
    - **Root Directory**: `server`
    - **Build Command**: `npm install`
    - **Start Command**: `node index.js` (or `node server.js` if that's your entry point)
5.  **Environment Variables**:
    Add the following:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `VIDEOSDK_API_KEY`: From VideoSDK dashboard.
    - `VIDEOSDK_SECRET_KEY`: From VideoSDK dashboard.
    - `PORT`: `10000` (Render default)
6.  Click **Create Web Service**.
7.  Wait for deployment to finish. **Copy the URL** (e.g., `https://hoist-server.onrender.com`).

### 3. Deploy Frontend (Vercel)

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Settings:
    - **Root Directory**: `client`
    - **Framework Preset**: Vite
    - **Build Command**: `vite build` (default)
    - **Output Directory**: `dist` (default)
5.  **Environment Variables**:
    - `VITE_SERVER_URL`: Paste your Render backend URL (e.g., `https://hoist-server.onrender.com`).
    *Note: Do not add a trailing slash.*
6.  Click **Deploy**.

## Troubleshooting

- **CORS Errors**: If you see CORS errors in the browser console, you may need to update `server/server.js` to allow the specific origin of your Vercel app (e.g., `app.use(cors({ origin: 'https://your-vercel-app.vercel.app' }));`). currently it is set to `*` which works but is less secure.
- **Socket Connection Fails**: Ensure `VITE_SERVER_URL` is correct and the backend is running.
