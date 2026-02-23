import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function VoiceTutor() {
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [language, setLanguage] = useState("hi-IN");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);

  // ================= WAVEFORM =================
  const animateWaveform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = "rgba(99,102,241,0.85)";
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // ================= RECORDING =================
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    source.connect(analyserRef.current);

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      setStatus("transcribing");
      const blob = new Blob(chunksRef.current, { type: "audio/wav" });
      await sendToBackend(blob);
    };

    mediaRecorder.start();
    setRecording(true);
    setStatus("listening");
    animateWaveform();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    cancelAnimationFrame(animationRef.current);
    setRecording(false);
  };

  // ================= BACKEND =================
  const sendToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("language", language);

    const response = await fetch("http://localhost:8000/stt", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.original_text) {
      setMessages((prev) => [
        ...prev,
        { type: "original", text: data.original_text },
        { type: "translated", text: data.translated_text },
        { type: "ai", text: data.ai_response },
      ]);
    }

    setStatus("idle");
  };

  // ================= STATUS BADGE =================
  const getStatusUI = () => {
    if (status === "listening")
      return (
        <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30 animate-pulse">
          Listening...
        </span>
      );
    if (status === "transcribing")
      return (
        <span className="px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-400 text-xs border border-indigo-500/30 animate-pulse">
          Transcribing...
        </span>
      );
    return (
      <span className="px-4 py-2 rounded-full bg-white/5 text-slate-400 text-xs border border-white/10">
        Idle
      </span>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-10 py-12 flex flex-col h-screen">
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Multilingual AI Voice Tutor
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Speak in your language. Get structured AI explanations instantly.
            </p>
          </div>
          {getStatusUI()}
        </div>

        {/* LANGUAGE SELECTOR */}
        <div className="mb-6">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="ta-IN">Tamil</option>
            <option value="te-IN">Telugu</option>
          </select>
        </div>

        {/* EXPANDED CHAT PANEL */}
        <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-2xl overflow-y-auto space-y-10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border border-white/10 ${
                msg.type === "ai" ? "bg-slate-800/60" : "bg-indigo-600/10"
              }`}
            >
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-4">
                {msg.type === "original" && "Original Speech"}
                {msg.type === "translated" && "Translated to English"}
                {msg.type === "ai" && "AI Response"}
              </div>

              {msg.type === "ai" ? (
                <div className="prose prose-invert max-w-none text-xl leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-xl leading-relaxed">{msg.text}</div>
              )}
            </div>
          ))}

          {status === "transcribing" && (
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 animate-pulse">
              Processing speech and generating response...
            </div>
          )}
        </div>

        {/* WAVEFORM */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={1400}
            height={160}
            className="w-full"
          />
        </div>

        {/* MIC BUTTON */}
        <div className="mt-8 flex justify-center">
          {!recording ? (
            <button
              onClick={startRecording}
              className="px-20 py-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all duration-300 shadow-2xl shadow-indigo-600/40 text-2xl font-semibold"
            >
              🎤 Start Speaking
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-20 py-6 rounded-full bg-red-600 animate-pulse shadow-2xl text-2xl font-semibold"
            >
              ⏹ Stop Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
