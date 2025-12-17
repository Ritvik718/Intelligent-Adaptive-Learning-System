import React, { useEffect, useState } from "react";
import { sessionTracker } from "../utils/sessionTracker";

export default function EmotionStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(sessionTracker.getEmotionStats());
    }, 1000); // refresh every second

    return () => clearInterval(interval);
  }, []);

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return <p className="text-slate-400">No emotion data yet</p>;
  }

  return (
    <div className="space-y-2">
      {Object.entries(stats).map(([emotion, count]) => (
        <div key={emotion} className="flex justify-between text-sm">
          <span className="capitalize">{emotion}</span>
          <span>{((count / total) * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}
