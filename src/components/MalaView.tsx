import { MouseEvent, TouchEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface MalaViewProps {
  todayCount: number;
  lifetimeCount: number;
  onTap: (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => void;
  lang: Language;
}

export default function MalaView({ todayCount, onTap, lang }: MalaViewProps) {
  const t = getTranslation(lang);

  const malaCompleted = Math.floor(todayCount / 108);
  const currentBead = todayCount % 108; // 0 to 107
  const progressPercent = Math.round((currentBead / 108) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-4 max-w-lg mx-auto text-amber-100">
      
      {/* Mala Header Summary */}
      <div className="w-full bg-gradient-to-r from-amber-950/80 via-amber-900/90 to-amber-950/80 p-4 rounded-2xl border border-amber-500/30 shadow-lg text-center backdrop-blur-md mb-6">
        <div className="flex items-center justify-between text-xs sm:text-sm font-poppins text-amber-200/80 border-b border-amber-500/20 pb-2 mb-3">
          <span className="flex items-center gap-1.5 font-medium">
            <Trophy className="w-4 h-4 text-amber-400" />
            {t.malaCount}: <strong className="text-amber-300 text-base">{malaCompleted}</strong>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {t.bead}: <strong className="text-amber-300 text-base">{currentBead} / 108</strong>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-amber-950/90 rounded-full h-3 border border-amber-600/40 p-0.5 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 h-full rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 120 }}
          />
        </div>
        <div className="mt-1.5 text-right text-xs text-amber-300/80 font-poppins">
          {progressPercent}% {t.stats.completed}
        </div>
      </div>

      {/* Visual Bead Ring Layout */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
        {/* Render 108 Mala Beads indicator ring */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20" />
        
        {/* Render active Mala beads in circle */}
        {Array.from({ length: 24 }).map((_, idx) => {
          const angle = (idx / 24) * 2 * Math.PI - Math.PI / 2;
          const radius = 120; // px
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const isFilled = (idx / 24) <= (currentBead / 108);

          return (
            <div
              key={idx}
              className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                isFilled
                  ? 'bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,1)] scale-110 border border-yellow-100'
                  : 'bg-amber-950 border border-amber-700/60 opacity-60'
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            />
          );
        })}

        {/* Center Jap Button for Mala Mode */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onTap}
          className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 border-4 border-amber-300 flex flex-col items-center justify-center text-center shadow-[0_0_35px_rgba(245,158,11,0.6)] cursor-pointer active:brightness-125 transition-all"
        >
          <span className="text-amber-200/80 text-xs font-kalam">माला मनका</span>
          <span className="font-devanagari text-4xl font-bold text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] my-0.5">
            {currentBead}
          </span>
          <span className="text-amber-300 text-xs font-poppins font-semibold uppercase tracking-wider">
            / 108
          </span>
        </motion.button>
      </div>

      {/* Motivational devotional card */}
      <div className="text-center mt-6 p-3 bg-amber-950/60 rounded-xl border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 font-kalam">
        ॥ एकाग्र चित्त से श्री राधा नाम की 1 माला (108 बार) पूर्ण करें ॥
      </div>
    </div>
  );
}
