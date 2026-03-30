import React, { useState, useRef, useEffect } from "react";
import "./styles/ChatSection.css";
import { getGroqChatCompletion } from "./utils/groq";
import { IoSend, IoMic, IoMicOff, IoVolumeHigh, IoStop } from "react-icons/io5";


const ChatSection = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hey! Want to chat about my work or tech stack? Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
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
          const sendBtn = document.querySelector('.chat-section .send-btn') as HTMLButtonElement;
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

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

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
    
    // Small timeout to ensure the user message render happens instantly
    setTimeout(async () => {
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
    }, 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
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
          <div className="chat-section-header">
            <div className="header-info">
              <div className="status-dot"></div>
              <h4>Chat with Prathmesh</h4>
            </div>
          </div>
          <div className="chat-section-messages" ref={messagesContainerRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-section-message ${msg.role === "user" ? "user" : "bot"}`}>
                <div className="message-content">{msg.content}</div>
                {msg.role === "assistant" && (
                  <button 
                    className="listen-btn" 
                    onClick={() => speak(msg.content, index)} 
                    title={currentlySpeaking === index ? "Stop listening" : "Listen to response"}
                  >
                    {currentlySpeaking === index ? <IoStop size={16} /> : <IoVolumeHigh size={16} />}
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chat-section-message bot typing">
                <div className="message-content">Prathmesh is typing...</div>
              </div>
            )}
          </div>
          
          <div className="chat-section-input">
            <button 
              className={`mic-btn ${isListening ? "active" : ""}`} 
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <IoMicOff size={20} /> : <IoMic size={20} />}
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-btn" onClick={handleSend} disabled={isLoading}>
              <IoSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
