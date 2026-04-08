import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeuralNetworkBg from "@/components/NeuralNetworkBg";
import SplashScreen from "@/components/SplashScreen";
import PullToRefresh from "@/components/PullToRefresh";
import AppWebView from "@/components/AppWebView";
import { useAuth } from "@/contexts/AuthContext";
import logoSarelli from "@/assets/Logo_Sarelli_opt.png";
import { toast } from "@/hooks/use-toast";
import {
  Handshake,
  ReceiptText,
  ClipboardCheck,
  UserRoundPlus,
  Laptop,
  BarChart3,
  Globe,
  ArrowUpRight,
  Building2,
  BrainCircuit,
  LogOut,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";

const PHOTO_URL =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699400706d955b03c8c19827/16e72069d_WhatsAppImage2026-02-17at023641.jpeg";

const apps = [
  {
    id: "rede",
    title: "Rede",
    desc: "Cadastro de lideranças da campanha",
    badge: "Articulação",
    Icon: Handshake,
    gradient: "from-pink-500 to-rose-400",
    accentColor: "hsl(340, 82%, 52%)",
  },
  {
    id: "contas-pagar",
    title: "Contas a Pagar",
    desc: "Lançamento de contas do escritório",
    badge: "Finanças",
    Icon: ReceiptText,
    gradient: "from-violet-500 to-purple-600",
    accentColor: "hsl(270, 70%, 55%)",
  },
  {
    id: "visitas",
    title: "Visitas",
    desc: "Registros de visitas ao escritório",
    badge: "Escritório",
    Icon: ClipboardCheck,
    gradient: "from-rose-400 to-pink-500",
    accentColor: "hsl(350, 70%, 60%)",
  },
  {
    id: "pagamentos",
    title: "Pagamentos",
    desc: "Gestão de pagamentos e cadastros",
    badge: "Financeiro",
    Icon: UserRoundPlus,
    gradient: "from-pink-400 to-fuchsia-600",
    accentColor: "hsl(320, 70%, 55%)",
  },
  {
    id: "computadores",
    title: "Computadores",
    desc: "Gestão e acesso remoto de TI",
    badge: "TI",
    Icon: Laptop,
    gradient: "from-indigo-400 to-blue-600",
    accentColor: "hsl(230, 70%, 55%)",
  },
  {
    id: "dados",
    title: "Dados do Site",
    desc: "Análises e inteligência digital",
    badge: "Analytics",
    Icon: BarChart3,
    gradient: "from-teal-400 to-cyan-600",
    accentColor: "hsl(180, 60%, 45%)",
  },
  {
    id: "sindspag",
    title: "SINDSPAG",
    desc: "Gestão sindical e associados",
    badge: "Sindicato",
    Icon: Building2,
    gradient: "from-amber-400 to-orange-600",
    accentColor: "hsl(30, 80%, 55%)",
  },
  {
    id: "ia-eleicoes",
    title: "IA Eleições",
    desc: "Inteligência artificial eleitoral",
    badge: "IA",
    Icon: BrainCircuit,
    gradient: "from-emerald-400 to-teal-600",
    accentColor: "hsl(160, 60%, 45%)",
  },
  {
    id: "site",
    title: "Site Oficial",
    desc: "Portal institucional da campanha",
    badge: "Presença",
    Icon: Globe,
    gradient: "from-pink-500/80 to-pink-500",
    accentColor: "hsl(340, 82%, 52%)",
  },
] as const;

const APP_URLS: Record<string, string> = {
  rede: "https://rede.deputadasarelli.com.br/",
  "contas-pagar": "https://contas.deputadasarelli.com.br",
  visitas: "https://visitas.deputadasarelli.com.br/",
  pagamentos: "https://pagamentos.deputadasarelli.com.br/",
  computadores: "https://computadores.deputadasarelli.com.br/",
  dados: "https://paineldedados.deputadasarelli.com.br/",
  sindspag: "https://sindspag.deputadasarelli.com.br/",
  "ia-eleicoes": "https://iaeleicoes.deputadasarelli.com.br/",
  site: "https://www.deputadasarelli.com.br",
};

type App = (typeof apps)[number];

/* ─── Recent apps tracking ─── */
function getRecentApps(): string[] {
  try {
    const raw = localStorage.getItem("recent_apps");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function trackAppUsage(appId: string) {
  const recent = getRecentApps().filter((id) => id !== appId);
  recent.unshift(appId);
  localStorage.setItem("recent_apps", JSON.stringify(recent.slice(0, 9)));
}

/* ─── Greeting ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/* ─── Glassmorphic App Tile ─── */
function AppTile({
  app,
  index,
  isRecent,
  onOpen,
}: {
  app: App;
  index: number;
  isRecent?: boolean;
  onOpen: (app: App) => void;
}) {
  return (
    <motion.button
      onClick={() => onOpen(app)}
      aria-label={`Abrir ${app.title}`}
      className="group relative text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.04 * index + 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-border/40 backdrop-blur-xl h-full transition-all duration-500"
        style={{
          background: `linear-gradient(145deg, hsl(340 40% 97% / 0.9), hsl(340 40% 97% / 0.6))`,
        }}
      >
        {/* Accent glow on hover */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl pointer-events-none"
          style={{ background: app.accentColor }}
        />

        {/* Bottom accent line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${app.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
        />

        <div className="relative p-4">
          {/* Icon + Badge row */}
          <div className="flex items-center justify-between mb-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${app.gradient} shadow-lg`}
              style={{ boxShadow: `0 4px 14px ${app.accentColor}40` }}
            >
              <app.Icon size={18} strokeWidth={1.8} className="text-white" />
            </div>

            <div className="flex items-center gap-1">
              {isRecent && (
                <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-primary/50 bg-primary/8 px-1.5 py-0.5 rounded-full">
                  <Clock size={8} />
                </span>
              )}
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-full">
                {app.badge}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-[13px] font-bold text-foreground mb-0.5 flex items-center gap-1">
            {app.title}
            <ArrowUpRight
              size={12}
              className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            />
          </h3>

          <p className="text-[11px] text-muted-foreground/70 leading-snug line-clamp-1">
            {app.desc}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Featured Tile (big card for top recent) ─── */
function FeaturedTile({
  app,
  onOpen,
}: {
  app: App;
  onOpen: (app: App) => void;
}) {
  return (
    <motion.button
      onClick={() => onOpen(app)}
      aria-label={`Abrir ${app.title}`}
      className="group relative text-left w-full focus-visible:outline-none rounded-2xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${app.gradient} p-[1px]`}
      >
        <div
          className="relative rounded-[15px] overflow-hidden px-5 py-4"
          style={{
            background: `linear-gradient(145deg, hsl(340 40% 97% / 0.95), hsl(340 40% 97% / 0.85))`,
          }}
        >
          {/* Subtle glow */}
          <div
            className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: app.accentColor }}
          />

          <div className="relative flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} shadow-xl shrink-0`}
              style={{ boxShadow: `0 8px 24px ${app.accentColor}50` }}
            >
              <app.Icon size={24} strokeWidth={1.6} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60 bg-primary/8 px-2 py-0.5 rounded-full">
                  Último acesso
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                {app.title}
                <ArrowUpRight
                  size={14}
                  className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                />
              </h3>
              <p className="text-xs text-muted-foreground/70 line-clamp-1">
                {app.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Home ─── */
export default function Home() {
  const { user, usuario, loading: authLoading, signIn, signOut } = useAuth();
  const [autoLogging, setAutoLogging] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [openApp, setOpenApp] = useState<App | null>(null);
  const autoLoginAttempted = useRef(false);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authLoading && !autoLogging) setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [authLoading, autoLogging]);

  useEffect(() => {
    if (!authLoading && !autoLogging) {
      const timer = setTimeout(() => setShowSplash(false), 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading, autoLogging]);

  // Auto-login
  useEffect(() => {
    if (autoLoginAttempted.current || authLoading || user) return;
    const savedUser = localStorage.getItem("saved_user");
    const savedPass = localStorage.getItem("saved_pass");
    if (savedUser && savedPass) {
      autoLoginAttempted.current = true;
      setAutoLogging(true);
      signIn(savedUser, savedPass).then(({ error }) => {
        setAutoLogging(false);
        if (error) {
          toast({ title: "Login automático falhou", description: "Faça login novamente", variant: "destructive" });
        }
      });
    }
  }, [authLoading, user, signIn]);

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleSignOut = async () => {
    localStorage.removeItem("saved_user");
    localStorage.removeItem("saved_pass");
    await signOut();
  };

  const handleRefresh = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    window.location.reload();
  }, []);

  const handleOpenApp = useCallback((app: App) => {
    trackAppUsage(app.id);
    setOpenApp(app);
  }, []);

  // Sort apps: most recent first, rest in original order
  const { featuredApp, recentIds, sortedApps } = useMemo(() => {
    const recent = getRecentApps();
    const featured = recent.length > 0 ? apps.find((a) => a.id === recent[0]) : null;
    const recentSet = new Set(recent);

    const sorted = [...apps].sort((a, b) => {
      const aIdx = recent.indexOf(a.id);
      const bIdx = recent.indexOf(b.id);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });

    // Remove featured from sorted
    const remaining = featured ? sorted.filter((a) => a.id !== featured.id) : sorted;

    return {
      featuredApp: featured || null,
      recentIds: recentSet,
      sortedApps: remaining,
    };
  }, [openApp]); // re-sort when app closes

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* App WebView */}
      <AnimatePresence>
        {openApp && (
          <AppWebView
            key={openApp.id}
            url={APP_URLS[openApp.id]}
            title={openApp.title}
            accentColor={openApp.accentColor}
            gradient={openApp.gradient}
            Icon={openApp.Icon}
            onClose={() => setOpenApp(null)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative min-h-[100dvh] w-full overflow-x-hidden select-none">
        <NeuralNetworkBg />

        <PullToRefresh onRefresh={handleRefresh}>
          <div className="relative z-10 flex flex-col min-h-[100dvh]">
            {/* ── AUTH BAR ── */}
            <AnimatePresence>
              {(autoLogging || user) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full backdrop-blur-2xl border-b border-border/30"
                  style={{ background: "hsl(340 40% 97% / 0.7)" }}
                >
                  <div className="max-w-2xl mx-auto px-5 sm:px-6 py-2 flex items-center justify-between">
                    {autoLogging ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 size={14} className="animate-spin text-primary" />
                        <span>Entrando...</span>
                      </div>
                    ) : user && usuario ? (
                      <>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                            <span className="text-xs font-black text-primary-foreground">
                              {usuario.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground leading-tight">{usuario.nome}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{usuario.tipo}</p>
                          </div>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors px-2.5 py-1.5 rounded-xl hover:bg-destructive/8"
                        >
                          <LogOut size={12} />
                          Sair
                        </button>
                      </>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── HERO ── */}
            <motion.header
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-5 pb-1 sm:pt-8 sm:pb-3">
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <img
                    src={logoSarelli}
                    alt="Dra. Fernanda Sarelli"
                    className="w-48 sm:w-64 h-auto object-contain"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <motion.div
                    className="flex items-center gap-3 mt-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30" />
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary/50">
                      Central de Operações
                    </p>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30" />
                  </motion.div>
                  <motion.p
                    className="text-[10px] text-muted-foreground capitalize mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {getGreeting()} — {dateStr}
                  </motion.p>
                </motion.div>
              </div>
            </motion.header>

            {/* ── CONTENT ── */}
            <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-3 sm:py-5 space-y-4">

              {/* Featured / Last accessed */}
              {featuredApp && (
                <section>
                  <FeaturedTile app={featuredApp} onOpen={handleOpenApp} />
                </section>
              )}

              {/* Section label */}
              <motion.div
                className="flex items-center gap-2 px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={12} className="text-primary/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                  {featuredApp ? "Todos os apps" : "Apps"}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-border/40 to-transparent" />
              </motion.div>

              {/* App Grid */}
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:sm:col-span-1"
                role="navigation"
                aria-label="Sistemas do ecossistema"
              >
                {sortedApps.map((app, i) => (
                  <AppTile
                    key={app.id}
                    app={app}
                    index={i}
                    isRecent={recentIds.has(app.id)}
                    onOpen={handleOpenApp}
                  />
                ))}
              </div>

              {/* Bottom spacer */}
              <div className="h-6 safe-bottom" />
            </main>
          </div>
        </PullToRefresh>
      </div>
    </>
  );
}
