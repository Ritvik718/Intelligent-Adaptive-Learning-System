import React, { useEffect, useState } from "react";
import { getTeachingPrompt } from "./promptTemplates";
import { callGemini } from "./geminiClient";

export default function LearningEngine({
  engagement,
  content,
  onTeachingUpdate,
}) {
  const [mode, setMode] = useState("clarify");
  const [lastGenerated, setLastGenerated] = useState("never");
  const [loading, setLoading] = useState(false);

  // 🎯 Engagement → Teaching Mode
  const getModeFromEngagement = (value) => {
    if (value < 0.4) return "simplify";
    if (value < 0.77) return "clarify";
    return "deepen";
  };

  // 🔁 Update mode whenever engagement changes
  useEffect(() => {
    const newMode = getModeFromEngagement(engagement);
    setMode(newMode);
  }, [engagement]);

  // 🚀 Manual Gemini trigger
  const handleGenerate = async () => {
    if (!content) {
      onTeachingUpdate("⚠️ Please upload content first.");
      return;
    }

    try {
      setLoading(true);

      const prompt = getTeachingPrompt({
        content,
        mode,
      });

      const response = await callGemini(prompt);

      onTeachingUpdate(response);
      setLastGenerated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("❌ Gemini error:", err);
      onTeachingUpdate(
        "⚠️ Unable to generate teaching response. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 space-y-4">
      <h3 className="text-indigo-300 font-semibold">
        Adaptive Teaching Engine
      </h3>

      <p className="text-sm text-slate-300">
        Teaching Mode:{" "}
        <span className="font-semibold capitalize text-indigo-400">{mode}</span>
      </p>

      <p className="text-xs text-slate-400">
        Engagement: <b>{engagement.toFixed(2)}</b>
      </p>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition"
      >
        {loading ? "Generating..." : "Generate Teaching"}
      </button>

      <p className="text-xs text-slate-500">Last generated: {lastGenerated}</p>
    </div>
  );
}
