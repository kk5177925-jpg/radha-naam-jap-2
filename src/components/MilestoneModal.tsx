import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playShankhSound, playTempleBell, vibrateMilestone } from '../utils/audioEngine';
import { getTranslation } from '../utils/translations';
import { Language } from '../types';
import { Trophy, Bell, Share2, Sparkles, CheckCircle2 } from 'lucide-react';

interface MilestoneModalProps {
  milestone: number | null;
  onClose: () => void;
  lang: Language;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export default function MilestoneModal({ milestone, onClose, lang, soundEnabled, vibrationEnabled }: MilestoneModalProps) {
  const t = getTranslation(lang);

  useEffect(() => {
    if (!milestone) return;

    // Trigger celebration effects
    if (soundEnabled) {
      playShankhSound();
      setTimeout(() => playTempleBell(528), 1200);
    }

    if (vibrationEnabled) {
      vibrateMilestone(true);
    }

    // Trigger confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fb923c', '#f43f5e', '#fef08a'],
      });
    } catch {
      // Confetti fallback
    }
  }, [milestone, soundEnabled, vibrationEnabled]);

  if (!milestone) return null;

  const handleShare = () => {
    const text = `॥ जय श्री राधे ॥\nमैंने आज "राधा नाम जप" ऐप पर ${milestone.toLocaleString()} पावन नाम जप पूर्ण किए! 🪷✨\n\nराधे राधे!`;
    if (navigator.share) {
      navigator.share({
        title: 'Radha Naam Jap Milestone',
        text,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard: ' + text);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-amber-900 via-amber-950 to-amber-900 border-2 border-amber-400/80 p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_60px_rgba(245,158,11,0.5)] flex flex-col items-center relative overflow-hidden animate-scale-up">
        
        {/* Glowing Background Radial Light */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Devotional Emblem */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 mb-4 shadow-[0_0_25px_rgba(251,191,36,0.8)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-amber-950 flex items-center justify-center border border-amber-300/50">
            <Trophy className="w-10 h-10 text-yellow-300 animate-bounce" />
          </div>
        </div>

        <h2 className="font-devanagari text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 mb-1">
          {t.milestoneModal.congratulations}
        </h2>

        <p className="font-poppins text-xs text-amber-300 font-medium tracking-wide uppercase mb-4 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {t.milestoneModal.reached}
        </p>

        {/* Milestone Display Box */}
        <div className="w-full bg-amber-950/80 border border-amber-500/50 py-3 px-4 rounded-2xl mb-4 shadow-inner">
          <div className="font-devanagari text-4xl sm:text-5xl font-extrabold text-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]">
            {milestone.toLocaleString()}
          </div>
          <div className="text-xs font-kalam text-amber-300/90 mt-1">
            श्री राधा नाम जप पूर्ण
          </div>
        </div>

        {/* Devotional Quote */}
        <p className="font-kalam text-xs sm:text-sm text-amber-200/90 mb-6 leading-relaxed italic border-x border-amber-500/30 px-3 py-1">
          "{t.milestoneModal.quote}"
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950 font-poppins font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.milestoneModal.continue}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => playTempleBell(528)}
              className="flex-1 py-2 bg-amber-900/80 border border-amber-600/40 text-amber-200 rounded-xl font-poppins text-xs font-medium cursor-pointer hover:bg-amber-800 flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>मंदिर घंटी</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 py-2 bg-amber-900/80 border border-amber-600/40 text-amber-200 rounded-xl font-poppins text-xs font-medium cursor-pointer hover:bg-amber-800 flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.milestoneModal.share}</span>
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scaleUp {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-up {
          animation: scaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
