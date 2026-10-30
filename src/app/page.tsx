// this is landing page
'use client';

import Link from 'next/link';
import { MessageSquare, ShieldCheck, Zap, Users, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 selection:bg-blue-600 selection:text-white font-sans relative overflow-hidden">
      {/* Background Soft Floating Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-blue-200/40 via-indigo-100/30 to-emerald-100/20 blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[400px] right-0 w-[500px] h-[400px] bg-blue-100/30 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-blue-500/20">
              <MessageSquare size={18} className="fill-white/20" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              PulseChat
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-blue-500/25 active:scale-[0.98]"
            >
              Start Chat <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-8 shadow-sm backdrop-blur-sm animate-fade-in">
          <Sparkles size={14} className="text-blue-600" />
          <span>Real-Time Communication Redefined</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] text-slate-900">
          Seamless Real-Time Conversations for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
            Individuals & Teams
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Experience lightning-fast instant messaging with real-time sync, smart auto-scroll, and dynamic group creation and built with modern performance standards.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/chat"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Chatting Now <ArrowRight size={18} />
          </Link>
        </div>

        {/* Feature Highlights List */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-500" /> No Reload Required
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-500" /> Instant Socket.io Events
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-500" /> Admin Role Controls
          </div>
        </div>

        {/* Live UI Mockup Preview */}
        <div className="mt-16 relative max-w-4xl mx-auto rounded-3xl border border-slate-200/80 bg-white/60 p-3 sm:p-4 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden text-left">
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400">PulseChat Web Application</span>
              <div className="w-12" />
            </div>

            {/* Chat Body Preview */}
            <div className="p-6 bg-gradient-to-b from-white to-slate-50/30 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                    PT
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Project Team</h4>
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> user1, user2
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-2">
                <div className="bg-slate-100/80 p-3.5 rounded-2xl rounded-tl-sm max-w-xs text-xs text-slate-700 shadow-sm leading-relaxed">
                  Hey everyone! The new real-time WebSocket architecture is live
                </div>

                <div className="bg-blue-600 p-3.5 rounded-2xl rounded-tr-sm max-w-xs text-xs text-white ml-auto shadow-md shadow-blue-600/15 leading-relaxed">
                  Awesome! Auto-scrolling and group updates are working seamlessly.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-3xl border border-slate-200/70 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap size={22} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Instant WebSocket Sync</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              Powered by Socket.io for immediate message delivery without refreshing or polling delay.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200/70 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={22} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Group Conversations</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              Easily initiate group messaging with multiple participants and manage dynamic chats.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200/70 bg-white hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Smart Auto-Scroll</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              Intelligent scrolling handles incoming messages smoothly without disrupting manual reading.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-md text-slate-500 relative z-10 bg-white">
        PulseChat . 2026
      </footer>
    </div>
  );
}