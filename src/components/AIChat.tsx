import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MOCK_RESPONSES: Record<string, string> = {
  default: "I'm your MediConnect AI health assistant. I can help you understand your health metrics, explain alerts, and suggest actions. What would you like to know?",
  heart: "Your heart rate data shows a normal sinus rhythm. A resting heart rate between 60-100 BPM is considered normal. If you're seeing elevated readings, consider resting for 5-10 minutes and rechecking. Persistent high heart rate (>100 BPM at rest) should be discussed with your doctor.",
  spo2: "Blood oxygen saturation (SpO2) measures how much oxygen your red blood cells are carrying. Normal levels are 95-100%. Readings below 95% may indicate a respiratory issue and you should consult your doctor. Readings below 90% require immediate medical attention.",
  fever: "A body temperature above 100.4°F (38°C) is considered a fever. Stay hydrated, rest, and monitor your temperature regularly. If fever persists more than 3 days or exceeds 103°F (39.4°C), seek medical care immediately.",
  stress: "Chronic high stress can significantly impact your health. I recommend trying the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8. Regular exercise, adequate sleep (7-9 hours), and mindfulness practices can help manage stress levels.",
  blood_pressure: "Blood pressure is measured as systolic/diastolic (e.g., 120/80 mmHg). Optimal is below 120/80. Between 120-129/<80 is elevated, 130-139/80-89 is Stage 1 hypertension, and 140+/90+ is Stage 2. A healthy diet low in sodium, regular exercise, and stress management can help maintain healthy blood pressure.",
  sleep: "Quality sleep is crucial for health. Adults need 7-9 hours per night. Poor sleep can affect immunity, metabolism, and mental health. Tips for better sleep: maintain a consistent schedule, avoid screens 1 hour before bed, keep your room cool and dark, and limit caffeine after 2 PM.",
  device: "Your MediConnect Band and Smart Ring continuously monitor your vitals including heart rate, SpO2, skin temperature, and activity levels. The ring also features fingerprint identity verification and NFC capabilities for contactless health data sharing.",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("heart") || lower.includes("pulse") || lower.includes("bpm")) {
    return MOCK_RESPONSES.heart;
  } else if (lower.includes("spo2") || lower.includes("oxygen") || lower.includes("saturation")) {
    return MOCK_RESPONSES.spo2;
  } else if (lower.includes("fever") || lower.includes("temperature") || lower.includes("temp")) {
    return MOCK_RESPONSES.fever;
  } else if (lower.includes("stress") || lower.includes("anxiety") || lower.includes("anxious")) {
    return MOCK_RESPONSES.stress;
  } else if (lower.includes("blood pressure") || lower.includes("systolic") || lower.includes("diastolic")) {
    return MOCK_RESPONSES.blood_pressure;
  } else if (lower.includes("sleep") || lower.includes("rest") || lower.includes("insomnia")) {
    return MOCK_RESPONSES.sleep;
  } else if (lower.includes("device") || lower.includes("band") || lower.includes("ring")) {
    return MOCK_RESPONSES.device;
  } else if (lower.includes("alert") || lower.includes("warning") || lower.includes("critical")) {
    return "Alerts in MediConnect are generated when your health metrics fall outside normal ranges. Each alert is color-coded by severity: red for critical (immediate action needed), orange for warning (monitor closely), and blue for informational. You can resolve an alert once you've addressed the underlying concern.";
  } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! I'm MediAI, your intelligent health assistant powered by MediConnect. I'm here to help you understand your health data, explain alerts, and provide personalized health insights. How can I assist you today?";
  } else if (lower.includes("help") || lower.includes("what can you")) {
    return "I can help you with:\n• **Understanding health metrics** — heart rate, SpO2, blood pressure, temperature\n• **Explaining alerts** — what they mean and what to do\n• **Health tips** — sleep, stress, nutrition, exercise\n• **Device info** — MediConnect Band and Smart Ring features\n• **General health questions** — symptoms, prevention, wellness\n\nJust ask me anything!";
  }
  return "I understand you're asking about your health. Based on your current metrics, everything looks generally stable. For specific concerns, I recommend consulting with your assigned doctor through the Doctor Dashboard. Is there a particular health metric or symptom you'd like me to explain in more detail?";
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: MOCK_RESPONSES.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

    const response = getAIResponse(input);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center",
          "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-neon",
          "hover:from-cyan-400 hover:to-blue-500 transition-all duration-300",
          isOpen && "opacity-0 pointer-events-none"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? {} : { y: [0, -4, 0] }}
        transition={isOpen ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-6 w-6 text-white" />
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[380px] h-[540px] flex flex-col",
              "backdrop-blur-2xl bg-gray-900/90 border border-white/10 rounded-3xl shadow-glass-lg overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-600/10">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-neon">
                  <Bot className="h-5 w-5 text-white" />
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">MediAI Assistant</h3>
                  <p className="text-xs text-cyan-400">Always here to help</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center",
                      msg.role === "assistant"
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                        : "bg-white/10 border border-white/10"
                    )}>
                      {msg.role === "assistant"
                        ? <Bot className="h-3.5 w-3.5 text-white" />
                        : <User className="h-3.5 w-3.5 text-white" />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={cn(
                      "max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === "assistant"
                        ? "bg-white/5 border border-white/10 text-white rounded-tl-sm"
                        : "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 text-white rounded-tr-sm"
                    )}>
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>
                          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex gap-2"
                  >
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 focus-within:border-cyan-500/40 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your health..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-muted-foreground outline-none"
                  disabled={isTyping}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className={cn(
                    "w-7 h-7 rounded-xl flex items-center justify-center transition-all",
                    input.trim() && !isTyping
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-neon"
                      : "bg-white/5 opacity-50"
                  )}
                >
                  {isTyping
                    ? <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                    : <Send className="h-3.5 w-3.5 text-white" />
                  }
                </motion.button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                AI responses are for informational purposes only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
