import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import NeuralNetworkBg from "@/components/NeuralNetworkBg";
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
    url: "https://contas.deputadasarelli.com.br",
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
    url: "https://suplentes.deputadasarelli.com.br",
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

      <NeuralNetworkBg />

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:sm:col-span-1">
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
