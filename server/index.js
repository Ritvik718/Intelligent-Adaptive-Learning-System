import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// temporary in-memory storage (you can replace this with a DB)
let sessionData = [];

// POST endpoint for engagement/emotion logs
app.post("/api/log", (req, res) => {
  const { userId, timestamp, emotion, engagement } = req.body;

  if (!userId || !timestamp)
    return res.status(400).json({ message: "Invalid log payload" });

  sessionData.push({ userId, timestamp, emotion, engagement });

  // simple adaptive rule
  let action = "continue";
  if (engagement < 0.4) action = "show_hint";
  else if (engagement > 0.9) action = "increase_difficulty";

  res.json({ status: "ok", action });
});

// GET endpoint to view all logs
app.get("/api/logs", (req, res) => {
  res.json(sessionData);
});

// Save logs periodically
setInterval(() => {
  fs.writeFileSync(
    "./data/sessionLogs.json",
    JSON.stringify(sessionData, null, 2)
  );
}, 30000);

app.listen(PORT, () => console.log(`✅ IALS Server running on port ${PORT}`));
