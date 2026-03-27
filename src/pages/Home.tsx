import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Handshake,
  ReceiptText,
  ClipboardCheck,
  UserRoundPlus,
  Laptop,
  BarChart3,
  Globe,
  ArrowUpRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

const PHOTO_URL =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699400706d955b03c8c19827/16e72069d_WhatsAppImage2026-02-17at023641.jpeg";

/* ─── dados dos apps ─────────────────────────────────────────────── */
const apps = [
  {
    id: "liderancas",
    title: "Lideranças",
    desc: "Cadastro de lideranças da campanha",
    badge: "Articulação",
    Icon: Handshake,
    gradient: "from-rose-500 to-pink-700",
    glowColor: "hsl(340, 82%, 52%)",
    url: "https://liderancas.deputadasarelli.com.br/login",
    xp: 850,
  },
  {
    id: "financeiro",
    title: "Financeiro",
    desc: "Lançamento de contas do escritório",
    badge: "Finanças",
    Icon: ReceiptText,
    gradient: "from-violet-500 to-purple-800",
    glowColor: "hsl(270, 76%, 53%)",
    url: "https://contas.deputadasarelli.com.br/login",
    xp: 720,
  },
  {
    id: "visitas",
    title: "Visitas",
    desc: "Registros de visitas ao escritório",
    badge: "Escritório",
    Icon: ClipboardCheck,
    gradient: "from-red-400 to-rose-700",
    glowColor: "hsl(350, 80%, 55%)",
    url: "https://visitas.deputadasarelli.com.br/",
    xp: 640,
  },
  {
    id: "suplentes",
    title: "Suplentes",
    desc: "Cadastro de suplentes e apoiadores",
    badge: "Equipe",
    Icon: UserRoundPlus,
    gradient: "from-pink-400 to-fuchsia-700",
    glowColor: "hsl(330, 76%, 55%)",
    url: "https://suplentes.deputadasarelli.com.br/login",
    xp: 580,
  },
  {
    id: "computadores",
    title: "Computadores",
    desc: "Gestão e acesso remoto de TI",
    badge: "TI",
    Icon: Laptop,
    gradient: "from-indigo-500 to-blue-800",
    glowColor: "hsl(230, 76%, 55%)",
    url: "https://computadores.deputadasarelli.com.br/login",
    xp: 430,
  },
  {
    id: "dados",
    title: "Dados do Site",
    desc: "Análises e inteligência digital",
    badge: "Analytics",
    Icon: BarChart3,
    gradient: "from-cyan-400 to-teal-700",
    glowColor: "hsl(185, 76%, 50%)",
    url: "https://paineldedados.deputadasarelli.com.br/login",
    xp: 920,
  },
  {
    id: "site",
    title: "Site Oficial",
    desc: "Portal institucional da campanha",
    badge: "Presença",
    Icon: Globe,
    gradient: "from-pink-400 to-rose-600",
    glowColor: "hsl(340, 82%, 60%)",
    url: "https://www.deputadasarelli.com.br",
    xp: 1000,
  },
] as const;

type App = (typeof apps)[number];

/* ─── interactive mouse-following background ─────────────────────── */
function InteractiveBackground() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const glowX = useTransform(smoothX, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(smoothY, [0, 1], ["20%", "80%"]);
  const gridOffsetX = useTransform(smoothX, [0, 1], [0, 30]);
  const gridOffsetY = useTransform(smoothY, [0, 1], [0, 30]);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const y = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      mouseX.set(x / window.innerWidth);
      mouseY.set(y / window.innerHeight);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    window.addEventListener("touchmove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("touchmove", handler);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[hsl(240,20%,3%)]" />

      {/* Interactive glow that follows cursor */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, hsl(340,82%,55%), hsl(270,76%,55%) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Static orbs */}
      <div className="absolute w-[400px] h-[400px] -top-[80px] -left-[80px] rounded-full opacity-[0.06] animate-[orbFloat_15s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, hsl(200,80%,50%), transparent 60%)" }} />
      <div className="absolute w-[300px] h-[300px] bottom-[10%] right-[-60px] rounded-full opacity-[0.04] animate-[orbFloat_18s_ease-in-out_infinite_5s]"
        style={{ background: "radial-gradient(circle, hsl(150,70%,50%), transparent 60%)" }} />

      {/* Interactive parallax grid */}
      <motion.div className="absolute inset-[-30px] opacity-[0.05]" style={{
        x: gridOffsetX,
        y: gridOffsetY,
        backgroundImage: `
          linear-gradient(hsl(200,80%,50%) 1px, transparent 1px),
          linear-gradient(90deg, hsl(200,80%,50%) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }} />

      {/* Hex overlay */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `
          linear-gradient(60deg, hsl(340,82%,55%) 1px, transparent 1px),
          linear-gradient(-60deg, hsl(340,82%,55%) 1px, transparent 1px)
        `,
        backgroundSize: "35px 60px",
        animation: "gridScroll 30s linear infinite",
      }} />

      {/* Dual scan lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 right-0 h-[2px] opacity-[0.18]"
          style={{
            background: "linear-gradient(90deg, transparent 5%, hsl(340,82%,55%) 20%, hsl(200,80%,50%) 50%, hsl(150,70%,50%) 80%, transparent 95%)",
            animation: "scanLine 4s linear infinite",
            filter: "blur(0.5px)",
          }} />
        <div className="absolute left-0 right-0 h-px opacity-[0.06]"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(270,76%,55%), transparent)",
            animation: "scanLine 9s linear infinite 3s",
          }} />
      </div>

      {/* Vertical energy beam */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 bottom-0 w-[2px] opacity-[0.06]"
          style={{
            background: "linear-gradient(to bottom, transparent, hsl(200,80%,50%), transparent)",
            animation: "scanLineH 11s linear infinite",
          }} />
      </div>

      {/* Matrix data rain */}
      {[5, 15, 28, 40, 55, 67, 78, 90].map((left, i) => (
        <div key={`rain-${i}`} className="absolute top-0 w-px h-full"
          style={{
            left: `${left}%`,
            opacity: 0.025 + (i % 3) * 0.01,
            background: `repeating-linear-gradient(to bottom, transparent, transparent ${14 + i * 3}px, ${['hsl(200,80%,50%)','hsl(340,82%,55%)','hsl(150,70%,50%)'][i % 3]} ${14 + i * 3}px, ${['hsl(200,80%,50%)','hsl(340,82%,55%)','hsl(150,70%,50%)'][i % 3]} ${16 + i * 3}px)`,
            animation: `dataStream ${2.5 + i * 0.5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }}
        />
      ))}

      {/* Floating game particles */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={`gp-${i}`}
          className="absolute"
          style={{
            width: i % 4 === 0 ? "3px" : "2px",
            height: i % 4 === 0 ? "3px" : "2px",
            borderRadius: i % 3 === 0 ? "0" : "50%",
            left: `${5 + i * 5.8}%`,
            top: `${8 + (i * 29) % 82}%`,
            background: ["hsl(340,82%,55%)", "hsl(200,80%,50%)", "hsl(150,70%,50%)", "hsl(270,76%,55%)"][i % 4],
            opacity: 0.12 + (i % 5) * 0.06,
            animation: `particleFloat ${2.5 + i * 0.4}s ease-in-out infinite ${i * 0.3}s`,
            boxShadow: `0 0 ${4 + i % 3 * 2}px ${["hsl(340,82%,55%)", "hsl(200,80%,50%)", "hsl(150,70%,50%)", "hsl(270,76%,55%)"][i % 4]}40`,
          }}
        />
      ))}

      {/* Corner HUD brackets with pulse */}
      <div className="absolute top-3 left-3 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-t-2 border-primary/25 rounded-tl-sm animate-[hudPulse_3s_ease-in-out_infinite]" />
      <div className="absolute top-3 right-3 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-cyan-500/20 rounded-tr-sm animate-[hudPulse_3s_ease-in-out_infinite_0.8s]" />
      <div className="absolute bottom-3 left-3 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-b-2 border-violet-500/20 rounded-bl-sm animate-[hudPulse_3s_ease-in-out_infinite_1.6s]" />
      <div className="absolute bottom-3 right-3 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-b-2 border-emerald-500/20 rounded-br-sm animate-[hudPulse_3s_ease-in-out_infinite_2.4s]" />

      {/* Circuit SVG with glow */}
      <svg className="absolute bottom-[6%] left-[2%] w-44 h-28 sm:w-64 sm:h-36 opacity-[0.07]" viewBox="0 0 220 130">
        <path d="M0,65 H45 L60,25 H100 L115,65 H160 L175,95 H220" fill="none" stroke="hsl(200,80%,50%)" strokeWidth="1.5"
          strokeDasharray="8 4" style={{ animation: "circuitFlow 3s linear infinite" }} />
        <path d="M0,95 H30 L45,55 H85 L100,95 H140 L155,25 H220" fill="none" stroke="hsl(340,82%,55%)" strokeWidth="1"
          strokeDasharray="6 6" style={{ animation: "circuitFlow 4.5s linear infinite reverse" }} />
        <circle cx="60" cy="25" r="3.5" fill="hsl(200,80%,50%)" className="animate-[blip_2s_ease-in-out_infinite]" />
        <circle cx="155" cy="25" r="3" fill="hsl(340,82%,55%)" className="animate-[blip_2s_ease-in-out_infinite_1s]" />
        <circle cx="115" cy="65" r="2.5" fill="hsl(150,70%,50%)" className="animate-[blip_2.5s_ease-in-out_infinite_0.5s]" />
      </svg>

      {/* Circuit – right */}
      <svg className="absolute top-[30%] right-[1%] w-16 h-40 sm:w-24 sm:h-48 opacity-[0.05]" viewBox="0 0 100 200">
        <path d="M50,0 V40 L85,55 V100 L15,115 V155 L50,170 V200" fill="none" stroke="hsl(270,76%,55%)" strokeWidth="1.5"
          strokeDasharray="5 5" style={{ animation: "circuitFlow 5s linear infinite" }} />
        <circle cx="85" cy="55" r="3" fill="hsl(270,76%,55%)" className="animate-[blip_3s_ease-in-out_infinite]" />
        <circle cx="15" cy="115" r="2" fill="hsl(200,80%,50%)" className="animate-[blip_2s_ease-in-out_infinite_1.5s]" />
      </svg>


      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />
    </div>
  );
}




/* ─── app card with XP bar ───────────────────────────────────────── */
function AppCard({ app, index }: { app: App; index: number }) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative block cursor-pointer"
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.05 * index + 0.15, type: "spring", stiffness: 180, damping: 18 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] transition-all duration-300 group-hover:border-primary/25 group-hover:shadow-[0_0_30px_-10px] group-hover:shadow-primary/20"
        style={{ background: "linear-gradient(145deg, hsl(240 10% 9% / 0.9), hsl(240 10% 5% / 0.95))" }}>

        {/* Top accent bar */}
        <div className={`h-[2px] w-full bg-gradient-to-r ${app.gradient} transition-all duration-300 group-hover:h-[3px]`} />

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(250px circle at 50% 20%, ${app.glowColor}18, transparent 60%)` }} />

        <div className="p-3 sm:p-4">
          {/* Icon + badge */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <motion.div
              className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${app.gradient} shadow-lg`}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
              transition={{ duration: 0.4 }}
            >
              <app.Icon size={16} strokeWidth={1.8} className="text-white sm:hidden" />
              <app.Icon size={18} strokeWidth={1.8} className="text-white hidden sm:block" />
            </motion.div>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50 bg-white/[0.04] border border-white/[0.06] px-1.5 sm:px-2 py-0.5 rounded-full">
              {app.badge}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-foreground/90 mb-0.5 flex items-center gap-1">
            {app.title}
            <ArrowUpRight size={10} className="text-primary/30 group-hover:text-primary/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 sm:w-3 sm:h-3" />
          </h3>

          {/* Desc */}
          <p className="text-[10px] sm:text-[11px] text-muted-foreground/35 leading-relaxed line-clamp-1 mb-2">
            {app.desc}
          </p>

        </div>

        {/* Bottom shimmer */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${app.gradient} transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100`} />
      </div>
    </motion.a>
  );
}

/* ─── greeting ───────────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/* ─── main component ─────────────────────────────────────────────── */
export default function Home() {
  useEffect(() => {}, []);

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden select-none dark"
      style={{ background: "hsl(240, 10%, 3%)" }}>

      <InteractiveBackground />

      <div className="relative z-10 flex flex-col min-h-[100dvh]">

        {/* ── HERO ── */}
        <motion.header
          className="w-full"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3 sm:pt-10 sm:pb-5">
            <div className="flex flex-row items-center gap-4 sm:gap-6">

              {/* Photo with level badge */}
              <motion.div
                className="relative flex-shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, hsl(340,82%,55%), hsl(270,76%,55%), hsl(200,76%,50%), hsl(150,70%,50%), hsl(340,82%,55%))",
                      padding: "2px",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full rounded-full bg-[hsl(240,10%,3%)]" />
                  </motion.div>
                  <div className="absolute inset-[4px] rounded-full overflow-hidden">
                    <img
                      src={PHOTO_URL}
                      alt="Dra. Fernanda Sarelli"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                  {/* Level badge */}
                  <motion.div
                    className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 z-20 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 sm:border-[3px]"
                    style={{
                      background: "linear-gradient(135deg, hsl(340,82%,55%), hsl(270,76%,55%))",
                      borderColor: "hsl(240,10%,3%)",
                      boxShadow: "0 0 12px hsl(340,82%,55%,0.4)",
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="text-[8px] sm:text-[10px] font-black text-white">99</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                className="flex flex-col min-w-0"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.p
                  className="text-primary/70 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-1 flex items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles size={10} className="sm:w-3 sm:h-3 animate-[blip_2s_ease-in-out_infinite]" />
                  {getGreeting()}
                </motion.p>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-[1.1]">
                  <span className="block">Dra. Fernanda</span>
                  <span className="bg-gradient-to-r from-primary via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Sarelli
                  </span>
                </h1>

                <motion.div
                  className="flex items-center gap-2 mt-1.5 sm:mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="h-[2px] w-5 sm:w-8 rounded-full bg-gradient-to-r from-primary to-transparent" />
                  <p className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground/40">
                    Central de Operações
                  </p>
                </motion.div>

                <motion.p
                  className="text-[10px] sm:text-xs text-muted-foreground/25 capitalize mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {dateStr}
                </motion.p>
              </motion.div>

              {/* Status badge — desktop */}
              <motion.div
                className="hidden md:flex ml-auto self-start mt-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] backdrop-blur-md"
                  style={{ background: "hsl(240 10% 8% / 0.6)" }}>
                  <Shield size={10} className="text-primary/50" />
                  <span className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-[0.15em]">
                    Acesso Restrito
                  </span>
                </div>
              </motion.div>
            </div>
          </div>


          <div className="h-px mx-4 sm:mx-8 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </motion.header>

        {/* ── APPS GRID ── */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

          {/* Section title */}
          <motion.div
            className="flex items-center gap-2 mb-4 sm:mb-5"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-1 h-4 sm:h-5 rounded-full bg-gradient-to-b from-primary to-violet-500 animate-[hudPulse_3s_ease-in-out_infinite]" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground/40">
              Ecossistema de Gestão
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            <motion.span
              className="text-[9px] sm:text-[10px] text-primary/40 font-bold tabular-nums"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {apps.length} MÓDULOS
            </motion.span>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
            {apps.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))}
          </div>
        </main>

        {/* ── FOOTER ── */}
        <motion.footer
          className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="h-px mb-4 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5">
            <p className="text-[10px] sm:text-[11px] text-primary/20 font-medium">
              Pré-candidata a Deputada Estadual — GO 2026
            </p>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground/15">
              © {new Date().getFullYear()} Dra. Fernanda Sarelli
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
