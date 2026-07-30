import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Mic, MicOff, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { tripService } from '../services/tripService';
import ItineraryView from './ItineraryView';
import './AIChat.css';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! Welcome to **PlanNgo Voice & AI Travel Assistant**. Ask me any doubts about **destinations, local culture, food, tipping etiquette, best time to visit, safety, or request a custom trip plan!** Click the **Microphone** button to speak your question.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "What is the local culture and tipping etiquette in Japan?",
    "What authentic local foods should I try in Rome?",
    "What is the best month weather to visit Dubai?",
    "Plan a 3 day trip to Paris with $1,500 budget."
  ]);

  const messagesContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Internal container scroll to prevent window page jumping
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Speech Recognition setup
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

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
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
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !speechSynthesisEnabled) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsThinking(true);

    try {
      const response = await tripService.queryChat(query);

      if (response.suggested_prompts) {
        setSuggestedPrompts(response.suggested_prompts);
      }

      const aiReply = {
        role: 'assistant',
        content: response.reply,
        master_output: response.master_output,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiReply]);
      speakText(response.reply);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an issue processing your request. Please ensure the backend server is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="aichat-page animate-fade-in">
      <div className="chat-container card">
        <div className="chat-header">
          <div className="chat-title flex-align">
            <Bot size={24} className="master-ai-icon" />
            <div>
              <h2>PlanNgo AI Voice & Travel Assistant</h2>
              <p className="subtitle">Ask about local culture, food, etiquette, places, weather, or plan a trip</p>
            </div>
          </div>
          <div className="chat-controls flex-align">
            <button 
              className={`icon-btn ${speechSynthesisEnabled ? 'speech-on' : ''}`}
              onClick={() => setSpeechSynthesisEnabled(!speechSynthesisEnabled)}
              title={speechSynthesisEnabled ? "Voice Readout ON" : "Turn Voice Readout ON"}
            >
              {speechSynthesisEnabled ? <Volume2 size={18} color="#10B981" /> : <VolumeX size={18} />}
            </button>
            <span className="badge badge-success flex-align">
              <Sparkles size={12} /> Voice & AI Ready
            </span>
          </div>
        </div>

        {/* Messages Stream with Container Ref (No outer window jump) */}
        <div className="chat-messages" ref={messagesContainerRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message msg-${msg.role}`}>
              <div className="msg-avatar">
                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className="msg-bubble">
                <div className="msg-sender">
                  {msg.role === 'assistant' ? 'PlanNgo Assistant' : 'You'} • <small>{msg.timestamp}</small>
                </div>
                <div className="msg-text" style={{ whitespace: 'pre-line' }}>{msg.content}</div>

                {/* Inline Itinerary Display (if full itinerary requested) */}
                {msg.master_output && (
                  <div className="inline-itinerary-preview">
                    <ItineraryView tripData={msg.master_output} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="chat-message msg-assistant thinking-bubble">
              <div className="msg-avatar"><Bot size={18} /></div>
              <div className="msg-bubble">
                <div className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="typing-label">Analyzing travel knowledge & culture guides...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Listening Banner */}
        {isListening && (
          <div className="voice-listening-bar">
            <Mic size={18} className="pulse-mic" /> Listening... Speak your doubt about places, culture, or trip!
          </div>
        )}

        {/* Suggested Prompts */}
        <div className="suggested-prompts-bar">
          <span className="prompts-label">Suggested:</span>
          <div className="prompts-scroll">
            {suggestedPrompts.map((p, i) => (
              <button key={i} className="prompt-chip" onClick={() => handleSendMessage(p)}>
                {p} <ChevronRight size={12} />
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="chat-input-area">
          <input
            type="text"
            placeholder="Ask anything: What is the culture in Japan? Or click Mic to speak..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={isThinking}
          />
          <button 
            type="button" 
            className={`voice-input-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoiceInput}
            title={isListening ? "Stop Voice Input" : "Start Voice Input"}
            disabled={isThinking}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button type="submit" className="btn-primary send-btn" disabled={isThinking || !inputMsg.trim()}>
            {isThinking ? <Loader2 size={18} className="spin" /> : <><Send size={18} /> Send</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
