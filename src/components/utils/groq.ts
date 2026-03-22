const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile", "llama-3-70b-8192", "llama-3-8b-8192"];

export async function getGroqChatCompletion(messages: { role: string; content: string }[]) {
  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is missing! Please check your environment variables.");
    throw new Error("API Key Missing");
  }

  let lastError: any = null;

  // Try each model until one works (fallback system)
  for (const model of MODELS) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: "You are Prathmesh Phalke, a talented Full Stack Web Developer and Architecture student. You are professional yet friendly. You build scalable web solutions and AI-powered tools like Krishi Bot. You combine technical expertise with strong design thinking. Keep your responses concise and engaging. Speak as if you are Prathmesh yourself talking to a visitor on your portfolio.",
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Groq API error with model ${model}:`, response.status, errorData);
        lastError = new Error(`Groq API error: ${response.status} ${errorData.error?.message || response.statusText}`);
        continue; // Try next model
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`Request failed for model ${model}:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error("All Groq models failed");
}
