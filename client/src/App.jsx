import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Common/Navbar.jsx';
import Home from './pages/Home.jsx';
import Room from './pages/Room.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0d1117]">
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#161b22',
                color: '#c9d1d9',
                border: '1px solid #30363d',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
