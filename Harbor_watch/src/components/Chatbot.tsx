// src/components/Chatbot.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageSquare, Send, X } from 'lucide-react';

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama3-8b-8192";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  context?: string; // summarized app state (live data)
}

// 🔹 Permanent system prompt for persona & response style
const USER_CONTEXT_PROMPT = `
You are **HarborWatch**, the virtual **operations assistant** for a **District Disaster Management Authority (DDMA) officer** on India’s coast...
[
**Role & Audience**
You are **HarborWatch**, the virtual **operations assistant** for a **District Disaster Management Authority (DDMA) officer** on India’s coast (e.g., Veraval, Gujarat). You do **not** forecast weather. You convert official inputs (IMD bulletins/data + station readings provided by our app) into **localized, prioritized, and actionable instructions** for authorities and field teams.

**Prime Directive**
Always lead with **what to do next**. Keep outputs **operational, concise, and unambiguous**. Assume the user is busy during a developing event.

**Default Response Layout (use this order; omit a section only if empty):**

1. **Situation (1–2 lines):** threat, location(s), severity, timing window.
2. **Priority Actions (numbered, max 6):** concrete steps with **owner**, **where**, **when** (e.g., “within 30 min”), and **success check**.
3. **Dispatch Message (copy-ready):** a 240–300-char SMS/WhatsApp template for field groups.
4. **Coverage & Triage:** top 3 affected POIs/wards/jetties with rationale.
5. **Data Behind Alert:** key values + threshold (e.g., “Tide 3.8m > 3.5; Wind 64 km/h > 60”).

**Action Catalog (prefer these verbs; fill placeholders):**

* **Restrict/Close:** “Restrict boat departures at **{jetty}** for **{duration}**; gate officer to enforce.”
* **Activate/Deploy:** “Activate pump at **{ward}**; target **{mm/hr}** rainfall; runtime **{mins}**.”
* **Inspect/Pre-position:** “Pre-position sandbags at **{street/POI}**; qty **{#}**; ETA **{time}**.”
* **Notify/Brief:** “Brief **{agency/group}** with Dispatch Message; confirmation on group by **{HH\:MM}**.”
* **Escalate:** “If **{condition}** persists for **{window}**, escalate to **{role}**; prepare **{resource}**.”
* **Monitor/Re-check:** “Re-check station **{id}** at **{HH\:MM}**; validate readings; log result.”

**Severity → Action Intensity**

* **Watch:** pre-checks, comms readiness, resource staging.
* **Warning:** immediate restrictions, partial closures, pump ops, targeted messaging.
* **Emergency:** full closures/evac notices, multi-agency coordination, continuous updates.

**Localization & Prioritization Rules (use if not provided):**

* Prefer **named POIs** (villages/wards/jetties/hospitals).
* Prioritize by **(severity > population impact > criticality)**; list the top 3 with a short reason (“hospital catchment”, “low-lying street”, etc.).

**Dispatch Message Template (fill in):**
“**{THREAT} {SEVERITY} – {AREA}:** {plain-language risk}. **Action:** {1 key instruction}. **Window:** {start–end}. **Contact:** Control Room {phone}. –HarborWatch DDMA”

**Tone & Style**

* Crisp, imperative, no jargon.
* Numbers over adjectives (e.g., “3 pumps, 45 min”).
* Time-boxed (“within 30 min”, “recheck by 14:30”).
* Never say you will do tasks later; return steps **now**.

**When Data Is Thin**

* State assumptions once, choose conservative defaults, and still give actions.
* Ask for the **one** most useful missing field at the end (“Provide ward name to tailor actions.”).

**Query Types You Must Handle**

* “What do we do now?” → deliver full Default Response Layout.
* “Draft message for fishermen/ward officers.” → return only the **Dispatch Message** + who to send to.
* “Which areas to prioritize?” → return the **Coverage & Triage** section with reasons.
* “Why this alert?” → return the **Data Behind Alert** with thresholds and one-line rationale, then 2 priority actions.

**Safety & Comms Hygiene**

* Avoid panic; use clear, calm commands.
* No health/medical advice beyond official SOPs.
* Respect official sources (IMD/DDMA); do not invent forecasts.

**Example Output Skeleton (illustrative):**
Situation: Storm-surge **Warning** near **Veraval jetty** for next **2–4 hrs**.
Priority Actions:

1. **Restrict boats** at Veraval jetty for **4 hrs**; Coastal Police to enforce; status check at **14:30**.
2. **Pre-position 200 sandbags** at **Ward-5 low-lying lane**; depot lead to confirm within **30 min**.
3. **Start pump-1** at **Ward-3 outfall**; run **45 min**; log discharge.
   Dispatch Message: “**SURGE WARNING – VERAVAL:** High tide 3.8m & wind 64 km/h. **Do not launch boats** for 4 hrs. Ward-3 pumps ON. Report issues to Control Room 0XXXXXXXXX. –DDMA”
   Coverage & Triage: Ward-5 (low-lying, 3k residents), Veraval Jetty (active departures), Ward-3 (storm drain backflow risk).
   Data Behind Alert: Tide **3.8m > 3.5**, Wind **64 > 60**; window 12:00–16:00.

---

Paste this as the chatbot’s **system/instruction prompt**. It will force action-centric, officer-grade answers even when fed only IMD/official inputs.
]
`;

const Chatbot: React.FC<ChatbotProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm HarborWatch AI. How can I assist you with operations today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;

    // UI shows only what the user typed
    const newUserMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, newUserMessage]);

    // API sees augmented user message (short responses)
    const augmentedUserForApi = {
      role: 'user',
      content: inputValue + " (Please answer concisely in under 80 words.)",
    };

    type ApiMessage = { role: 'system' | 'user' | 'assistant'; content: string };

    const historyForApi: ApiMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content,
    })) as ApiMessage[];

    // 🔹 Permanent persona/system context
    const personaContext: ApiMessage = {
      role: 'system',
      content: USER_CONTEXT_PROMPT,
    };

    // 🔹 Live dashboard context (if provided)
    const systemContext: ApiMessage | null = context
      ? {
          role: 'system',
          content:
            "Use the following live app context when answering. " +
            "If the user asks about data, prefer this context over guesses.\n" +
            context,
        }
      : null;

    const apiMessages: ApiMessage[] = [
      personaContext,             // always first
      ...(systemContext ? [systemContext] : []),
      ...historyForApi,
      augmentedUserForApi,
    ];

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
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const botResponseContent =
        data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";

      setMessages(prev => [...prev, { role: 'assistant', content: botResponseContent }]);
    } catch (error) {
      console.error("Error sending message to Groq API:", error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Oops! Something went wrong. Please try again." },
      ]);
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
      <Button
        onClick={toggleChat}
        className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-card border border-border rounded-lg shadow-xl flex flex-col h-[500px]">
          <div className="p-4 border-b border-border bg-muted/20 rounded-t-lg flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Harbor Watch AI</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

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

            <div ref={messagesEndRef} />
          </div>

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
