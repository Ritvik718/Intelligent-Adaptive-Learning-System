import React, { useState } from "react";

/**
 * TutorChat
 * ----------
 * Displays adaptive teaching messages
 * Accepts learner input
 * LLM integration will replace `mockTutorResponse`
 */

export default function TutorChat({ teachingMessage }) {
  const [messages, setMessages] = useState([
    {
      role: "tutor",
      content:
        "Hi! I’m your adaptive learning assistant. Let’s start learning together.",
    },
  ]);

  const [input, setInput] = useState("");

  // 🧠 Temporary response generator (LLM-ready)
  function mockTutorResponse(userText) {
    return `That’s a good question. Based on your progress, here’s a simple explanation:\n\n${teachingMessage}`;
  }

  function handleSend() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const tutorMsg = {
      role: "tutor",
      content: mockTutorResponse(input),
    };

    setMessages((prev) => [...prev, userMsg, tutorMsg]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-[500px] bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden">
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/10 text-indigo-300 font-semibold">
        Adaptive Tutor
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-line ${
              msg.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="border-t border-white/10 p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question or request clarification..."
          className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-md outline-none text-sm"
        />

        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
