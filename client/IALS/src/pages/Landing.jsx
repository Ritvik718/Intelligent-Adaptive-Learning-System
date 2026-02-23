import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-black via-slate-950 to-slate-900 text-white">
      {/* Floating Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-5xl text-center backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-6">
          AI-Driven | Real-Time | Emotion Adaptive
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Intelligent Adaptive Learning System
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          A next-generation AI learning platform that detects engagement,
          analyzes emotional cues, and dynamically adapts instructional depth in
          real time — delivering truly personalized education.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center flex-wrap">
          {/* Start Learning */}
          <Link to="/learning">
            <button className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50">
              <span className="relative z-10">Start Learning</span>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl transition"></div>
            </button>
          </Link>

          {/* Dashboard */}
          <Link to="/dashboard">
            <button className="px-10 py-4 rounded-2xl bg-slate-900/60 border border-white/10 font-semibold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800 hover:scale-105">
              Open Dashboard
            </button>
          </Link>

          {/* 🎤 Multilingual Voice Tutor */}
          <Link to="/voice-tutor">
            <button className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50">
              <span className="relative z-10">Multilingual AI Voice Tutor</span>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 to-emerald-400 blur-xl transition"></div>
            </button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition">
            <h3 className="text-indigo-400 font-semibold mb-2">
              Real-Time Emotion Detection
            </h3>
            <p className="text-sm text-slate-400">
              Uses facial landmarks and engagement analytics to measure
              attention dynamically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition">
            <h3 className="text-indigo-400 font-semibold mb-2">
              Adaptive Teaching Engine
            </h3>
            <p className="text-sm text-slate-400">
              Switches between simplify, clarify, and deepen modes based on
              learner behavior.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition">
            <h3 className="text-emerald-400 font-semibold mb-2">
              Multilingual Voice AI
            </h3>
            <p className="text-sm text-slate-400">
              Speak in any supported language. Get instant AI explanations in
              English.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
