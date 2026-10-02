export interface VoiceProviderOptions {
  onStateChange?: (state: 'READY' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR') => void;
  onTranscript?: (text: string) => void;
  onError?: (err: string) => void;
}

export class VoiceProviderAdapter {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private options: VoiceProviderOptions;

  constructor(options: VoiceProviderOptions = {}) {
    this.options = options;
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.options.onStateChange?.('LISTENING');
        };

        this.recognition.onresult = (e: any) => {
          const text = Array.from(e.results)
            .map((res: any) => res[0].transcript)
            .join('');
          this.options.onTranscript?.(text);
        };

        this.recognition.onerror = (e: any) => {
          this.options.onStateChange?.('ERROR');
          this.options.onError?.(e.error || 'Speech recognition error');
        };

        this.recognition.onend = () => {
          // Ended listening
        };
      }
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  public startListening() {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch {
        this.options.onStateChange?.('LISTENING');
      }
    } else {
      this.options.onStateChange?.('LISTENING');
    }
  }

  public stopListening() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
    }
  }

  public speak(text: string, rate = 1.0, onEnd?: () => void) {
    if (this.synthesis) {
      this.synthesis.cancel(); // Stop current speech
      const cleanText = text.replace(/[*_#`~]/g, ''); // Strip markdown syntax for TTS
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.onstart = () => this.options.onStateChange?.('SPEAKING');
      utterance.onend = () => {
        this.options.onStateChange?.('READY');
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.options.onStateChange?.('READY');
        if (onEnd) onEnd();
      };
      this.synthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.options.onStateChange?.('READY');
    }
  }
}
