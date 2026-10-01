import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { aiService } from '../../services/ai';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

export function AIMentorDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: `Hello Hero! 👋 I am HeroBot AI, your personal career & skill mentor. Ask me anything about leveling up, project ideas, or skill roadmaps!`,
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const generateLocalAdvice = (query: string): string => {
    const q = query.toLowerCase();
    const name = user?.profile?.displayName?.split(' ')[0] || 'Hero';
    if (q.includes('level') || q.includes('xp') || q.includes('fast')) {
      return `Hey ${name}! 🚀 Here are 3 fast ways to level up right now:
1. ⚡ **Sync GitHub:** Connect your repositories in the Dashboard for +500 XP.
2. 🏆 **Complete Achievements:** Build 2 full-stack projects to unlock the *Innovation Hero* badge.
3. ⚔️ **Code Duels:** Win 1v1 speed coding matches to earn instant victory XP!`;
    }
    if (q.includes('project') || q.includes('idea') || q.includes('recommend')) {
      return `Hey ${name}! Here are 2 high-impact project ideas for your portfolio:
- 🧠 **AI-Powered Code Reviewer Bot:** Build a GitHub App or CLI that analyzes PRs using Gemini API.
- ⚡ **Real-Time Collaboration Canvas:** Create a WebSockets whiteboard with React & Socket.io.
Both projects grant **+400 XP** and boost your hero ranking!`;
    }
    return `Hello ${name}! 👋 As a Digital Hero, your progress is looking strong!
🎯 **Recommended Next Steps:**
- Build and feature a full-stack project in your portfolio.
- Participate in 1v1 Code Duels to test your speed.
- Sync your latest GitHub commits to collect bonus XP!`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await aiService.askMentor(query);
      setMessages((prev) => [...prev, { sender: 'bot', text: res.reply }]);
    } catch (err: any) {
      // Smart fallback engine so HeroBot AI always delivers actionable advice
      const fallbackReply = generateLocalAdvice(query);
      setMessages((prev) => [...prev, { sender: 'bot', text: fallbackReply }]);
    } finally {
      setLoading(false);
    }
  };

  const promptChips = [
    '⚡ How to level up fast?',
    '💡 Recommend 2 project ideas',
    '🎯 Review my hero skills',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white p-3.5 rounded-full shadow-glow-indigo flex items-center gap-2 font-medium text-sm border border-indigo-400/30 cursor-pointer"
      >
        <Sparkles size={18} className="animate-pulse" />
        <span className="hidden sm:inline">AI Hero Mentor</span>
      </motion.button>

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white dark:bg-navy-900 border-l border-slate-200 dark:border-navy-700 shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-transparent">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">HeroBot AI Mentor</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Personalized Career & Skill Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Content Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={14} />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-navy-700/60'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <Loader2 size={14} className="animate-spin text-indigo-500" />
                    HeroBot AI is analyzing your profile...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/30">
                {promptChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="text-xs bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-200 dark:border-navy-700 hover:border-indigo-400 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 border-t border-slate-200 dark:border-navy-800 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask HeroBot AI a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-sm rounded-xl bg-slate-100 dark:bg-navy-800 border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button type="submit" size="sm" isLoading={loading} disabled={!input.trim()}>
                  <Send size={15} />
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
