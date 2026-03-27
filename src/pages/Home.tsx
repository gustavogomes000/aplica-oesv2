import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    url: "http://liderancas.deputadasarelli.com.br/login",
  },
  {
    id: "financeiro",
    title: "Financeiro",
    desc: "Lançamento de contas do escritório",
    badge: "Finanças",
    Icon: ReceiptText,
    gradient: "from-violet-500 to-purple-800",
    glowColor: "hsl(270, 76%, 53%)",
    url: "http://contas.deputadasarelli.com.br/login",
  },
  {
    id: "visitas",
    title: "Visitas",
    desc: "Registros de visitas ao escritório",
    badge: "Escritório",
    Icon: ClipboardCheck,
    gradient: "from-red-400 to-rose-700",
    glowColor: "hsl(350, 80%, 55%)",
    url: "http://visitas.deputadasarelli.com.br/",
  },
  {
    id: "suplentes",
    title: "Suplentes",
    desc: "Cadastro de suplentes e apoiadores",
    badge: "Equipe",
    Icon: UserRoundPlus,
    gradient: "from-pink-400 to-fuchsia-700",
    glowColor: "hsl(330, 76%, 55%)",
    url: "http://suplentes.deputadasarelli.com.br/login",
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
  },
] as const;

type App = (typeof apps)[number];

/* ─── gamified tech background ──────────────────────────────────── */
function TechBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[hsl(240,20%,3%)]" />

      {/* Animated gradient orbs */}
      <div className="absolute w-[500px] h-[500px] -top-[100px] -left-[100px] rounded-full opacity-[0.08] animate-[orbFloat_12s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, hsl(340,82%,55%), transparent 60%)" }} />
      <div className="absolute w-[400px] h-[400px] top-[60%] -right-[80px] rounded-full opacity-[0.06] animate-[orbFloat_15s_ease-in-out_infinite_3s]"
        style={{ background: "radial-gradient(circle, hsl(200,80%,50%), transparent 60%)" }} />
      <div className="absolute w-[300px] h-[300px] top-[30%] left-[40%] rounded-full opacity-[0.04] animate-[orbFloat_18s_ease-in-out_infinite_6s]"
        style={{ background: "radial-gradient(circle, hsl(270,76%,53%), transparent 60%)" }} />

      {/* Grid – game-style perspective */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `
          linear-gradient(hsl(200,80%,50%) 1px, transparent 1px),
          linear-gradient(90deg, hsl(200,80%,50%) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        animation: "gridScroll 20s linear infinite",
      }} />

      {/* Hex overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(60deg, hsl(340,82%,55%) 1px, transparent 1px),
          linear-gradient(-60deg, hsl(340,82%,55%) 1px, transparent 1px)
        `,
        backgroundSize: "35px 60px",
      }} />

      {/* Horizontal scan lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 right-0 h-[2px] opacity-[0.15]"
          style={{
            background: "linear-gradient(90deg, transparent 5%, hsl(340,82%,55%) 30%, hsl(200,80%,50%) 70%, transparent 95%)",
            animation: "scanLine 4s linear infinite",
            filter: "blur(0.5px)",
          }} />
        <div className="absolute left-0 right-0 h-px opacity-[0.08]"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(200,80%,50%), transparent)",
            animation: "scanLine 7s linear infinite 2s",
          }} />
      </div>

      {/* Vertical energy beam */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 bottom-0 w-[2px] opacity-[0.08]"
          style={{
            background: "linear-gradient(to bottom, transparent, hsl(270,76%,55%), transparent)",
            animation: "scanLineH 9s linear infinite",
            filter: "blur(1px)",
          }} />
      </div>

      {/* Floating particles – game-like pixel dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${8 + i * 7.5}%`,
            top: `${10 + (i * 23) % 80}%`,
            background: i % 3 === 0 ? "hsl(340,82%,55%)" : i % 3 === 1 ? "hsl(200,80%,50%)" : "hsl(150,70%,50%)",
            opacity: 0.15 + (i % 4) * 0.08,
            animation: `particleFloat ${3 + i * 0.5}s ease-in-out infinite ${i * 0.4}s`,
          }}
        />
      ))}

      {/* Data streams – vertical matrix-like lines */}
      {[6, 18, 34, 52, 68, 82, 94].map((left, i) => (
        <div key={`ds-${i}`} className="absolute top-0 w-px h-full"
          style={{
            left: `${left}%`,
            opacity: 0.03 + (i % 3) * 0.015,
            background: `repeating-linear-gradient(to bottom, transparent, transparent ${16 + i * 3}px, ${i % 2 === 0 ? 'hsl(200,80%,50%)' : 'hsl(340,82%,55%)'} ${16 + i * 3}px, ${i % 2 === 0 ? 'hsl(200,80%,50%)' : 'hsl(340,82%,55%)'} ${18 + i * 3}px)`,
            animation: `dataStream ${2 + i * 0.6}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }}
        />
      ))}

      {/* Corner HUD brackets */}
      <div className="absolute top-3 left-3 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-t-2 border-primary/20 rounded-tl-sm animate-[hudPulse_4s_ease-in-out_infinite]" />
      <div className="absolute top-3 right-3 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-primary/20 rounded-tr-sm animate-[hudPulse_4s_ease-in-out_infinite_1s]" />
      <div className="absolute bottom-3 left-3 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-b-2 border-primary/20 rounded-bl-sm animate-[hudPulse_4s_ease-in-out_infinite_2s]" />
      <div className="absolute bottom-3 right-3 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-b-2 border-primary/20 rounded-br-sm animate-[hudPulse_4s_ease-in-out_infinite_3s]" />

      {/* Circuit SVG lines */}
      <svg className="absolute bottom-[8%] left-[3%] w-40 h-24 sm:w-56 sm:h-32 opacity-[0.06]" viewBox="0 0 200 120" preserveAspectRatio="none">
        <path d="M0,60 H40 L55,25 H95 L110,60 H150 L165,90 H200" fill="none" stroke="hsl(200,80%,50%)" strokeWidth="1.5"
          strokeDasharray="8 4" style={{ animation: "circuitFlow 3s linear infinite" }} />
        <path d="M0,90 H25 L40,55 H80 L95,90 H135 L150,25 H200" fill="none" stroke="hsl(340,82%,55%)" strokeWidth="1"
          strokeDasharray="6 6" style={{ animation: "circuitFlow 4.5s linear infinite reverse" }} />
        <circle cx="55" cy="25" r="3" fill="hsl(200,80%,50%)" className="animate-[blip_2s_ease-in-out_infinite]" />
        <circle cx="150" cy="25" r="2.5" fill="hsl(340,82%,55%)" className="animate-[blip_2s_ease-in-out_infinite_1s]" />
        <circle cx="110" cy="60" r="2" fill="hsl(150,70%,50%)" className="animate-[blip_3s_ease-in-out_infinite_0.5s]" />
      </svg>

      {/* Circuit SVG – right */}
      <svg className="absolute top-[35%] right-[2%] w-20 h-36 sm:w-28 sm:h-44 opacity-[0.04]" viewBox="0 0 100 180">
        <path d="M50,0 V35 L80,50 V95 L20,110 V145 L50,160 V180" fill="none" stroke="hsl(200,80%,50%)" strokeWidth="1.5"
          strokeDasharray="5 5" style={{ animation: "circuitFlow 5s linear infinite" }} />
        <circle cx="80" cy="50" r="2.5" fill="hsl(270,76%,55%)" className="animate-[blip_2.5s_ease-in-out_infinite]" />
      </svg>

      {/* Status indicators */}
      <div className="absolute top-4 left-14 sm:top-5 sm:left-20 flex items-center gap-1.5 opacity-[0.2] animate-[hudPulse_5s_ease-in-out_infinite_2s]">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[blip_2s_ease-in-out_infinite]" />
        <span className="text-[8px] sm:text-[9px] font-mono text-emerald-400/80 tracking-[0.15em]">ONLINE</span>
      </div>
      <div className="absolute top-4 right-14 sm:top-5 sm:right-20 flex items-center gap-1.5 opacity-[0.15] animate-[hudPulse_5s_ease-in-out_infinite_3s]">
        <Zap size={8} className="text-cyan-400/80" />
        <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400/80 tracking-[0.15em]">SECURE</span>
      </div>

      {/* XP bar – game-style at the very top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden">
        <div className="h-full animate-[xpBar_8s_ease-in-out_infinite]"
          style={{ background: "linear-gradient(90deg, hsl(340,82%,55%), hsl(270,76%,55%), hsl(200,80%,50%))" }} />
      </div>

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />
    </div>
  );
}

/* ─── app card ───────────────────────────────────────────────────── */
function AppCard({ app, index }: { app: App; index: number }) {
  return (
    <motion.a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block"
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.05 * index + 0.15, type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] transition-all duration-300 hover:scale-[1.03] hover:border-primary/20 active:scale-[0.98]"
        style={{ background: "linear-gradient(145deg, hsl(240 10% 9% / 0.9), hsl(240 10% 5% / 0.95))" }}>

        {/* Top accent bar */}
        <div className={`h-[2px] w-full bg-gradient-to-r ${app.gradient} transition-all duration-300 group-hover:h-[3px]`} />

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(200px circle at 50% 30%, ${app.glowColor}12, transparent 60%)` }} />

        <div className="p-3 sm:p-4">
          {/* Icon + badge */}
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${app.gradient} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
              <app.Icon size={16} strokeWidth={1.8} className="text-white sm:hidden" />
              <app.Icon size={18} strokeWidth={1.8} className="text-white hidden sm:block" />
            </div>
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
          <p className="text-[10px] sm:text-[11px] text-muted-foreground/35 leading-relaxed line-clamp-1">
            {app.desc}
          </p>
        </div>

        {/* Bottom progress shimmer */}
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
  const [, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden select-none dark"
      style={{ background: "hsl(240, 10%, 3%)" }}>

      <TechBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">

        {/* Top XP bar glow */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* ── HERO ── */}
        <motion.header
          className="w-full"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 sm:pt-10 sm:pb-6">
            <div className="flex flex-row items-center gap-4 sm:gap-6">

              {/* Photo */}
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
                      background: "conic-gradient(from 0deg, hsl(340,82%,55%), hsl(270,76%,55%), hsl(200,76%,50%), hsl(340,82%,55%))",
                      padding: "2px",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 sm:border-[3px] z-20"
                    style={{
                      background: "hsl(150, 70%, 50%)",
                      borderColor: "hsl(240,10%,3%)",
                      boxShadow: "0 0 8px hsl(150, 70%, 50%, 0.5)",
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
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
                  <Sparkles size={10} className="sm:w-3 sm:h-3" />
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

              {/* Status badge — desktop only */}
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
        <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">

          {/* Section title */}
          <motion.div
            className="flex items-center gap-2 mb-4 sm:mb-6"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-1 h-4 sm:h-5 rounded-full bg-gradient-to-b from-primary to-violet-500" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground/40">
              Ecossistema de Gestão
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            <span className="text-[9px] sm:text-[10px] text-muted-foreground/20 font-medium">
              {apps.length} apps
            </span>
          </motion.div>

          {/* Grid – 2 cols always, expands on larger */}
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
          transition={{ delay: 1 }}
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
