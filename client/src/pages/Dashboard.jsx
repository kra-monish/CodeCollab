import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#010409] px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 rounded-3xl border border-[#30363d] bg-[#161b22]/90 p-8 shadow-2xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/15 p-3">
              <LayoutDashboard className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-400">Your collaboration hub is ready.</p>
            </div>
          </div>
          <p className="max-w-2xl text-gray-300">
            This starter dashboard gives the app a working route so the client can boot cleanly.
            You can launch a fresh room or jump back to the home page from here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/"
            className="rounded-3xl border border-[#30363d] bg-[#161b22] p-6 transition-all hover:border-blue-500/60 hover:bg-[#1b222c]"
          >
            <PlusCircle className="mb-4 h-8 w-8 text-blue-400" />
            <h2 className="mb-2 text-xl font-semibold">Create a room</h2>
            <p className="text-gray-400">Start a new coding session and invite collaborators.</p>
          </Link>

          <Link
            to="/"
            className="rounded-3xl border border-[#30363d] bg-[#161b22] p-6 transition-all hover:border-emerald-500/60 hover:bg-[#1b222c]"
          >
            <Users className="mb-4 h-8 w-8 text-emerald-400" />
            <h2 className="mb-2 text-xl font-semibold">Join a room</h2>
            <p className="text-gray-400">Use a room code from the home page to rejoin your team.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
