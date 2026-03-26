import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Handshake, 
  ReceiptText, 
  ClipboardCheck, 
  UserRoundPlus, 
  Laptop, 
  BarChart3, 
  Globe, 
  ArrowRight
} from "lucide-react";

const PHOTO_URL =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699400706d955b03c8c19827/16e72069d_WhatsAppImage2026-02-17at023641.jpeg";

/* ─── noise SVG inline ───────────────────────────────────────────── */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ─── ícones SVG personalizados (48x48 viewBox) ──────────────────── */


/* ─── dados dos apps ─────────────────────────────────────────────── */
const apps = [
  {
    id: "liderancas",
    title: "Lideranças",
    desc: "Cadastro de lideranças da campanha",
    badge: "Cadastros",
    identity: "Articulação",
    accent: "#FFD2E4",
    Icon: Handshake,
    gradient: "linear-gradient(148deg, #FF1F6B 0%, #7A0B2E 100%)",
    glowColor: "#FF1F6B",
    url: "https://cadastrodeliderancas.drafernandasarelli.com.br",
  },
  {
    id: "financeiro",
    title: "Financeiro",
    desc: "Lançamento de contas do escritório",
    badge: "Finanças",
    identity: "Orçamento",
    accent: "#E9D5FF",
    Icon: ReceiptText,
    gradient: "linear-gradient(148deg, #A855F7 0%, #4C1D95 100%)",
    glowColor: "#A855F7",
    url: "https://financeiro.drafernandasarelli.com.br",
  },
  {
    id: "visitas",
    title: "Visitas",
    desc: "Registros de visitas ao escritório",
    badge: "Campo",
    identity: "Território",
    accent: "#FFE4E6",
    Icon: ClipboardCheck,
    gradient: "linear-gradient(148deg, #F43F5E 0%, #881337 100%)",
    glowColor: "#F43F5E",
    url: "https://visitas.drafernandasarelli.com.br",
  },
  {
    id: "suplentes",
    title: "Suplentes",
    desc: "Cadastro de suplentes e apoiadores",
    badge: "Equipe",
    identity: "Apoio",
    accent: "#FBCFE8",
    Icon: UserRoundPlus,
    gradient: "linear-gradient(148deg, #EC4899 0%, #831843 100%)",
    glowColor: "#EC4899",
    url: "https://suplentes.drafernandasarelli.com.br",
  },
  {
    id: "computadores",
    title: "Computadores",
    desc: "Gestão e acesso remoto de TI",
    badge: "TI",
    identity: "Infraestrutura",
    accent: "#C7D2FE",
    Icon: Laptop,
    gradient: "linear-gradient(148deg, #6366F1 0%, #312E81 100%)",
    glowColor: "#6366F1",
    url: "https://computadores.drafernandasarelli.com.br",
  },
  {
    id: "dados",
    title: "Dados do Site",
    desc: "Análises e inteligência digital",
    badge: "Analytics",
    identity: "Inteligência",
    accent: "#CFFAFE",
    Icon: BarChart3,
    gradient: "linear-gradient(148deg, #06B6D4 0%, #0C4A6E 100%)",
    glowColor: "#06B6D4",
    url: "https://painel.drafernandasarelli.com.br",
  },
  {
    id: "site",
    title: "Site Oficial",
    desc: "Portal institucional da campanha",
    badge: "Institucional",
    identity: "Presença Digital",
    accent: "#FBCFE8",
    Icon: Globe,
    gradient: "linear-gradient(148deg, #F472B6 0%, #9D174D 100%)",
    glowColor: "#F472B6",
    url: "https://www.drafernandasarelli.com.br",
  },
] as const;

type App = (typeof apps)[number];

/* ─── aurora blob ────────────────────────────────────────────────── */
function AuroraBlob({
  color, size, x, y, delay,
}: { color: string; size: number; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: "blur(110px)", opacity: 0.22 }}
      animate={{ x: [0, 40, -20, 15, 0], y: [0, -30, 20, -15, 0], scale: [1, 1.1, 0.93, 1.07, 1] }}
      transition={{ duration: 24 + delay * 4, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── card de app — Netflix × Play Store ─────────────────────────── */
function AppCard({ app, index }: { app: App; index: number }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => {
    window.open(app.url, "_blank", "noopener,noreferrer");
  }, [app.url]);

  return (
    <motion.article
      className="relative overflow-hidden rounded-[18px] cursor-pointer"
      style={{
        background: app.gradient,
        aspectRatio: "1.62 / 1",
        boxShadow: hovered
          ? `0 24px 64px ${app.glowColor}55, 0 0 0 1.5px rgba(255,255,255,0.2) inset`
          : `0 8px 32px ${app.glowColor}28, 0 0 0 1px rgba(255,255,255,0.1) inset`,
        transition: "box-shadow 0.3s ease",
      }}
      initial={{ opacity: 0, y: 36, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 24, delay: 0.07 * index }}
      whileHover={{ y: -8, scale: 1.035 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* noise texture */}
      <div
        className="absolute inset-0 opacity-[0.055] pointer-events-none"
        style={{ backgroundImage: NOISE, backgroundSize: "160px 160px" }}
      />

      {/* top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)" }}
      />

      {/* reforço de identidade por módulo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(90% 55% at 85% 10%, ${app.accent}22 0%, transparent 58%)`,
        }}
      />

      {/* branding pattern background */}
      {hovered && (
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '16px 16px'
          }}
        />
      )}

      {/* badge categoria — canto superior esquerdo */}
      <div className="absolute top-3 left-3">
        <span
          className="text-[8.5px] font-black uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {app.badge}
        </span>
      </div>

      {/* ícone — centralizado */}
      <div className="flex items-center justify-center h-full pt-1.5">
        <motion.div
          animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="rounded-xl p-2"
          style={{
            filter: "drop-shadow(0 0 15px rgba(0,0,0,0.2))",
            color: "white",
            background: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <app.Icon size={28} strokeWidth={1.7} />
        </motion.div>
      </div>

      {/* info - minimal Netflix style */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3.5 pt-7 pb-3"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <p className="text-white font-extrabold text-[12.5px] leading-tight tracking-[0.01em]">{app.title}</p>
          <ArrowRight size={12} className={`text-white/40 transition-transform ${hovered ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
        </div>
        <p className="text-white/78 text-[9.5px] leading-snug mt-1 font-medium line-clamp-2">{app.desc}</p>
      </div>
    </motion.article>
  );
}

/* ─── componente principal ───────────────────────────────────────── */
export default function Home() {
  const dateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden select-none"
      style={{ background: "hsl(240,12%,5%)" }}
    >
      {/* ── aurora de fundo ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AuroraBlob color="#FF1F6B" size={580} x="-12%" y="-14%" delay={0} />
        <AuroraBlob color="#7C3AED" size={460} x="58%" y="18%" delay={4} />
        <AuroraBlob color="#9D174D" size={420} x="8%" y="52%" delay={7} />
        <AuroraBlob color="#4338CA" size={360} x="72%" y="65%" delay={2} />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: NOISE, backgroundSize: "200px 200px" }}
        />
      </div>

      {/* ── conteúdo ── */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">

        {/* ── HERO HEADER — Netflix style ── */}
        <motion.header
          className="relative w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* barra colorida no topo */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, #FF1F6B, #EC4899, #A855F7, #6366F1, #EC4899)" }}
          />

          <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">

              {/* foto */}
              <motion.div
                className="self-center sm:self-auto relative flex-shrink-0"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.15 }}
              >
                <div
                  className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] rounded-full p-[4px] relative"
                  style={{ background: "linear-gradient(135deg, #FF1F6B, #EC4899, #A855F7, #FF1F6B)" }}
                >
                  {/* outer glow */}
                  <div className="absolute inset-0 rounded-full blur-md opacity-40 bg-pink-500 animate-pulse" />
                  
                  <div
                    className="w-full h-full rounded-full overflow-hidden relative z-10"
                    style={{ background: "hsl(240,12%,5%)" }}
                  >
                    <img
                      src={PHOTO_URL}
                      alt="Dra. Fernanda Sarelli"
                      className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                      loading="eager"
                      width={110}
                      height={110}
                    />
                  </div>
                </div>
                {/* indicador online */}
                <motion.div
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-[3px] z-20"
                  style={{ borderColor: "hsl(240,12%,5%) shadow: 0 0 15px rgba(52, 211, 153, 0.5)" }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* texto */}
              <motion.div
                className="flex flex-col items-center sm:items-start"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.22 }}
              >
                <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none">
                  Dra. Fernanda Sarelli
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="h-[3px] w-6 rounded-full"
                    style={{ background: "linear-gradient(90deg, #FF1F6B, #EC4899)" }}
                  />
                  <p
                    className="text-xs font-bold uppercase tracking-[0.22em]"
                    style={{ color: "hsl(340,82%,65%)" }}
                  >
                    Central de Operações
                  </p>
                </div>
                <p className="text-xs text-white/28 capitalize mt-2">{dateStr}</p>
              </motion.div>

              {/* badge acesso — desktop direita */}
              <motion.div
                className="hidden sm:flex sm:ml-auto self-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Acesso Restrito</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* separador com fade */}
          <div
            className="h-px mx-6 sm:mx-10"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)",
            }}
          />
        </motion.header>

        {/* ── seção de apps ── */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-6 sm:py-8">

          {/* título da seção */}
          <motion.div
            className="flex items-center gap-3 mb-6 sm:mb-8"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 }}
          >
            <div
              className="w-[3px] h-5 rounded-full"
              style={{ background: "linear-gradient(180deg, #FF1F6B, #A855F7)" }}
            />
            <span
              className="text-[11px] font-black uppercase tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Ecossistema de Gestão
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)" }}
            />
          </motion.div>

          {/* grid de cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {apps.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))}
          </div>
        </main>

        {/* ── footer ── */}
        <motion.footer
          className="max-w-6xl w-full mx-auto px-6 sm:px-10 pb-8 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <div
            className="h-px mb-5"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
            }}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5">
            <p className="text-[11px]" style={{ color: "rgba(255,31,107,0.38)" }}>
              Pré-candidata a Deputada Estadual — GO 2026
            </p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.14)" }}>
              © {new Date().getFullYear()} Dra. Fernanda Sarelli
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
