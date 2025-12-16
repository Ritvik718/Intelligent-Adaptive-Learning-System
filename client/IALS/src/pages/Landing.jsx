import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        {/* TITLE */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-indigo-400">
          Intelligent Adaptive Learning System
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-6 text-lg text-slate-300 leading-relaxed">
          A real-time AI-driven learning platform that understands learner
          engagement, emotion, and attention — and dynamically adapts content
          for maximum effectiveness.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/learning">
            <button className="px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition font-semibold text-slate-950 shadow-lg shadow-indigo-500/30">
              Start Learning
            </button>
          </Link>

          <Link to="/dashboard">
            <button className="px-8 py-3 rounded-xl bg-slate-900/70 border border-white/10 hover:bg-slate-900 transition font-semibold text-slate-200 backdrop-blur">
              Open Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
