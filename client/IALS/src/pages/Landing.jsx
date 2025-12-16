import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <h1>Intelligent Adaptive Learning System</h1>
      <p style={{ maxWidth: "600px", marginTop: "10px" }}>
        An AI-powered platform that adapts learning experiences in real time
        based on user engagement and emotional state.
      </p>

      <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
        <Link to="/dashboard">
          <button>Open Dashboard</button>
        </Link>

        <Link to="/learning">
          <button>Start Learning</button>
        </Link>
      </div>
    </div>
  );
}
