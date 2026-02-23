import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const app = express();
const upload = multer();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

console.log("Sarvam key exists:", !!process.env.SARVAM_API_KEY);

/* ====================================
   🎙 SARVAM STT
==================================== */
app.post("/api/sarvam-stt", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: "audio.webm",
      contentType: "audio/webm",
    });

    formData.append("model", "saarika:v1");

    const response = await fetch(
      "https://api.sarvam.ai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
        },
        body: formData,
      },
    );

    const data = await response.json();
    console.log("Sarvam STT response:", data);

    res.json(data);
  } catch (err) {
    console.error("STT error:", err);
    res.status(500).json({ error: "STT failed" });
  }
});

/* ====================================
   🔊 SARVAM TTS
==================================== */
app.post("/api/sarvam-tts", async (req, res) => {
  try {
    const { text, language } = req.body;

    const response = await fetch("https://api.sarvam.ai/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
      },
      body: JSON.stringify({
        model: "bulbul:v1",
        input: text,
        voice: language || "en-IN",
      }),
    });

    const audioBuffer = await response.arrayBuffer();

    res.set({
      "Content-Type": "audio/mpeg",
    });

    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: "TTS failed" });
  }
});

/* ====================================
   SERVER START
==================================== */
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});
