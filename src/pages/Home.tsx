import { useState, useCallback, useEffect } from "react";
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
  },
  {
    id: "visitas",
    title: "Visitas",
    desc: "Registros de visitas ao escritório",
    badge: "Campo",
    Icon: ClipboardCheck,
    gradient: "from-red-400 to-rose-700",
    glowColor: "hsl(350, 80%, 55%)",
    url: "https://visitas.deputadasarelli.com.br/",
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

/* ─── tech command center background ─────────────────────────────── */
function TechBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient - deeper dark */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(240, 25%, 8%) 0%, hsl(240, 20%, 3%) 100%)",
      }} />

      {/* Primary grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `
          linear-gradient(hsl(200, 80%, 50%) 1px, transparent 1px),
          linear-gradient(90deg, hsl(200, 80%, 50%) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Hex sub-grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(60deg, hsl(340, 82%, 55%) 1px, transparent 1px),
          linear-gradient(-60deg, hsl(340, 82%, 55%) 1px, transparent 1px)
        `,
        backgroundSize: "40px 70px",
      }} />

      {/* Dual scan lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 right-0 h-[2px] opacity-[0.12]"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(340, 82%, 55%), hsl(200, 80%, 50%), transparent)",
            animation: "scanLine 5s linear infinite",
          }}
        />
        <div className="absolute left-0 right-0 h-px opacity-[0.06]"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(200, 80%, 50%), transparent)",
            animation: "scanLine 8s linear infinite 2s",
          }}
        />
      </div>

      {/* Vertical scan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 bottom-0 w-[2px] opacity-[0.06]"
          style={{
            background: "linear-gradient(to bottom, transparent, hsl(340, 82%, 55%), transparent)",
            animation: "scanLineH 7s linear infinite",
          }}
        />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/20 rounded-tl-sm" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/20 rounded-tr-sm" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/20 rounded-bl-sm" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/20 rounded-br-sm" />

      {/* Radar sweep */}
      <div className="absolute top-[18%] right-[6%] w-32 h-32 hidden lg:block">
        <div className="absolute inset-0 rounded-full border border-cyan-500/[0.08]" />
        <div className="absolute inset-3 rounded-full border border-cyan-500/[0.05]" />
        <div className="absolute inset-6 rounded-full border border-cyan-500/[0.03]" />
        <div className="absolute inset-0 rounded-full overflow-hidden"
          style={{ animation: "radarSweep 4s linear infinite" }}>
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left"
            style={{ background: "linear-gradient(90deg, hsl(200, 80%, 50%), transparent)" }} />
        </div>
        {/* Radar blips */}
        <div className="absolute top-[30%] left-[60%] w-1.5 h-1.5 rounded-full bg-primary/40"
          style={{ animation: "blip 3s ease-in-out infinite" }} />
        <div className="absolute top-[55%] left-[35%] w-1 h-1 rounded-full bg-cyan-400/30"
          style={{ animation: "blip 3s ease-in-out infinite 1.5s" }} />
      </div>

      {/* Circuit lines */}
      <svg className="absolute bottom-[10%] left-[5%] w-48 h-32 opacity-[0.06] hidden md:block" viewBox="0 0 200 120">
        <path d="M0,60 H40 L50,30 H90 L100,60 H140 L150,90 H200" fill="none" stroke="hsl(200,80%,50%)" strokeWidth="1.5"
          strokeDasharray="8 4" style={{ animation: "circuitFlow 3s linear infinite" }} />
        <path d="M0,90 H30 L40,60 H80 L90,90 H130 L140,30 H200" fill="none" stroke="hsl(340,82%,55%)" strokeWidth="1"
          strokeDasharray="6 6" style={{ animation: "circuitFlow 4s linear infinite reverse" }} />
        <circle cx="50" cy="30" r="3" fill="hsl(200,80%,50%)" style={{ animation: "blip 2s ease-in-out infinite" }} />
        <circle cx="140" cy="30" r="2" fill="hsl(340,82%,55%)" style={{ animation: "blip 2s ease-in-out infinite 1s" }} />
      </svg>

      {/* Circuit lines - right side */}
      <svg className="absolute top-[40%] right-[3%] w-32 h-48 opacity-[0.05] hidden lg:block" viewBox="0 0 120 200">
        <path d="M60,0 V40 L90,50 V90 L30,100 V140 L60,150 V200" fill="none" stroke="hsl(200,80%,50%)" strokeWidth="1"
          strokeDasharray="6 4" style={{ animation: "circuitFlow 5s linear infinite" }} />
        <circle cx="90" cy="50" r="2.5" fill="hsl(200,80%,50%)" style={{ animation: "blip 3s ease-in-out infinite 0.5s" }} />
      </svg>

      {/* Data stream dots */}
      {[8, 25, 42, 58, 75, 92].map((left, i) => (
        <div key={i} className="absolute top-0 w-px h-full"
          style={{
            left: `${left}%`,
            opacity: 0.02 + (i % 3) * 0.015,
            background: `repeating-linear-gradient(to bottom, transparent, transparent ${18 + i * 4}px, ${i % 2 === 0 ? 'hsl(200,80%,50%)' : 'hsl(340,82%,55%)'} ${18 + i * 4}px, ${i % 2 === 0 ? 'hsl(200,80%,50%)' : 'hsl(340,82%,55%)'} ${20 + i * 4}px)`,
            animation: `dataStream ${3 + i * 0.8}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }}
        />
      ))}

      {/* Radial glows */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, hsl(340, 82%, 55%), transparent 65%)" }}
      />
      <div className="absolute top-[55%] left-[15%] w-[350px] h-[350px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, hsl(200, 80%, 50%), transparent 70%)" }}
      />
      <div className="absolute top-[30%] right-[10%] w-[250px] h-[250px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, hsl(270, 76%, 53%), transparent 70%)" }}
      />

      {/* HUD circles */}
      <div className="absolute bottom-[15%] left-[8%] w-20 h-20 rounded-full border border-primary/[0.08] hidden lg:block"
        style={{ animation: "hudPulse 4s ease-in-out infinite" }}>
        <div className="absolute inset-2 rounded-full border border-primary/[0.05]"
          style={{ animation: "hudPulse 4s ease-in-out infinite 0.5s" }} />
      </div>

      {/* Floating status indicators */}
      <div className="absolute top-[12%] left-[12%] hidden lg:flex items-center gap-1.5 opacity-[0.15]"
        style={{ animation: "hudPulse 5s ease-in-out infinite 2s" }}>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[9px] font-mono text-emerald-400/80 tracking-widest">SYS.ONLINE</span>
      </div>
      <div className="absolute bottom-[20%] right-[12%] hidden lg:flex items-center gap-1.5 opacity-[0.12]"
        style={{ animation: "hudPulse 5s ease-in-out infinite 3s" }}>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span className="text-[9px] font-mono text-cyan-400/80 tracking-widest">NET.SECURE</span>
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />
    </div>
  );
}

/* ─── app card ───────────────────────────────────────────────────── */
function AppCard({ app, index }: { app: App; index: number }) {
  const [hovered, setHovered] = useState(false);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  return (
    <motion.a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index + 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] transition-transform duration-200 hover:scale-[1.02]"
        style={{ background: "linear-gradient(145deg, hsl(240 10% 8% / 0.8), hsl(240 10% 6% / 0.95))" }}
      >
        {/* Gradient top bar */}
        <div className={`h-[3px] w-full bg-gradient-to-r ${app.gradient}`} />

        {/* Hover glow effect */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: `radial-gradient(300px circle at 50% 50%, ${app.glowColor}15, transparent 60%)` }}
        />

        <div className="p-5 sm:p-6">
          {/* Icon + badge row */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} shadow-lg transition-transform duration-200 ${hovered ? "scale-110 -rotate-3" : ""}`}
              style={{ boxShadow: `0 4px 15px ${app.glowColor}20` }}
            >
              <app.Icon size={22} strokeWidth={1.8} className="text-white" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
              {app.badge}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-bold text-foreground/90 mb-1 flex items-center gap-2">
            {app.title}
            <ArrowUpRight size={14} className={`text-primary/60 transition-all duration-200 ${hovered ? "translate-x-0.5 -translate-y-0.5 opacity-100" : "opacity-30"}`} />
          </h3>

          {/* Description */}
          <p className="text-[12px] text-muted-foreground/50 leading-relaxed line-clamp-2">
            {app.desc}
          </p>
        </div>

        {/* Bottom shimmer on hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${app.gradient} transition-transform duration-300 origin-left ${hovered ? "scale-x-100" : "scale-x-0"}`}
        />
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden select-none dark"
      style={{ background: "hsl(240, 10%, 5%)" }}>

      <TechBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">

        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* ── HERO ── */}
        <motion.header
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-10 pb-8 sm:pt-14 sm:pb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">

              {/* Photo with animated ring */}
              <motion.div
                className="relative flex-shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                {/* Animated gradient ring */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, hsl(340,82%,55%), hsl(270,76%,55%), hsl(200,76%,50%), hsl(340,82%,55%))",
                      padding: "3px",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full rounded-full" style={{ background: "hsl(240,10%,5%)" }} />
                  </motion.div>
                  {/* Photo */}
                  <div className="absolute inset-[5px] rounded-full overflow-hidden">
                    <img
                      src={PHOTO_URL}
                      alt="Dra. Fernanda Sarelli"
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                      loading="eager"
                    />
                  </div>
                  {/* Online indicator */}
                  <motion.div
                    className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] z-20"
                    style={{
                      background: "hsl(150, 70%, 50%)",
                      borderColor: "hsl(240,10%,5%)",
                      boxShadow: "0 0 12px hsl(150, 70%, 50%, 0.5)",
                    }}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Text content */}
              <motion.div
                className="flex flex-col items-center sm:items-start text-center sm:text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.p
                  className="text-primary/80 text-xs font-bold uppercase tracking-[0.3em] mb-2 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Sparkles size={12} />
                  {getGreeting()}
                </motion.p>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                  <span className="block">Dra. Fernanda</span>
                  <span className="bg-gradient-to-r from-primary via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Sarelli
                  </span>
                </h1>

                <motion.div
                  className="flex items-center gap-3 mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="h-[2px] w-8 rounded-full bg-gradient-to-r from-primary to-transparent" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
                    Central de Operações
                  </p>
                </motion.div>

                <motion.p
                  className="text-xs text-muted-foreground/30 capitalize mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {dateStr}
                </motion.p>
              </motion.div>

              {/* Status badge — desktop */}
              <motion.div
                className="hidden sm:flex sm:ml-auto self-start mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.06] backdrop-blur-md"
                  style={{ background: "hsl(240 10% 8% / 0.6)" }}>
                  <Shield size={12} className="text-primary/50" />
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">
                    Acesso Restrito
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mx-6 sm:mx-10 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </motion.header>

        {/* ── APPS GRID ── */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-8 sm:py-10">

          {/* Section title */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-violet-500" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/40">
              Ecossistema de Gestão
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            <span className="text-[10px] text-muted-foreground/20 font-medium">
              {apps.length} apps
            </span>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {apps.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))}
          </div>
        </main>

        {/* ── FOOTER ── */}
        <motion.footer
          className="max-w-6xl w-full mx-auto px-6 sm:px-10 pb-8 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="h-px mb-6 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-primary/25 font-medium">
              Pré-candidata a Deputada Estadual — GO 2026
            </p>
            <p className="text-[11px] text-muted-foreground/15">
              © {new Date().getFullYear()} Dra. Fernanda Sarelli
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
