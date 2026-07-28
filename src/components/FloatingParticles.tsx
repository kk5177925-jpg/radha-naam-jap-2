import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const list: Particle[] = [];
    for (let i = 0; i < 28; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
    setParticles(list);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-amber-200/60 blur-[1px] animate-pulse"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            boxShadow: '0 0 12px 3px rgba(251, 191, 36, 0.8)',
            animation: `floatUp ${p.duration}s infinite ease-in-out ${p.delay}s, pulse 3s infinite ease-in-out`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0px) scale(0.9);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-40px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-80px) scale(0.9);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
