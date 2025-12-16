export default function EngagementChart({ data }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Engagement Timeline</h3>
      <div
        style={{
          display: "flex",
          gap: "2px",
          height: "100px",
          alignItems: "flex-end",
          background: "#eee",
          padding: "5px",
        }}
      >
        {data.slice(-50).map((d, i) => (
          <div
            key={i}
            style={{
              width: "4px",
              height: `${d.value * 100}px`,
              background: d.value > 0.6 ? "green" : "red",
            }}
          />
        ))}
      </div>
    </div>
  );
}
