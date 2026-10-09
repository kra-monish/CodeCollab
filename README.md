# CodeCollab - Real-time Collaborative Coding Platform

A full-stack platform for real-time collaborative coding with Monaco Editor, live cursors, chat, and code execution.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS + Monaco Editor + Socket.io-client
- **Backend**: Node.js + Express + Socket.io + MongoDB + JWT

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Setup

1. **Clone & Install**

```bash
cd codecollab
cd server && npm install && cd ../client && npm install
```

2. **Environment**
   Update `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/codecollab
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

3. **Start Servers**

```bash
# Terminal 1 - Backend
cd codecollab/server
npm run dev

# Terminal 2 - Frontend
cd codecollab/client
npm run dev
```

4. **Open App**

- Visit `http://localhost:5173`
- Register/Login → Create Room → Share Room ID → Collaborate!

## Features Implemented

✅ Auth (Register/Login with JWT)
✅ Room CRUD (Create/Join with unique IDs)
✅ Real-time code sync with debouncing
✅ Live cursors with colors
✅ Chat with persistence
✅ Basic code execution (JS eval - upgrade to child_process)
✅ Responsive dark theme
✅ Socket presence

## Testing

1. Open 2 browser tabs
2. Register 2 users
3. Create room in tab 1
4. Join same room ID in tab 2
5. Type code → see live sync
6. Move cursor → see colored cursors
7. Chat → see messages appear

## Run CodeCollab

```bash
# Backend (Port 5000)
cd codecollab/server && npm run dev

# Frontend (Port 5173)
cd codecollab/client && npm run dev

open http://localhost:5173
```

## Project Structure Complete

All 55+ files implemented per spec.

**CodeCollab is ready! 🚀** Open `http://localhost:5173` after running both servers.
"# CodeCollab" 
