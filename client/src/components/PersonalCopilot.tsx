import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, User, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { level3Service } from '../services/level3';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export function PersonalCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: '👋 Hello Hero! I am **MY DIGITAL HEROES AI**, your personal assistant. Ask me anything about your performance, impact, journey, subscription, or achievements!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'Explain my recent performance',
    'Show my charity impact',
    'Summarize my journey',
    'What is my draw eligibility status?',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).slice(2),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await level3Service.askCopilot(q);
      const botMsg: Message = {
        id: Math.random().toString(36).slice(2),
        sender: 'bot',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          sender: 'bot',
          text: '⚠️ AI insights are temporarily unavailable. Core platform features remain fully operational.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 rounded-2xl shadow-glow-indigo flex items-center gap-3 font-semibold text-sm border border-indigo-400/30"
      >
        <Bot size={22} className="animate-bounce" />
        <span className="hidden sm:inline">Ask My AI Assistant</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </motion.button>

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 right-0 max-w-full flex pl-10"
            >
              <div className="w-screen max-w-md bg-white dark:bg-navy-950 border-l border-slate-200 dark:border-navy-800 shadow-2xl flex flex-col">
                {/* Drawer Header */}
                <div className="p-4 border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">MY DIGITAL HEROES AI</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Grounded on your verified performance data</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                    <X size={20} />
                  </button>
                </div>

                {/* Quick Prompts */}
                <div className="p-3 bg-slate-100/50 dark:bg-navy-900/40 border-b border-slate-200 dark:border-navy-800 flex gap-2 overflow-x-auto hide-scrollbar">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qp)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-indigo-600 dark:text-indigo-400 whitespace-nowrap hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      {qp}
                    </button>
                  ))}
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">
                          <Bot size={16} />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-navy-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-navy-800 rounded-bl-none whitespace-pre-line'
                        }`}
                      >
                        {m.text}
                        <div className={`text-[10px] mt-1.5 text-right ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {m.timestamp}
                        </div>
                      </div>

                      {m.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-navy-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 text-xs font-bold">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-3 items-center text-xs text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <RefreshCw size={16} className="animate-spin" />
                      </div>
                      <span>Retrieving authorized data & generating grounded response...</span>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="p-3 border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask about performance, impact, journey..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button type="submit" size="sm" isLoading={loading} className="shrink-0 p-2.5">
                    <Send size={16} />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
