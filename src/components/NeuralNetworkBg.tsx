import { useEffect, useRef, useCallback } from "react";

/* ─── Types ─── */
interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  speed: number;
  layer: number; // 0-3
  hue: number;
  sat: number;
  light: number;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  hue: number;
  sat: number;
  light: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  rangeX: number;
  rangeY: number;
}

/* ─── Palette ─── */
const PALETTE = [
  { h: 340, s: 75, l: 62 }, // pink
  { h: 350, s: 65, l: 70 }, // rose
  { h: 330, s: 55, l: 58 }, // magenta
  { h: 20, s: 50, l: 70 },  // warm peach
  { h: 310, s: 40, l: 65 }, // lavender pink
];

/* ─── Config ─── */
const PARTICLE_DESKTOP = 50;
const PARTICLE_MOBILE = 25;
const CONN_DIST = 160;
const ORB_COUNT = 4;

export default function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<Orb[]>([]);
  const animRef = useRef(0);
  const timeRef = useRef(0);
  const visibleRef = useRef(true);

  const init = useCallback((w: number, h: number) => {
    const count = w < 640 ? PARTICLE_MOBILE : PARTICLE_DESKTOP;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      particles.push({
        x, y, originX: x, originY: y,
        vx: 0, vy: 0,
        radius: 1 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.004,
        layer: Math.floor(Math.random() * 4),
        hue: c.h + (Math.random() - 0.5) * 15,
        sat: c.s + (Math.random() - 0.5) * 10,
        light: c.l + (Math.random() - 0.5) * 10,
      });
    }
    particlesRef.current = particles;

    // Floating gradient orbs
    const orbs: Orb[] = [];
    for (let i = 0; i < ORB_COUNT; i++) {
      const c = PALETTE[i % PALETTE.length];
      orbs.push({
        x: w * (0.2 + Math.random() * 0.6),
        y: h * (0.2 + Math.random() * 0.6),
        radius: Math.max(w, h) * (0.15 + Math.random() * 0.15),
        hue: c.h,
        sat: c.s * 0.6,
        light: c.l,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.0003 + Math.random() * 0.0004,
        speedY: 0.0002 + Math.random() * 0.0004,
        rangeX: w * (0.1 + Math.random() * 0.15),
        rangeY: h * (0.08 + Math.random() * 0.12),
      });
    }
    orbsRef.current = orbs;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const onVisibility = () => {
      visibleRef.current = !document.hidden;
      if (visibleRef.current && !animRef.current) {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const draw = (timestamp: number = 0) => {
      if (!visibleRef.current) { animRef.current = 0; return; }
      const delta = timestamp - lastFrame;
      if (delta < FRAME_INTERVAL) { animRef.current = requestAnimationFrame(draw); return; }
      lastFrame = timestamp;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const particles = particlesRef.current;
      const orbs = orbsRef.current;
      const t = timeRef.current;
      timeRef.current += 0.004;

      ctx.clearRect(0, 0, w, h);

      /* ── Floating gradient orbs ── */
      for (const orb of orbs) {
        const ox = orb.x + Math.sin(t * 80 * orb.speedX + orb.phaseX) * orb.rangeX;
        const oy = orb.y + Math.cos(t * 80 * orb.speedY + orb.phaseY) * orb.rangeY;
        const pulse = 0.85 + Math.sin(t * 1.5 + orb.phaseX) * 0.15;
        const r = orb.radius * pulse;

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        grad.addColorStop(0, `hsla(${orb.hue}, ${orb.sat}%, ${orb.light}%, 0.08)`);
        grad.addColorStop(0.5, `hsla(${orb.hue}, ${orb.sat}%, ${orb.light}%, 0.03)`);
        grad.addColorStop(1, `hsla(${orb.hue}, ${orb.sat}%, ${orb.light}%, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(ox - r, oy - r, r * 2, r * 2);
      }

      /* ── Update particles ── */
      for (const p of particles) {
        p.phase += p.speed;
        const driftScale = 10 + p.layer * 8;
        const driftX = Math.sin(t * 0.4 + p.phase * 2) * driftScale;
        const driftY = Math.cos(t * 0.35 + p.phase * 1.7) * driftScale;
        p.vx += (p.originX + driftX - p.x) * 0.001;
        p.vy += (p.originY + driftY - p.y) * 0.001;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -50) { p.x = w + 50; p.originX = w * Math.random(); }
        if (p.x > w + 50) { p.x = -50; p.originX = w * Math.random(); }
        if (p.y < -50) { p.y = h + 50; p.originY = h * Math.random(); }
        if (p.y > h + 50) { p.y = -50; p.originY = h * Math.random(); }
      }

      /* ── Connections ── */
      ctx.lineCap = "round";
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONN_DIST) {
            const strength = 1 - dist / CONN_DIST;
            const alpha = strength * strength * 0.15;
            const midHue = (a.hue + b.hue) / 2;
            const midSat = (a.sat + b.sat) / 2;
            const midLight = (a.light + b.light) / 2;

            // Curved connection
            const curve = Math.sin(t * 1.5 + i * 0.3 + j * 0.2) * 8 * strength;
            const mx = (a.x + b.x) / 2 + curve;
            const my = (a.y + b.y) / 2 - curve;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(mx, my, b.x, b.y);
            ctx.strokeStyle = `hsla(${midHue}, ${midSat}%, ${midLight}%, ${alpha})`;
            ctx.lineWidth = strength * 1.5;
            ctx.stroke();
          }
        }
      }

      /* ── Particles ── */
      for (const p of particles) {
        const pulse = Math.sin(p.phase) * 0.5 + 0.5;
        const r = p.radius * (0.7 + pulse * 0.5);
        const alpha = 0.2 + pulse * 0.35;

        // Outer glow
        const glowR = r * 4;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        glow.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha * 0.12})`);
        glow.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - glowR, p.y - glowR, glowR * 2, glowR * 2);

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha * 0.6})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${Math.min(100, p.sat + 20)}%, ${Math.min(95, p.light + 15)}%, ${alpha * 0.9})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, hsl(340,50%,95%) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 70% 80%, hsl(350,40%,94%) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 50% 50%, hsl(330,35%,93%) 0%, hsl(340,30%,91%) 100%)",
      }}
    />
  );
}
