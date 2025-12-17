import React, { useState, useEffect } from "react";

import WebcamCanvas from "../components/WebcamCanvas";
import ContentUploader from "../learning/ContentUploader";
import LearningEngine from "../learning/LearningEngine";
import TutorChat from "../learning/TutorChat";

export default function Learning() {
  // 🔹 Engagement from webcam (0 → 1)
  const [engagement, setEngagement] = useState(0.6);

  // 🔹 Extracted content from PDF
  const [content, setContent] = useState("");

  // 🔹 Teaching output from LearningEngine
  const [teachingMessage, setTeachingMessage] = useState("");

  // Optional: debug PDF ingestion
  useEffect(() => {
    if (content) {
      console.log("📄 PDF content loaded:", content.slice(0, 300));
    }
  }, [content]);

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* ================= LEFT: LEARNING ================= */}
      <div className="xl:col-span-2 space-y-6">
        {/* PDF UPLOAD */}
        <ContentUploader onContentLoaded={setContent} />

        {/* CORE LEARNING ENGINE */}
        <LearningEngine
          content={content}
          engagement={engagement}
          onTeachingUpdate={setTeachingMessage}
        />

        {/* AI TUTOR CHAT */}
        <TutorChat teachingMessage={teachingMessage} />
      </div>

      {/* ================= RIGHT: CAMERA ================= */}
      <div className="xl:col-span-1">
        <div className="sticky top-24 bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-3">
          <h3 className="text-indigo-300 font-semibold">
            Live Learner Monitor
          </h3>

          <WebcamCanvas
            onEngagementChange={setEngagement}
            onTriggerHint={() => {}}
          />

          <p className="text-xs text-slate-400">
            Engagement influences teaching depth and pacing.
          </p>

          <p className="text-xs text-slate-500">
            Current engagement:{" "}
            <span className="text-indigo-400 font-semibold">
              {(engagement * 100).toFixed(0)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
