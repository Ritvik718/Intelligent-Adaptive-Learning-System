import React from "react";
import { useState } from "react";
import WebcamCanvas from "../components/WebcamCanvas";
import Dashboard from "../components/Dashboard";
import HintModal from "../components/HintModal";

export default function DashboardPage() {
  const [engagement, setEngagement] = useState(1.0);
  const [hintVisible, setHintVisible] = useState(false);

  return (
    <div className="px-10 py-10">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-slate-100 mb-8">
        Learner Monitoring & Analytics
      </h1>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-7">
        {/* CAMERA CARD */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5">
          <h3 className="text-sm text-slate-300 mb-4">Learner Monitoring</h3>

          <WebcamCanvas
            onEngagementChange={setEngagement}
            onTriggerHint={() => setHintVisible(true)}
          />
        </div>

        {/* ANALYTICS CARD */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5">
          <Dashboard engagement={engagement} />
        </div>
      </div>

      {/* HINT MODAL */}
      <HintModal visible={hintVisible} onClose={() => setHintVisible(false)} />
    </div>
  );
}
