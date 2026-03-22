import React, { useState, useRef, useEffect } from "react";
import { getGroqChatCompletion } from "./utils/groq";
import ChatCharacter from "./ChatCharacter";
import "./styles/ChatBot.css";
import { IoSend, IoClose } from "react-icons/io5";
import { BsChatFill } from "react-icons/bs";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi! I'm Prathmesh. How can I help you today?" },
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
      console.error("ChatBot error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having some trouble connecting right now. Please try again later!" },
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
    <div className="chatbot-container">
      <div className={`chatbot-wrapper ${isOpen ? "open" : ""}`}>
        {isOpen && <ChatCharacter />}
        
        <div className={`chat-box ${!isOpen ? "hidden" : ""}`}>
          <div className="chat-header">
            <h4>Chat with Prathmesh</h4>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              <IoClose size={20} />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role === "user" ? "user" : "bot"}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="message bot typing-indicator">
                Prathmesh is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend} disabled={isLoading}>
              <IoSend size={18} />
            </button>
          </div>
        </div>

        <div className={`chat-toggle ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? <BsChatFill size={25} /> : <IoClose size={25} />}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
