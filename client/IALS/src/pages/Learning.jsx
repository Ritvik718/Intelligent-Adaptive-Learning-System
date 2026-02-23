import React, { useState, useEffect } from "react";

import WebcamCanvas from "../components/WebcamCanvas";
import ContentUploader from "../learning/ContentUploader";
import LearningEngine from "../learning/LearningEngine";
import TutorChat from "../learning/TutorChat";

export default function Learning() {
  const [engagement, setEngagement] = useState(0.6);
  const [content, setContent] = useState("");
  const [teachingMessage, setTeachingMessage] = useState("");

  useEffect(() => {
    if (content) {
      console.log("📄 PDF content loaded:", content.slice(0, 300));
    }
  }, [content]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-white overflow-hidden">
      {/* 🌌 Background Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 p-10 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-10">
        {/* ================= LEFT: MAIN LEARNING AREA ================= */}
        <div className="space-y-10">
          {/* 🔹 PAGE HEADER */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Adaptive Learning Interface
            </h1>
            <p className="text-slate-400 mt-2">
              Upload content, interact with AI, and experience real-time
              adaptive instruction.
            </p>
          </div>

          {/* 📄 PDF UPLOADER CARD */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-indigo-300">
                Content Upload
              </h3>
              <span className="text-xs uppercase tracking-wider text-slate-400">
                PDF / Study Material
              </span>
            </div>

            <ContentUploader onContentLoaded={setContent} />
          </div>

          {/* 🧠 LEARNING ENGINE CARD */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-purple-300">
                Adaptive Teaching Engine
              </h3>
              <span className="text-xs uppercase tracking-wider text-slate-400">
                AI Mode Switching
              </span>
            </div>

            <LearningEngine
              content={content}
              engagement={engagement}
              onTeachingUpdate={setTeachingMessage}
            />
          </div>

          {/* 💬 TUTOR CHAT CARD */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl hover:border-pink-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-pink-300">
                AI Tutor Conversation
              </h3>
              <span className="text-xs uppercase tracking-wider text-slate-400">
                Context-Aware Dialogue
              </span>
            </div>

            <TutorChat teachingMessage={teachingMessage} />
          </div>
        </div>

        {/* ================= RIGHT: LIVE MONITOR ================= */}
        <div className="xl:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl hover:border-emerald-500/30 transition-all duration-300">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-emerald-300">
                Live Learner Monitor
              </h3>

              {/* Engagement Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-white/10">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    engagement > 0.77
                      ? "bg-emerald-400 animate-pulse"
                      : engagement > 0.4
                        ? "bg-yellow-400 animate-pulse"
                        : "bg-red-400 animate-pulse"
                  }`}
                />
                <span className="text-sm text-slate-300">
                  {(engagement * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <WebcamCanvas
              onEngagementChange={setEngagement}
              onTriggerHint={() => {}}
            />

            <div className="mt-6 text-xs text-slate-400 space-y-2">
              <p>
                Engagement dynamically influences explanation depth, pacing, and
                adaptive teaching strategy.
              </p>
              <p className="text-slate-500">
                Real-time facial landmark analysis and emotion-aware mapping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
