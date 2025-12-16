import React from "react";
import EmotionStats from "./EmotionStats";
import EngagementTimeline from "./EngagementTimeline";

export default function Dashboard({ engagement }) {
  return (
    <div className="flex flex-col gap-6">
      {/* CURRENT ENGAGEMENT */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4">
        <h3 className="text-sm text-slate-300 mb-2">Current Engagement</h3>

        <p className="text-3xl font-bold text-indigo-400">
          {(engagement * 100).toFixed(0)}%
        </p>
      </div>

      {/* ENGAGEMENT TIMELINE */}
      <div className="rounded-2xl border border-indigo-400/30 bg-gradient-to-b from-indigo-500/10 to-slate-900/60 backdrop-blur-xl p-5 shadow-lg shadow-indigo-500/10">
        <h3 className="text-sm text-slate-200 mb-4">Engagement Timeline</h3>

        {/* Fixed-height graph container */}
        <div className="relative h-[240px] w-full rounded-xl bg-gradient-to-b from-white/5 to-white/0 overflow-hidden">
          <EngagementTimeline />
        </div>
      </div>

      {/* EMOTION DISTRIBUTION */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4">
        <h3 className="text-sm text-slate-300 mb-4">Emotion Distribution</h3>

        <EmotionStats />
      </div>
    </div>
  );
}
