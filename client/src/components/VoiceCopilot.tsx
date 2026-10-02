import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Shield,
  Bot,
  User,
  ChevronUp,
} from 'lucide-react';
import { VoiceProviderAdapter } from '../services/voiceProvider';
import { voiceService, VoiceQueryResult, ActionPreview } from '../services/voice';
import { useToast } from '../store/toastStore';

export function VoiceCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<'READY' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR'>('READY');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [actionPreview, setActionPreview] = useState<ActionPreview | null>(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; role: 'user' | 'assistant'; text: string; actionPreview?: ActionPreview }>>([]);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const adapterRef = useRef<VoiceProviderAdapter | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Determine current screen context from route
  const getScreenContext = (path: string): string => {
    if (path.includes('golf') || path.includes('score')) return 'PERFORMANCE_PAGE';
    if (path.includes('charity') || path.includes('impact')) return 'CHARITY_PAGE';
    if (path.includes('draw') || path.includes('hero')) return 'DRAW_PAGE';
    if (path.includes('admin')) return 'ADMIN_DASHBOARD';
    if (path.includes('subscription')) return 'SUBSCRIPTION_PAGE';
    return 'DASHBOARD';
  };

  useEffect(() => {
    adapterRef.current = new VoiceProviderAdapter({
      onStateChange: (state) => setVoiceState(state),
      onTranscript: (text) => setTranscript(text),
      onError: (err) => {
        setVoiceState('ERROR');
        toast.error('Voice Error', err);
      },
    });

    return () => {
      adapterRef.current?.stopSpeaking();
      adapterRef.current?.stopListening();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, transcript, response]);

  const handleStartListening = () => {
    setTranscript('');
    setResponse(null);
    setActionPreview(null);
    adapterRef.current?.startListening();
  };

  const handleStopListening = () => {
    adapterRef.current?.stopListening();
    if (transcript.trim()) {
      handleProcessQuery(transcript);
    }
  };

  const handleProcessQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    adapterRef.current?.stopListening();
    setVoiceState('THINKING');
    setTranscript(queryText);

    // Add user query to conversation history
    const userMsgId = Date.now().toString();
    setHistory((prev) => [...prev, { id: userMsgId, role: 'user', text: queryText }]);

    try {
      const context = getScreenContext(location.pathname);
      const res: VoiceQueryResult = await voiceService.sendVoiceQuery(queryText, context);

      setResponse(res.response);

      if (res.actionPreview) {
        setActionPreview(res.actionPreview);
      } else {
        setActionPreview(null);
      }

      setHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: res.response,
          actionPreview: res.actionPreview,
        },
      ]);

      // Speak response if not muted
      if (!isMuted && res.response) {
        adapterRef.current?.speak(res.response, speechRate);
      } else {
        setVoiceState('READY');
      }
    } catch (err: any) {
      setVoiceState('ERROR');
      const errText = err.response?.data?.message || 'Failed to process voice query.';
      setResponse(errText);
      toast.error('Voice Assistant Error', errText);
    }
  };

  const handleStopSpeaking = () => {
    adapterRef.current?.stopSpeaking();
    setVoiceState('READY');
  };

  const handleClearHistory = async () => {
    try {
      await voiceService.clearVoiceHistory();
      setHistory([]);
      setResponse(null);
      setTranscript('');
      setActionPreview(null);
      toast.success('Voice Privacy', 'Voice query logs & transcript history cleared.');
    } catch {
      toast.error('Voice Privacy', 'Failed to clear history.');
    }
  };

  const suggestionChips = [
    { label: '⛳ Analyze my golf trend', query: 'Analyze my recent golf performance and consistency' },
    { label: '💚 How many meals did I fund?', query: 'Show my total charity impact and meals funded' },
    { label: '🎯 Check draw eligibility', query: 'What is my current eligibility status for the monthly reward draw?' },
    { label: '⚡ Next improvement step', query: 'What is my recommended focus area to improve my score?' },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            voiceState === 'LISTENING'
              ? 'bg-rose-600 text-white ring-4 ring-rose-400/50 animate-pulse'
              : voiceState === 'SPEAKING'
              ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/50'
              : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-emerald-900/40 hover:shadow-emerald-500/30 border border-emerald-400/30'
          }`}
          aria-label="Toggle Voice Copilot"
        >
          {voiceState === 'LISTENING' ? (
            <Mic className="w-6 h-6 animate-bounce" />
          ) : voiceState === 'SPEAKING' ? (
            <Volume2 className="w-6 h-6 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6" />
          )}

          {/* Pulse Ripple Effect */}
          {voiceState === 'LISTENING' && (
            <span className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping pointer-events-none" />
          )}

          {/* Status Badge */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
        </motion.button>
      </div>

      {/* Voice Copilot Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[540px] z-50 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    Digital Heroes Voice Copilot
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Level 4 AI
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Grounded Server Voice Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Voice Privacy Settings"
                >
                  <Shield className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Privacy Settings Modal Overlay inside Drawer */}
            {showPrivacySettings ? (
              <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Voice Privacy & Data Controls</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Voice audio is processed transiently in memory. Raw audio files are never stored. Only transcript logs are preserved for your audit trail.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Audio Storage:</span>
                      <span className="text-emerald-400 font-medium">Disabled (0 days)</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Server Authorization:</span>
                      <span className="text-emerald-400 font-medium">Strict RBAC</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Action Safety:</span>
                      <span className="text-amber-400 font-medium">Button Confirmation</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleClearHistory}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-medium text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Voice Query History
                  </button>
                  <button
                    onClick={() => setShowPrivacySettings(false)}
                    className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                  >
                    Back to Assistant
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Visualizer Bar / State Indicator */}
                <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        voiceState === 'LISTENING'
                          ? 'bg-rose-500 animate-ping'
                          : voiceState === 'THINKING'
                          ? 'bg-amber-400 animate-bounce'
                          : voiceState === 'SPEAKING'
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-slate-500'
                      }`}
                    />
                    <span className="font-mono text-slate-300">
                      STATUS:{' '}
                      <span
                        className={
                          voiceState === 'LISTENING'
                            ? 'text-rose-400 font-bold'
                            : voiceState === 'SPEAKING'
                            ? 'text-emerald-400 font-bold'
                            : 'text-slate-400'
                        }
                      >
                        {voiceState}
                      </span>
                    </span>
                  </div>

                  {/* Speech Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const next = speechRate >= 1.4 ? 0.8 : Number((speechRate + 0.2).toFixed(1));
                        setSpeechRate(next);
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono hover:text-white"
                      title="TTS Speech Speed"
                    >
                      {speechRate}x
                    </button>
                    <button
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (voiceState === 'SPEAKING') handleStopSpeaking();
                      }}
                      className={`p-1 rounded ${isMuted ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'}`}
                      title={isMuted ? 'Unmute TTS' : 'Mute TTS'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Conversation Body */}
                <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
                  {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white">Ask Digital Heroes Voice AI</p>
                        <p className="text-xs text-slate-400">
                          Tap the mic or select a quick question below.
                        </p>
                      </div>

                      {/* Suggestion Chips */}
                      <div className="w-full space-y-2 pt-2">
                        {suggestionChips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleProcessQuery(chip.query)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-emerald-300 transition flex items-center justify-between group"
                          >
                            <span>{chip.label}</span>
                            <ChevronUp className="w-3.5 h-3.5 rotate-90 opacity-0 group-hover:opacity-100 transition" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    history.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>

                        {/* Critical Action Warning Preview Card */}
                        {msg.actionPreview && (
                          <div className="mt-2 w-[90%] p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                            <div className="flex items-center gap-2 font-semibold text-amber-400">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span>Critical Action Security Gate</span>
                            </div>
                            <p className="text-[11px] text-amber-300/90 leading-tight">
                              {msg.actionPreview.message}
                            </p>
                            <div className="pt-1 flex gap-2">
                              <button
                                onClick={() => {
                                  if (msg.actionPreview?.target) {
                                    navigate(msg.actionPreview.target);
                                    setIsOpen(false);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition"
                              >
                                Go to On-Screen Confirmation Page
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {/* Active Interim Transcript */}
                  {transcript && voiceState === 'LISTENING' && (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs italic">
                        "{transcript}..."
                      </div>
                    </div>
                  )}

                  {/* Thinking Loader */}
                  {voiceState === 'THINKING' && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Synthesizing intelligence groundings...</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type or speak query..."
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleProcessQuery(transcript);
                      }}
                      className="w-full py-2 px-3 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                    />
                    {transcript && (
                      <button
                        onClick={() => setTranscript('')}
                        className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {voiceState === 'LISTENING' ? (
                    <button
                      onClick={handleStopListening}
                      className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shrink-0"
                      title="Stop Listening & Submit"
                    >
                      <MicOff className="w-4 h-4" />
                    </button>
                  ) : voiceState === 'SPEAKING' ? (
                    <button
                      onClick={handleStopSpeaking}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 transition shrink-0"
                      title="Stop Audio Readout"
                    >
                      <VolumeX className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={
                        transcript.trim() ? () => handleProcessQuery(transcript) : handleStartListening
                      }
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shrink-0"
                      title={transcript.trim() ? 'Submit Query' : 'Start Listening'}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
