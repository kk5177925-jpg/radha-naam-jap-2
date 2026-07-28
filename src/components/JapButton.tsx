import { useState, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface JapButtonProps {
  onTap: (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => void;
  lang: 'hi' | 'en';
}

interface Ripple {
  id: number;
}

export default function JapButton({ onTap }: JapButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handlePress = (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    // Add ripple
    const id = Date.now();
    setRipples(prev => [...prev.slice(-3), { id }]);

    onTap(e);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);
  };

  return (
    <div className="relative flex items-center justify-center my-6 md:my-10 select-none">
      {/* Outer ambient radiant pulsing aura */}
      <div className="absolute w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-amber-600/30 via-amber-400/20 to-yellow-300/30 blur-2xl animate-pulse-glow pointer-events-none" />

      {/* Decorative Rotating Lotus Mandala Outer Ring */}
      <div className="absolute w-64 h-64 sm:w-72 sm:h-72 md:w-88 md:h-88 rounded-full border border-amber-400/30 border-dashed animate-[spin_40s_linear_infinite] pointer-events-none" />
      <div className="absolute w-60 h-60 sm:w-68 sm:h-68 md:w-80 md:h-80 rounded-full border-2 border-yellow-300/20 pointer-events-none" />

      {/* Ripple Rings on Tap */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            initial={{ scale: 0.85, opacity: 0.8 }}
            animate={{ scale: 1.65, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute w-56 h-56 sm:w-64 sm:h-64 md:w-76 md:h-76 rounded-full border-2 border-amber-300 bg-amber-400/10 pointer-events-none shadow-[0_0_30px_rgba(251,191,36,0.5)]"
          />
        ))}
      </AnimatePresence>

      {/* The Central Glowing Circular "राधा" Jap Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={handlePress}
        className="relative group cursor-pointer w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-1.5 shadow-[0_0_50px_rgba(245,158,11,0.6),inset_0_2px_15px_rgba(255,255,255,0.7)] border-4 border-amber-200/80 active:border-yellow-100 transition-shadow duration-300"
      >
        {/* Inner Glowing Bezel */}
        <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-900/90 via-amber-950/95 to-amber-900/90 flex flex-col items-center justify-center p-4 border border-amber-300/30 shadow-[inset_0_0_35px_rgba(217,119,6,0.6)] group-hover:shadow-[inset_0_0_45px_rgba(251,191,36,0.8)] transition-all">
          
          {/* Top Decorative Flower / Tilak Icon */}
          <div className="text-amber-300 text-lg sm:text-2xl mb-1 tracking-widest opacity-90 font-serif">
            ॥ 𑁍 ॥
          </div>

          {/* Glowing Devanagari "राधा" */}
          <span className="font-devanagari text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-200 to-yellow-400 animate-text-glow tracking-wider py-1 select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            राधा
          </span>

          {/* Subtitle / Devotional Instruction */}
          <span className="font-kalam text-amber-200/90 text-sm sm:text-base md:text-lg mt-1 tracking-wide font-medium">
            जय श्री राधे
          </span>

          {/* Bottom Lotus Motif Accent */}
          <div className="mt-1 text-amber-300/70 text-xs tracking-widest">
            🪷
          </div>
        </div>
      </motion.button>
    </div>
  );
}
