import React, { useState, useRef, useEffect } from "react";
import "./styles/ChatSection.css";
import { getGroqChatCompletion } from "./utils/groq";
import { IoSend } from "react-icons/io5";

const ChatSection = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hey! Want to chat about my work or tech stack? Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getGroqChatCompletion([...messages, userMessage]);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("ChatSection error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having a bit of trouble right now. Feel free to reach out via the contact section!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-section" id="chat">
      <div className="chat-section-container">
        <div className="chat-section-info">
          <h2 className="title">CHAT <span>WITH</span> ME</h2>
          <p className="para">
            Have questions about my projects, skills, or just want to say hi? 
            My AI double is here to help you 24/7!
          </p>
        </div>
        
        <div className="chat-section-box">
          <div className="chat-section-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-section-message ${msg.role === "user" ? "user" : "bot"}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-section-message bot typing">
                <div className="message-content">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-section-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend} disabled={isLoading}>
              <IoSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
