export default function EmotionStats({ emotions }) {
  const total = Object.values(emotions).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h3>Emotion Distribution</h3>
      <ul>
        {Object.entries(emotions).map(([k, v]) => (
          <li key={k}>
            {k}: {((v / total) * 100).toFixed(1)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
