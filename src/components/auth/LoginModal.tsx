'use client';

import Link from 'next/link';
import { Home, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LoginModalProps {
  onLogin: (phone: string, name: string) => Promise<void>;
  loading: boolean;
}

export const LoginModal = ({ onLogin, loading }: LoginModalProps) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim() && name.trim()) {
      onLogin(phone, name);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Welcome to PulseChat </h2>
        <p className="mb-6 text-sm text-gray-500">Enter your details to log in or register</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+15551234567"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Start Chatting'}
          </button>

          <Link href="/" className="w-full ">
            <button
              type="button"
              disabled={loading}
              className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 font-semibold text-white "
            >
              <Home className="h-4 w-4" />
              Go to Homepage
            </button>
          </Link>

        </form>
      </div>
    </div>
  );
};