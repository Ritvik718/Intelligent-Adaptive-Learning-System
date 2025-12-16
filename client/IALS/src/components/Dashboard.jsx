import React, { useEffect, useState } from "react";
import { sessionTracker } from "../utils/sessionTracker";
import EngagementChart from "./EngagementChart";
import EmotionStats from "./EmotionStats";

export default function Dashboard() {
  const [data, setData] = useState(sessionTracker.getSummary());

  useEffect(() => {
    const interval = setInterval(() => {
      setData({ ...sessionTracker.getSummary() });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Learning Dashboard</h2>

      <EngagementChart data={data.engagementHistory} />
      <EmotionStats emotions={data.emotionCounts} />

      <h3>Hints Triggered</h3>
      <ul>
        {data.hints.map((h, i) => (
          <li key={i}>
            {new Date(h.time).toLocaleTimeString()} – {h.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
