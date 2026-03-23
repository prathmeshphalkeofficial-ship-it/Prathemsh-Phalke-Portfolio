import React, { useState, useRef, useEffect } from "react";
import { getGroqChatCompletion } from "./utils/groq";
import "./styles/ChatBot.css";
import { IoSend, IoClose, IoMic, IoMicOff, IoVolumeHigh, IoStop } from "react-icons/io5";
import { BsChatFill } from "react-icons/bs";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi! I'm Prathmesh. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? " " : "") + transcript);
        setIsListening(false);

        // Auto-send after a short delay to allow React state to update the DOM
        setTimeout(() => {
          const sendBtn = document.querySelector('.chatbot-container .send-btn') as HTMLButtonElement;
          if (sendBtn && !sendBtn.disabled) {
            sendBtn.click();
          }
        }, 500);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text: string, index: number) => {
    if (window.speechSynthesis.speaking && currentlySpeaking === index) {
      window.speechSynthesis.cancel();
      setCurrentlySpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => setCurrentlySpeaking(null);
    utterance.onerror = () => setCurrentlySpeaking(null);

    setCurrentlySpeaking(index);
    window.speechSynthesis.speak(utterance);
  };
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
        <div className={`chat-box ${!isOpen ? "hidden" : ""}`}>
          <div className="chat-header">
            <div className="header-info">
              <div className="status-dot"></div>
              <h4>Chat with Prathmesh</h4>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              <IoClose size={20} />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role === "user" ? "user" : "bot"}`}>
                <div className="message-content-wrapper">
                  {msg.content}
                  {msg.role === "assistant" && (
                    <button 
                      className="listen-voice-btn" 
                      onClick={() => speak(msg.content, index)} 
                      title={currentlySpeaking === index ? "Stop listening" : "Listen"}
                    >
                      {currentlySpeaking === index ? <IoStop size={14} /> : <IoVolumeHigh size={14} />}
                    </button>
                  )}
                </div>
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
            <button 
              className={`mic-voice-btn ${isListening ? "active" : ""}`} 
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <IoMicOff size={18} /> : <IoMic size={18} />}
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-btn" onClick={handleSend} disabled={isLoading}>
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
