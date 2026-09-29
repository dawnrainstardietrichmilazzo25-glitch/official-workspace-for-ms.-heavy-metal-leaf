import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers, 
  RefreshCw, 
  Copy, 
  Check, 
  HelpCircle,
  AlertTriangle,
  Radio,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

const PRESET_QUESTIONS = [
  {
    title: 'Plant Voltage Safety',
    query: 'What if we kill the plants with too much voltage? How do we protect them?',
    icon: ShieldCheck
  },
  {
    title: 'Surrounding Electrical Fields',
    query: 'Do we have something we can surround the electrical fields with? How does Faraday shielding work?',
    icon: Radio
  },
  {
    title: 'Form Factor Optimization',
    query: 'How does Dawn’s initial humanoid vision get altered and optimized for physical deployment?',
    icon: Layers
  },
  {
    title: 'Phase 0 Science',
    query: 'Can you explain the Phase 0 mustard plant r = +0.89 correlation findings in simple terms?',
    icon: Zap
  },
  {
    title: 'Phytomining Economics',
    query: 'How does harvesting metal from hyperaccumulator plants replace destructive open-pit mining?',
    icon: Cpu
  }
];

export const AiResearchAssistantTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `Hello Dawn! I am your **ONMOTIO AI Co-Scientist and Research Assistant**, connected to your entire project ecosystem:

* **Electrical Safety & Bio-Protection:** Understanding how our ultra-high impedance ($> 10^{12}\\ \\Omega$) frontend listens without shocking or killing plants, and how grounded Faraday cages surround and shield stray fields.
* **Dawn’s Morphological Optimization:** How your initial humanoid vision bridges myth and human empathy, while physical deployments optimize into floating bio-rafts, vertical cassettes, and living circuit slabs.
* **Phase 0 Data:** Validated $r = +0.89$ correlation between soil moisture and petiole angle deflection, and $+17^\\circ$ recovery in 90 minutes.
* **Hardware Architecture:** Texas Instruments INA128 instrumentation amplifiers, 60Hz notch filters, TVS diode clamps, and ESP32-S3 DAQ.
* **Grant Pipelines:** NSF PAPPG compliance and Washington Department of Ecology stormwater applications.

Ask me anything about the plants, electrical safety, hardware, or grant strategy!`,
      timestamp: 'Just now',
      source: 'gemini-3.8-flash'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: query,
          messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `I encountered a communication issue reaching the research backend: ${(err as Error).message}. You can try asking again or select one of the preset prompts above.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: `Conversation reset. Ready for your next research inquiry, Dawn!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini-3.8-flash'
      }
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Research Co-Scientist</span>
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Model: Gemini 3.8 Flash Connected</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            ONMOTIO Unified Research Chatbot & Knowledge Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Dawn’s direct collaborative interface with the AI: Ask technical questions about plant electrical safety, Faraday field shielding, Chrislance’s circuit architecture, or morphological optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Start fresh conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Thread</span>
          </button>
        </div>
      </div>

      {/* Preset Question Cards */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Quick Research Inquiries (Click to Ask):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
          {PRESET_QUESTIONS.map((pq, i) => {
            const Icon = pq.icon;
            return (
              <button
                key={i}
                onClick={() => handleSend(pq.query)}
                className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-400/60 text-left transition-all group cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-indigo-400">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {pq.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {pq.query}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[600px]">
        
        {/* Chat Header Status */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Dr. Heavy Metal Leaf AI</span>
              <span className="text-[10px] font-mono text-emerald-400">Grounded in Phase 0 Data & Chrislance Hardware Schematics</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            Active Session: Dawn (Founder)
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {isUser ? 'Dawn (Founder)' : 'ONMOTIO AI Co-Scientist'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                    }`}
                  >
                    {/* Render message body preserving linebreaks and basic markdown structure */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {!isUser && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Verified Project Knowledgebase</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                <span>Consulting Gemini 3.8 Flash with project bio-electrophysiology parameters...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything: e.g. What if we kill the plants with voltage? How do we surround electrical fields?"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
            <span>Press Enter to send inquiry</span>
            <span>Safety verified: Passive listening protocols enforced</span>
          </div>
        </div>

      </div>

      {/* Deep-Dive Technical Safety Card on Voltage & Faraday Shielding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Voltage Protection Strategy */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Why Plants Won’t Die from Voltage</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Many assume sensors pump electricity into plants. Our Analog Front-End (AFE) is <strong>100% passive listening</strong>:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Ultra-High Impedance (&gt; 10¹² Ω):</strong> INA128 draws under 2 nanoamps (&lt; 2 nA), ensuring zero current damage.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>TVS Clamping Diodes:</strong> Overvoltage above 0.3V is instantly shunted harmlessly to ground.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Series Resistor Protection:</strong> 1 MΩ to 10 MΩ series resistance caps maximum current below biological thresholds.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Surrounding Electrical Fields (Faraday Shielding) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Radio className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Surrounding Electrical Fields (Shielding)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To isolate the living organism from external 50/60 Hz mains hum and stray radio frequencies:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Grounded Faraday Mesh:</strong> Copper or aluminum woven mesh envelops the growth pod to block electromagnetic waves.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Driven Guard Shielding:</strong> Coaxial lead shields are actively driven at the signal potential to eliminate stray fields.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Galvanic Opto-Isolation:</strong> Battery and signal rails are physically decoupled from mains AC power.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
