import React from "react";

export default function Learning() {
  return (
    <div className="px-6 py-16 max-w-4xl mx-auto">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-slate-100">Learning Module</h1>

      {/* SUBTITLE */}
      <p className="mt-3 text-slate-400">
        Adaptive lessons, explanations, and assessments will appear here.
      </p>

      {/* CONTENT CARD */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-7">
        <h3 className="text-lg font-semibold text-slate-200">Coming Soon</h3>

        <p className="mt-2 text-slate-400">
          Content will dynamically adapt based on engagement.
        </p>
      </div>
    </div>
  );
}
