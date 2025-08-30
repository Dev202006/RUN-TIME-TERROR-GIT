import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send } from 'lucide-react';

interface ChatbotProps {
  context?: string; // 👈 Accept context from Dashboard
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add the user’s real text to UI
    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);

    setLoading(true);

    try {
      // 👇 Combine hidden context with user’s text
      const fullPrompt = `
        You are an assistant helping with a live coastal threat monitoring dashboard.
        Here is the current situation:
        ${context || 'No additional context provided.'}
        
        The user asked: ${input}
        Keep the response concise (max ~80 words).
      `;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();

      // Add assistant’s reply to UI
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'No response' },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <Card className="p-4 shadow-lg">
        <div className="h-64 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto w-fit'
                  : 'bg-muted w-fit'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the assistant..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Chatbot;
