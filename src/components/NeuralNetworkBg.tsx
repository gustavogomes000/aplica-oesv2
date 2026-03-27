import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseSpeed: number;
  angle: number;
  angleSpeed: number;
  orbitRadius: number;
  originX: number;
  originY: number;
  pulsePhase: number;
  pulseSpeed: number;
  life: number;
}

const COLORS = [
  "340,82%,55%",
  "270,76%,55%",
  "200,80%,50%",
  "320,70%,60%",
  "230,70%,55%",
];

const CONNECTION_DISTANCE = 180;
const PARTICLE_COUNT_DESKTOP = 90;
const PARTICLE_COUNT_MOBILE = 50;

export default function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  const initParticles = useCallback((w: number, h: number) => {
    const count = w < 640 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const originX = Math.random() * w;
      const originY = Math.random() * h;
      particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 1 + Math.random() * 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        baseSpeed: 0.2 + Math.random() * 0.6,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.015,
        orbitRadius: 30 + Math.random() * 120,
        originX,
        originY,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        life: Math.random(),
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particlesRef.current.length === 0) {
        initParticles(window.innerWidth, window.innerHeight);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0]?.clientX ?? -1000 : e.clientX;
      const y = "touches" in e ? e.touches[0]?.clientY ?? -1000 : e.clientY;
      mouseRef.current = { x, y };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("touchmove", handleMouse, { passive: true });

    let time = 0;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      time += 0.016;

      ctx.clearRect(0, 0, w, h);

      // Update particles with fluid orbital + drift motion
      for (const p of particles) {
        p.angle += p.angleSpeed;
        p.pulsePhase += p.pulseSpeed;

        // Drift the orbit origin slowly across the screen
        p.originX += Math.sin(time * 0.3 + p.life * 10) * 0.15;
        p.originY += Math.cos(time * 0.25 + p.life * 8) * 0.15;

        // Wrap origins around screen
        if (p.originX < -50) p.originX = w + 50;
        if (p.originX > w + 50) p.originX = -50;
        if (p.originY < -50) p.originY = h + 50;
        if (p.originY > h + 50) p.originY = -50;

        // Orbital motion with breathing radius
        const breathe = Math.sin(time * 0.5 + p.life * 6) * 0.3 + 1;
        const targetX = p.originX + Math.cos(p.angle) * p.orbitRadius * breathe;
        const targetY = p.originY + Math.sin(p.angle * 0.7 + time * 0.2) * p.orbitRadius * breathe * 0.6;

        // Smooth interpolation toward target
        p.vx += (targetX - p.x) * 0.008;
        p.vy += (targetY - p.y) * 0.008;

        // Mouse interaction - gentle attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250 && dist > 5) {
          const force = (1 - dist / 250) * 0.03;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping for fluid feel
        p.vx *= 0.95;
        p.vy *= 0.95;

        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw flowing connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const rawAlpha = 1 - dist / CONNECTION_DISTANCE;
            const wave = Math.sin(time * 1.5 + i * 0.3 + j * 0.2) * 0.5 + 0.5;
            const alpha = rawAlpha * rawAlpha * 0.15 * (0.5 + wave * 0.5);

            // Curved connections for organic feel
            const midX = (a.x + b.x) / 2 + Math.sin(time + i) * 8;
            const midY = (a.y + b.y) / 2 + Math.cos(time + j) * 8;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(midX, midY, b.x, b.y);
            ctx.strokeStyle = `hsla(${a.color}, ${alpha})`;
            ctx.lineWidth = rawAlpha * 1.2;
            ctx.stroke();

            // Flowing signal particles on strong connections
            if (rawAlpha > 0.5) {
              const signalT = (Math.sin(time * 2 + i * 1.3) + 1) / 2;
              const t = signalT;
              const sx = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * midX + t * t * b.x;
              const sy = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * midY + t * t * b.y;

              ctx.beginPath();
              ctx.arc(sx, sy, 1.5 * rawAlpha, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${b.color}, ${rawAlpha * 0.6})`;
              ctx.fill();
            }
          }
        }
      }

      // Draw particles with glow
      for (const p of particles) {
        const pulse = Math.sin(p.pulsePhase) * 0.5 + 0.5;
        const r = p.radius * (0.6 + pulse * 0.8);
        const alpha = 0.3 + pulse * 0.5;

        // Soft outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.color}, ${alpha * 0.04})`;
        ctx.fill();

        // Mid glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.color}, ${alpha * 0.1})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.color}, ${alpha * 0.85})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.color}, ${Math.min(alpha + 0.3, 1)})`;
        ctx.fill();
      }

      // Mouse glow
      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
        grad.addColorStop(0, "hsla(340,82%,55%,0.08)");
        grad.addColorStop(0.3, "hsla(270,76%,55%,0.04)");
        grad.addColorStop(0.6, "hsla(200,80%,50%,0.02)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 200, mouse.y - 200, 400, 400);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleMouse);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "hsl(240, 20%, 3%)" }}
    />
  );
}
