// src/components/Chatbot.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button'; // shadcn-ui Button
import { Input } from './ui/input';   // shadcn-ui Input
import { MessageSquare, Send, X } from 'lucide-react'; // Icons

// !! WARNING: Storing API key in frontend is INSECURE !!
// For demo purposes only. In production, use a backend proxy.
const GROQ_API_KEY = "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"; 
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama3-8b-8192"; // or "mixtral-8x7b-32768", "llama3-70b-8192"

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Harbor Watch AI. How can I assist you with coastal data today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;

    // 🔹 Append word-limit instruction to every prompt
    const newUserMessage: Message = { 
      role: 'user', 
      content: inputValue + " (Please answer concisely in under 80 words.)" 
    };

    const allMessages = [...messages, newUserMessage];
    setMessages(allMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: allMessages.map(msg => ({ role: msg.role, content: msg.content })),
          temperature: 0.7,
          max_tokens: 150, // still keeps output short
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const botResponseContent = data.choices[0]?.message?.content || 
        "Sorry, I couldn't get a response.";
      setMessages(prev => [...prev, { role: 'assistant', content: botResponseContent }]);

    } catch (error) {
      console.error("Error sending message to Groq API:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops! Something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <Button
        onClick={toggleChat}
        className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-card border border-border rounded-lg shadow-xl flex flex-col h-[500px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-muted/20 rounded-t-lg flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Harbor Watch AI</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Display */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] p-3 rounded-lg bg-muted text-foreground">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "-0.3s" }}></div>
                    <div className="h-2 w-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: "-0.15s" }}></div>
                    <div className="h-2 w-2 bg-foreground rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* For auto-scrolling */}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border flex items-center gap-2 bg-muted/20 rounded-b-lg">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-background text-foreground"
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
