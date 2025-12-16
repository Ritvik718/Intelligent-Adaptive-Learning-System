import React from "react";
import { useEffect, useState } from "react";
import { sessionTracker } from "../utils/sessionTracker";

export default function EmotionStats() {
  const [emotions, setEmotions] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const data = sessionTracker.getEmotions();
      setEmotions(data || {});
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const total = Object.values(emotions).reduce((sum, v) => sum + v, 0);

  if (total === 0) {
    return (
      <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
        No emotion data yet
      </p>
    );
  }

  return (
    <div style={{ fontSize: "14px" }}>
      {Object.entries(emotions).map(([emotion, count]) => (
        <div
          key={emotion}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span>{emotion}</span>
          <span>{((count / total) * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}
