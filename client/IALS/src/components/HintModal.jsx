import React from "react";

export default function HintModal({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "25px 35px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
          textAlign: "center",
          width: "320px",
        }}
      >
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Stay Focused 👀</h2>
        <p style={{ marginBottom: "20px", color: "#555" }}>
          It seems your engagement dropped a bit. Let’s take a quick breather or
          review the concept again!
        </p>
        <button
          onClick={onClose}
          style={{
            padding: "8px 18px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
