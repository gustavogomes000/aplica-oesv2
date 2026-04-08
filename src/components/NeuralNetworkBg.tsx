import { useEffect, useRef, useCallback } from "react";

/* ─── Types ─── */
interface Particle {
  x: number; y: number;
  originX: number; originY: number;
  vx: number; vy: number;
  radius: number; phase: number; speed: number;
  layer: number;
  hue: number; sat: number; light: number;
}

interface Orb {
  x: number; y: number; radius: number;
  hue: number; sat: number; light: number;
  phaseX: number; phaseY: number;
  speedX: number; speedY: number;
  rangeX: number; rangeY: number;
}

/* ─── Palette — vivid pinks/roses ─── */
const PALETTE = [
  { h: 340, s: 90, l: 60 },
  { h: 350, s: 80, l: 65 },
  { h: 325, s: 70, l: 55 },
  { h: 10,  s: 75, l: 68 },
  { h: 300, s: 55, l: 62 },
];

/* ─── Config ─── */
const PARTICLE_DESKTOP = 80;
const PARTICLE_MOBILE = 40;
const CONN_DIST = 180;
const ORB_COUNT = 5;

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
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1.5 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.008,
        layer: Math.floor(Math.random() * 4),
        hue: c.h + (Math.random() - 0.5) * 20,
        sat: c.s + (Math.random() - 0.5) * 15,
        light: c.l + (Math.random() - 0.5) * 10,
      });
    }
    particlesRef.current = particles;

    const orbs: Orb[] = [];
    for (let i = 0; i < ORB_COUNT; i++) {
      const c = PALETTE[i % PALETTE.length];
      orbs.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h * (0.15 + Math.random() * 0.7),
        radius: Math.max(w, h) * (0.18 + Math.random() * 0.2),
        hue: c.h, sat: c.s * 0.7, light: c.l,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.0004 + Math.random() * 0.0006,
        speedY: 0.0003 + Math.random() * 0.0005,
        rangeX: w * (0.12 + Math.random() * 0.18),
        rangeY: h * (0.1 + Math.random() * 0.15),
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const onVis = () => {
      visibleRef.current = !document.hidden;
      if (visibleRef.current && !animRef.current) animRef.current = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);

    let last = 0;
    const FPS = 1000 / 40;

    const draw = (ts: number = 0) => {
      if (!visibleRef.current) { animRef.current = 0; return; }
      if (ts - last < FPS) { animRef.current = requestAnimationFrame(draw); return; }
      last = ts;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const ps = particlesRef.current;
      const orbs = orbsRef.current;
      const t = timeRef.current;
      timeRef.current += 0.006;

      ctx.clearRect(0, 0, w, h);

      /* ── Orbs with breathing glow ── */
      for (const o of orbs) {
        const ox = o.x + Math.sin(t * 60 * o.speedX + o.phaseX) * o.rangeX;
        const oy = o.y + Math.cos(t * 60 * o.speedY + o.phaseY) * o.rangeY;
        const pulse = 0.8 + Math.sin(t * 2 + o.phaseX) * 0.2;
        const r = o.radius * pulse;

        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        g.addColorStop(0, `hsla(${o.hue}, ${o.sat}%, ${o.light}%, 0.12)`);
        g.addColorStop(0.4, `hsla(${o.hue}, ${o.sat}%, ${o.light}%, 0.06)`);
        g.addColorStop(1, `hsla(${o.hue}, ${o.sat}%, ${o.light}%, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(ox - r, oy - r, r * 2, r * 2);
      }

      /* ── Update particles ── */
      for (const p of ps) {
        p.phase += p.speed;
        const drift = 15 + p.layer * 12;
        const dx = Math.sin(t * 0.5 + p.phase * 2.5) * drift;
        const dy = Math.cos(t * 0.4 + p.phase * 2) * drift;
        p.vx += (p.originX + dx - p.x) * 0.0015;
        p.vy += (p.originY + dy - p.y) * 0.0015;
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy;

        if (p.x < -60) { p.x = w + 60; p.originX = w * Math.random(); }
        if (p.x > w + 60) { p.x = -60; p.originX = w * Math.random(); }
        if (p.y < -60) { p.y = h + 60; p.originY = h * Math.random(); }
        if (p.y > h + 60) { p.y = -60; p.originY = h * Math.random(); }
      }

      /* ── Connections with gradient lines ── */
      ctx.lineCap = "round";
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const ddx = a.x - b.x, ddy = a.y - b.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < CONN_DIST) {
            const s = 1 - dist / CONN_DIST;
            const alpha = s * s * 0.25;

            const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            lg.addColorStop(0, `hsla(${a.hue}, ${a.sat}%, ${a.light}%, ${alpha})`);
            lg.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, ${alpha})`);

            const curve = Math.sin(t * 2 + i * 0.4 + j * 0.25) * 12 * s;
            const mx = (a.x + b.x) / 2 + curve;
            const my = (a.y + b.y) / 2 - curve;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(mx, my, b.x, b.y);
            ctx.strokeStyle = lg;
            ctx.lineWidth = s * 2;
            ctx.stroke();
          }
        }
      }

      /* ── Particles with layered glow ── */
      for (const p of ps) {
        const pulse = Math.sin(p.phase) * 0.5 + 0.5;
        const r = p.radius * (0.8 + pulse * 0.6);
        const alpha = 0.3 + pulse * 0.5;

        // Outer glow
        const gr = r * 6;
        const g1 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
        g1.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha * 0.15})`);
        g1.addColorStop(0.5, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha * 0.05})`);
        g1.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0)`);
        ctx.fillStyle = g1;
        ctx.fillRect(p.x - gr, p.y - gr, gr * 2, gr * 2);

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha * 0.7})`;
        ctx.fill();

        // Hot center
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${Math.min(100, p.sat + 25)}%, ${Math.min(97, p.light + 20)}%, ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse at 25% 15%, hsl(340,60%,94%) 0%, transparent 55%), " +
          "radial-gradient(ellipse at 75% 85%, hsl(350,50%,93%) 0%, transparent 55%), " +
          "radial-gradient(ellipse at 50% 50%, hsl(330,40%,92%) 0%, hsl(340,35%,90%) 100%)",
      }}
    />
  );
}
