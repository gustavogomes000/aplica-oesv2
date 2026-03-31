import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

const PINK = "340,82%,55%";
const CYAN = "190,85%,50%";
const PURPLE = "270,70%,55%";

const COLORS = [PINK, CYAN, PURPLE];
const NODE_COUNT_DESKTOP = 80;
const NODE_COUNT_MOBILE = 45;
const CONN_DIST = 200;

export default function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(0);
  const timeRef = useRef(0);

  const initNodes = useCallback((w: number, h: number) => {
    const count = w < 640 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    const nodes: Node[] = [];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      nodes.push({
        x, y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.2 + Math.random() * 2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        layer: Math.floor(Math.random() * 3),
      });
    }
    nodesRef.current = nodes;
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
      initNodes(window.innerWidth, window.innerHeight);
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

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const t = timeRef.current;
      timeRef.current += 0.016;

      ctx.clearRect(0, 0, w, h);

      // ── Update nodes: organic wandering ──
      for (const n of nodes) {
        n.pulse += n.pulseSpeed;

        // Gentle sinusoidal drift around origin
        const driftX = Math.sin(t * 0.3 + n.pulse * 2) * 40;
        const driftY = Math.cos(t * 0.25 + n.pulse * 1.7) * 40;
        const targetX = n.originX + driftX;
        const targetY = n.originY + driftY;

        // Spring back to drifting target
        n.vx += (targetX - n.x) * 0.005;
        n.vy += (targetY - n.y) * 0.005;

        // Mouse repulsion for organic feel
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 1) {
          const force = (1 - dist / 180) * 1.5;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }

        n.vx *= 0.94;
        n.vy *= 0.94;
        n.x += n.vx;
        n.y += n.vy;

        // Soft wrap
        if (n.x < -30) { n.x = w + 30; n.originX = w + 30; }
        if (n.x > w + 30) { n.x = -30; n.originX = -30; }
        if (n.y < -30) { n.y = h + 30; n.originY = h + 30; }
        if (n.y > h + 30) { n.y = -30; n.originY = -30; }
      }

      // ── Draw web connections (teia) ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONN_DIST) {
            const strength = 1 - dist / CONN_DIST;
            const wave = Math.sin(t * 1.2 + i * 0.5 + j * 0.3) * 0.5 + 0.5;
            const alpha = strength * strength * (0.08 + wave * 0.07);

            const color = COLORS[a.layer % 3];

            // Draw curved web strand
            const midX = (a.x + b.x) / 2 + Math.sin(t * 0.6 + i + j) * 12 * strength;
            const midY = (a.y + b.y) / 2 + Math.cos(t * 0.5 + i - j) * 12 * strength;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(midX, midY, b.x, b.y);
            ctx.strokeStyle = `hsla(${color},${alpha})`;
            ctx.lineWidth = strength * 1.5;
            ctx.stroke();

            // Signal pulse traveling along strong connections
            if (strength > 0.45) {
              const signalT = (t * 1.8 + i * 0.7) % 1;
              const inv = 1 - signalT;
              const sx = inv * inv * a.x + 2 * inv * signalT * midX + signalT * signalT * b.x;
              const sy = inv * inv * a.y + 2 * inv * signalT * midY + signalT * signalT * b.y;

              ctx.beginPath();
              ctx.arc(sx, sy, 1.5 + strength, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${COLORS[b.layer % 3]},${strength * 0.5})`;
              ctx.fill();
            }
          }
        }
      }

      // ── Draw nodes ──
      for (const n of nodes) {
        const p = Math.sin(n.pulse) * 0.5 + 0.5;
        const r = n.radius * (0.7 + p * 0.6);
        const alpha = 0.35 + p * 0.45;
        const color = COLORS[n.layer % 3];

        // Soft glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.05})`;
        ctx.fill();

        // Mid ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.1})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.8})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${Math.min(alpha + 0.2, 1)})`;
        ctx.fill();
      }

      // ── Mouse glow ──
      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
        grad.addColorStop(0, `hsla(${PINK},0.07)`);
        grad.addColorStop(0.5, `hsla(${PURPLE},0.03)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 160, mouse.y - 160, 320, 320);
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
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "linear-gradient(180deg, hsl(240,15%,4%) 0%, hsl(235,18%,6%) 50%, hsl(240,15%,4%) 100%)" }}
    />
  );
}
