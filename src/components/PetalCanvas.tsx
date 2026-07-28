import { useEffect, useRef } from 'react';

interface PetalCanvasProps {
  active: boolean;
  onComplete?: () => void;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  color: string;
}

export default function PetalCanvas({ active, onComplete }: PetalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      '#f43f5e', // Rose pink
      '#e11d48', // Red rose
      '#fb923c', // Marigold orange
      '#f59e0b', // Yellow marigold
      '#fbcfe8', // Soft pink
    ];

    const petals: Petal[] = [];
    for (let i = 0; i < 65; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 300,
        size: Math.random() * 10 + 8,
        speedY: Math.random() * 2.5 + 1.2,
        speedX: (Math.random() - 0.5) * 1.5,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationFrameId: number;
    let startTime = Date.now();

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      // Draw petal leaf shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size, p.size, -p.size / 2, 0, p.size);
      ctx.bezierCurveTo(-p.size, -p.size / 2, -p.size / 2, -p.size, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allOffscreen = true;
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.8;
        p.angle += p.angularSpeed;

        if (p.y < canvas.height + 50) {
          allOffscreen = false;
        }

        drawPetal(p);
      });

      const elapsed = Date.now() - startTime;
      if (allOffscreen || elapsed > 7000) {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onComplete) onComplete();
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
