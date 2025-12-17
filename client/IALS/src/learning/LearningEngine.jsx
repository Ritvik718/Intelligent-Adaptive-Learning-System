import React, { useEffect, useState, useRef } from "react";
import { getTeachingPrompt } from "./promptTemplates";

export default function LearningEngine({
  engagement,
  content,
  onTeachingUpdate,
}) {
  const [mode, setMode] = useState("clarify");
  const [lastUpdated, setLastUpdated] = useState("never");

  // 🔒 Stable ref (prevents effect restart bugs)
  const updateRef = useRef(onTeachingUpdate);
  updateRef.current = onTeachingUpdate;

  const getModeFromEngagement = (value) => {
    if (value < 0.4) return "simplify";
    if (value < 0.77) return "clarify";
    return "deepen";
  };

  useEffect(() => {
    console.log("🟢 LearningEngine mounted");

    const interval = setInterval(() => {
      const newMode = getModeFromEngagement(engagement);

      console.log(
        "🧠 ENGINE TICK",
        "| engagement:",
        engagement.toFixed(2),
        "| mode:",
        newMode,
        "| content length:",
        content?.length ?? 0,
        "| time:",
        new Date().toLocaleTimeString()
      );

      setMode((prev) => {
        if (prev !== newMode) {
          console.log("🔁 MODE CHANGE:", prev, "→", newMode);
        }
        return newMode;
      });

      setLastUpdated(new Date().toLocaleTimeString());

      // Even if content is empty, update UI
      const teachingText = content
        ? getTeachingPrompt({ content, mode: newMode })
        : `[${newMode.toUpperCase()} MODE] Waiting for content...`;

      updateRef.current(teachingText);
    }, 5000); // 🔥 5 seconds

    return () => {
      console.log("🔴 LearningEngine unmounted");
      clearInterval(interval);
    };
  }, [engagement, content]);

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 space-y-3">
      <h3 className="text-indigo-300 font-semibold">
        Adaptive Teaching Engine
      </h3>

      <p className="text-sm text-slate-300">
        Teaching Mode:{" "}
        <span className="font-semibold capitalize text-indigo-400">{mode}</span>
      </p>

      <p className="text-xs text-slate-400">
        Engine tick every <b>5 seconds</b> (testing)
      </p>

      <p className="text-xs text-slate-500">Last update: {lastUpdated}</p>
    </div>
  );
}
