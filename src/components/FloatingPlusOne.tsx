import { FloatingText } from '../types';

interface FloatingPlusOneProps {
  floatingItems: FloatingText[];
}

export default function FloatingPlusOne({ floatingItems }: FloatingPlusOneProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {floatingItems.map(item => (
        <div
          key={item.id}
          className="absolute font-devanagari text-2xl md:text-3xl font-bold text-amber-200 animate-float-fade drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {item.text}
        </div>
      ))}
      <style>{`
        @keyframes floatFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.8) translateY(0);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.25) translateY(-40px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1) translateY(-85px);
          }
        }
        .animate-float-fade {
          animation: floatFade 0.85s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
