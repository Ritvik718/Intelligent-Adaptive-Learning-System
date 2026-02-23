const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function callGemini(input) {
  if (!API_KEY) {
    throw new Error("Gemini API key not found.");
  }

  // If string → wrap into proper format
  const formattedMessages = Array.isArray(input)
    ? input
    : [
        {
          role: "user",
          parts: [{ text: input }],
        },
      ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedMessages,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", data);
    throw new Error("Gemini API request failed");
  }

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "⚠️ No response generated."
  );
}
