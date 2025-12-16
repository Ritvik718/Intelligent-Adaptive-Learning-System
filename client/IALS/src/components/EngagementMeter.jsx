export default function EngagementMeter({ value }) {
  const pct = Math.round(value * 100);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Engagement</h3>
      <div
        style={{
          height: "20px",
          width: "300px",
          background: "#eee",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: pct > 70 ? "green" : pct > 40 ? "orange" : "red",
            transition: "width 0.3s",
          }}
        />
      </div>
      <p>{pct}%</p>
    </div>
  );
}
