import { useState } from "react";
import WebcamCanvas from "../components/WebcamCanvas";
import Dashboard from "../components/Dashboard";
import HintModal from "../components/HintModal";

export default function DashboardPage() {
  const [engagement, setEngagement] = useState(1.0);
  const [hintVisible, setHintVisible] = useState(false);

  return (
    <div className="app">
      <h1>Intelligent Adaptive Learning System</h1>

      <div className="layout">
        <WebcamCanvas
          onEngagementChange={setEngagement}
          onTriggerHint={() => setHintVisible(true)}
        />

        <Dashboard engagement={engagement} />
      </div>

      <HintModal visible={hintVisible} onClose={() => setHintVisible(false)} />
    </div>
  );
}
