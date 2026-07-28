import { AudioMode } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Pre-warm Speech Synthesis voices
let hindiVoice: SpeechSynthesisVoice | null = null;

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.lang.startsWith('mr'));
  if (hiVoice) {
    hindiVoice = hiVoice;
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Play sweet "Radhe Radhe" voice using Web Speech API with fallback/synth
 */
export function playRadheVoice() {
  if (typeof window === 'undefined') return;

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Cancel previous to prevent queuing delay
      const utterance = new SpeechSynthesisUtterance('राधे राधे');
      utterance.lang = 'hi-IN';
      utterance.rate = 1.3; // Responsive pace
      utterance.pitch = 1.2; // Sweet, warm tone
      utterance.volume = 1.0;
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // Fallback to synth if speech synthesis fails
    }
  }
  playTempleBell(660);
}

/**
 * Synthesize a resonant Temple Bell / Ghanti sound using Web Audio API
 */
export function playTempleBell(freq = 528) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Multi-harmonic frequencies for authentic brass bell tone
    const partials = [
      { freq: freq, gain: 0.6, decay: 1.5 },
      { freq: freq * 2, gain: 0.3, decay: 1.0 },
      { freq: freq * 2.76, gain: 0.2, decay: 0.8 },
      { freq: freq * 4.07, gain: 0.15, decay: 0.5 },
      { freq: freq * 5.4, gain: 0.1, decay: 0.3 }
    ];

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(p.gain, now + 0.008); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + p.decay); // Metallic decay

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  } catch {
    // Audio context fallback
  }
}

/**
 * Play sacred Shankh / Conch shell resonance for big milestones
 */
export function playShankhSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.8);
    osc.frequency.setValueAtTime(320, now + 1.5);
    osc.frequency.exponentialRampToValueAtTime(240, now + 2.5);

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gainNode.gain.setValueAtTime(0.5, now + 1.8);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.9);
  } catch {
    playTempleBell(440);
  }
}

/**
 * Main tap audio trigger based on user settings
 */
export function playTapAudio(soundEnabled: boolean, audioMode: AudioMode) {
  if (!soundEnabled) return;

  if (audioMode === 'sweet') {
    playRadheVoice();
  } else if (audioMode === 'bell') {
    playTempleBell(528);
  } else {
    // Both
    playRadheVoice();
    setTimeout(() => playTempleBell(792), 80);
  }
}

/**
 * Haptic Vibration Feedback
 */
export function vibrateTap(vibrationEnabled: boolean) {
  if (!vibrationEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate(28); // Sweet short pulse
  } catch {
    // Unsupported
  }
}

export function vibrateMilestone(vibrationEnabled: boolean) {
  if (!vibrationEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
  } catch {
    // Unsupported
  }
}
