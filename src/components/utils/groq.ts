const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function getGroqChatCompletion(messages: { role: string; content: string }[]) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
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
    throw new Error(`Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
