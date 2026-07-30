import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Mic, MicOff, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import './ChatWidget.css';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to **PlanNgo Assistant**. How can we help you today with your travel questions?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputMsg(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  if (!user) return null; // Only show floating widget when logged in

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const query = inputMsg.trim();
    if (!query) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', content: query, time: timeStr }]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await tripService.queryChat(query);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: res.reply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble connecting. Please try again.', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget-wrapper">
      {/* Expanded Chat Widget Window */}
      {isOpen && (
        <div className="chat-widget-card animate-fade-in">
          {/* Header styled like reference image */}
          <div className="chat-widget-header">
            <div className="widget-header-title">
              <div className="widget-logo-badge">
                <Bot size={20} color="#FFFFFF" />
              </div>
              <div className="widget-title-text">
                <h3>PlanNgo Assistant</h3>
                <span className="online-indicator">● Online</span>
              </div>
            </div>
            <button className="widget-close-btn" onClick={() => setIsOpen(false)} aria-label="Minimize Chat">
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="chat-widget-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`widget-msg-row ${msg.role === 'user' ? 'row-user' : 'row-assistant'}`}>
                <div className="widget-bubble">
                  {msg.content}
                </div>
                <small className="widget-msg-meta">
                  PlanNgo • {msg.time}
                </small>
              </div>
            ))}

            {loading && (
              <div className="widget-msg-row row-assistant">
                <div className="widget-bubble widget-typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Listening State indicator */}
          {isListening && (
            <div className="widget-voice-banner">
              <Mic size={14} className="pulse-icon" /> Listening... Speak now!
            </div>
          )}

          {/* Input & Form Area */}
          <form className="chat-widget-input-form" onSubmit={handleSend}>
            <div className="input-pill-wrapper">
              <input
                type="text"
                placeholder="Type your query ..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                disabled={loading}
              />
              <button 
                type="button" 
                className={`widget-mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleVoiceInput}
                title="Voice Input"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <button type="submit" className="widget-send-btn" disabled={loading || !inputMsg.trim()} aria-label="Send">
              <Send size={16} />
            </button>
          </form>

          <div className="widget-footer-tag">
            PlanNgo AI • Secure & Confidential
          </div>
        </div>
      )}

      {/* Circular Floating Launcher Button at Bottom Right */}
      <button 
        className={`chat-widget-launcher ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open PlanNgo Chat Assistant"
        title="Chat with PlanNgo Assistant"
      >
        <div className="launcher-icon-inner">
          {isOpen ? <X size={26} color="#FFFFFF" /> : <Bot size={26} color="#FFFFFF" />}
        </div>
      </button>
    </div>
  );
};

export default ChatWidget;
