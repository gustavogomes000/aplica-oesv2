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

const PINK = "340,82%,52%";
const CYAN = "200,70%,40%";
const PURPLE = "270,50%,42%";

const COLORS = [PINK, CYAN, PURPLE];
const NODE_COUNT_DESKTOP = 55;
const NODE_COUNT_MOBILE = 30;
const CONN_DIST = 240;

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
        vx: 0,
        vy: 0,
        radius: 1 + Math.random() * 1.8,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.003 + Math.random() * 0.004,
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
      timeRef.current += 0.003; // Ultra slow

      ctx.clearRect(0, 0, w, h);

      // ── Update nodes: very slow drift ──
      for (const n of nodes) {
        n.pulse += n.pulseSpeed;

        // Very gentle sinusoidal drift
        const driftX = Math.sin(t * 0.8 + n.pulse * 3) * 25;
        const driftY = Math.cos(t * 0.6 + n.pulse * 2.5) * 25;
        const targetX = n.originX + driftX;
        const targetY = n.originY + driftY;

        n.vx += (targetX - n.x) * 0.002;
        n.vy += (targetY - n.y) * 0.002;

        // Mouse gentle repulsion
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 1) {
          const force = (1 - dist / 150) * 0.5;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }

        n.vx *= 0.97;
        n.vy *= 0.97;
        n.x += n.vx;
        n.y += n.vy;

        // Wrap
        if (n.x < -40) { n.x = w + 40; n.originX = w + 40; }
        if (n.x > w + 40) { n.x = -40; n.originX = -40; }
        if (n.y < -40) { n.y = h + 40; n.originY = h + 40; }
        if (n.y > h + 40) { n.y = -40; n.originY = -40; }
      }

      // ── Draw web connections ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);

          if (dist < CONN_DIST) {
            const strength = 1 - dist / CONN_DIST;
            const alpha = strength * strength * 0.06;
            const color = COLORS[a.layer % 3];

            // Slightly curved web strand
            const midX = (a.x + b.x) / 2 + Math.sin(t * 1.5 + i + j) * 6 * strength;
            const midY = (a.y + b.y) / 2 + Math.cos(t * 1.2 + i - j) * 6 * strength;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(midX, midY, b.x, b.y);
            ctx.strokeStyle = `hsla(${color},${alpha})`;
            ctx.lineWidth = strength * 1;
            ctx.stroke();

            // Slow signal on strong connections
            if (strength > 0.5) {
              const signalT = (t * 0.5 + i * 0.4) % 1;
              const inv = 1 - signalT;
              const sx = inv * inv * a.x + 2 * inv * signalT * midX + signalT * signalT * b.x;
              const sy = inv * inv * a.y + 2 * inv * signalT * midY + signalT * signalT * b.y;

              ctx.beginPath();
              ctx.arc(sx, sy, 1 + strength * 0.8, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${COLORS[b.layer % 3]},${strength * 0.25})`;
              ctx.fill();
            }
          }
        }
      }

      // ── Draw nodes ──
      for (const n of nodes) {
        const p = Math.sin(n.pulse) * 0.5 + 0.5;
        const r = n.radius * (0.8 + p * 0.4);
        const alpha = 0.2 + p * 0.25;
        const color = COLORS[n.layer % 3];

        // Soft glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.04})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.6})`;
        ctx.fill();

        // Center
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.9})`;
        ctx.fill();
      }

      // ── Mouse glow ──
      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        grad.addColorStop(0, `hsla(${PINK},0.04)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 120, mouse.y - 120, 240, 240);
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
      style={{ background: "linear-gradient(180deg, hsl(235,18%,3%) 0%, hsl(240,15%,5%) 50%, hsl(235,18%,3%) 100%)" }}
    />
  );
}
