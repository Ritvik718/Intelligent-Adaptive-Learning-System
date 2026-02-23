import React, { useState } from "react";
import WebcamCanvas from "../components/WebcamCanvas";
import Dashboard from "../components/Dashboard";
import HintModal from "../components/HintModal";

export default function DashboardPage() {
  const [engagement, setEngagement] = useState(1.0);
  const [hintVisible, setHintVisible] = useState(false);

  return (
    <div className="relative min-h-screen px-10 py-12 bg-gradient-to-br from-black via-slate-950 to-slate-900 text-white overflow-hidden">
      {/* 🌌 Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learner Monitoring & Analytics
            </h1>
            <p className="text-slate-400 mt-2">
              Real-time engagement tracking and adaptive learning insights.
            </p>
          </div>

          {/* 🔥 Live Engagement Badge */}
          <div className="mt-6 md:mt-0">
            <div className="px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  engagement > 0.77
                    ? "bg-emerald-400 animate-pulse"
                    : engagement > 0.4
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-red-400 animate-pulse"
                }`}
              />

              <span className="text-sm text-slate-300">Engagement Score:</span>

              <span className="text-lg font-semibold text-indigo-400">
                {(engagement * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-8">
          {/* 🎥 CAMERA PANEL */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-2xl hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-indigo-300">
                Live Learner Monitoring
              </h3>

              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Real-Time Camera Feed
              </div>
            </div>

            <WebcamCanvas
              onEngagementChange={setEngagement}
              onTriggerHint={() => setHintVisible(true)}
            />
          </div>

          {/* 📊 ANALYTICS PANEL */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-2xl hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-purple-300">
                Engagement Analytics
              </h3>

              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Adaptive Insights
              </div>
            </div>

            <Dashboard engagement={engagement} />
          </div>
        </div>
      </div>

      {/* 💡 Hint Modal */}
      <HintModal visible={hintVisible} onClose={() => setHintVisible(false)} />
    </div>
  );
}
