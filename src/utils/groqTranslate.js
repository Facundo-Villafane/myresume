const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const translateSpanishToEnglish = async (text) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const model = import.meta.env.VITE_GROQ_TRANSLATION_MODEL || "llama-3.1-8b-instant";

  if (!text?.trim()) {
    throw new Error("Primero escribe el texto en español.");
  }

  if (!apiKey) {
    throw new Error("Falta VITE_GROQ_API_KEY en tu archivo .env.local.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "Translate from Spanish to natural English. Preserve names, brands, URLs, line breaks, formatting, and tone. Return only the translated text.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq respondió con error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
};
