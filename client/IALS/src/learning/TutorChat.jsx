import React, { useState, useEffect } from "react";
import { callGemini } from "./geminiClient";

export default function TutorChat({ teachingMessage, mode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Inject generated teaching content
  useEffect(() => {
    if (teachingMessage) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: teachingMessage }],
        },
      ]);
    }
  }, [teachingMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      parts: [{ text: input }],
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const systemInstruction = {
        role: "user",
        parts: [
          {
            text: `You are an intelligent adaptive tutor.
Teaching mode: ${mode || "clarify"}.
Respond conversationally.
Do NOT repeat previous explanations unless explicitly asked.
Answer follow-up questions naturally.
Be concise but helpful.`,
          },
        ],
      };

      const conversationPayload = [systemInstruction, ...updatedMessages];

      const responseText = await callGemini(conversationPayload);

      const modelMessage = {
        role: "model",
        parts: [{ text: responseText }],
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Gemini error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "⚠️ Unable to respond. Please try again later." }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Render formatted content
  const renderFormattedText = (text) => {
    return text.split("\n").map((line, i) => {
      const trimmed = line.trim();

      // Section headings (1. Overview, 2. Key Info, etc.)
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <h4
            key={i}
            className="mt-4 mb-2 font-semibold text-indigo-400 text-base"
          >
            {trimmed}
          </h4>
        );
      }

      // Empty line spacing
      if (trimmed === "") {
        return <div key={i} className="h-2" />;
      }

      // Normal paragraph
      return (
        <p key={i} className="mb-2 text-sm leading-relaxed text-slate-200">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-4">
      <h3 className="text-indigo-300 font-semibold">Tutor Chat</h3>

      {/* Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg ${
              msg.role === "user"
                ? "bg-indigo-600/40 text-white ml-8"
                : "bg-slate-800 text-slate-200 mr-8"
            }`}
          >
            {msg.role === "model" ? (
              renderFormattedText(msg.parts[0].text)
            ) : (
              <p className="text-sm">{msg.parts[0].text}</p>
            )}
          </div>
        ))}

        {loading && <div className="text-xs text-slate-400">Thinking...</div>}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask a follow-up question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-slate-800 text-white border border-white/10 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
