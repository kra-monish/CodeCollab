import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Common/Loader.jsx';
import { Code2, Users, UserPlus, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [action, setAction] = useState('create');
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = generateRoomId();
      navigate(`/room/${id}`);
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate roomId exists on server
      navigate(`/room/${roomId}`);
    } catch (error) {
      toast.error('Room not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#010409] pt-24 pb-16">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Code Together, In Real Time
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The fastest way to collaborate on code. Live cursors, chat, code execution - all in your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <button
              onClick={() => setAction('create')}
              className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                action === 'create'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/25'
                  : 'bg-white/5 hover:bg-white/10 border border-white/20'
              }`}
            >
              <Code2 className="w-5 h-5 inline mr-2" />
              Create Room
            </button>
            <button
              onClick={() => setAction('join')}
              className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                action === 'join'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-2xl shadow-green-500/25'
                  : 'bg-white/5 hover:bg-white/10 border border-white/20'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Join Room
            </button>
          </div>
        </div>

        {/* Action Form */}
        <div className="max-w-md mx-auto bg-[#161b22] border border-[#30363d] rounded-3xl p-8 shadow-2xl">
          {action === 'create' ? (
            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Room Name (Optional)</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="My coding session"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Code2 className="w-6 h-6" />
                    <span>Create & Start Coding</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinRoom} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Room ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all uppercase tracking-wider font-mono text-lg"
                    placeholder="ABC123"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !roomId}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/25 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-6 h-6" />
                    <span>Join Room</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
