import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeuralNetworkBg from "@/components/NeuralNetworkBg";
import SplashScreen from "@/components/SplashScreen";
import PullToRefresh from "@/components/PullToRefresh";
import AppWebView from "@/components/AppWebView";
import { useAuth } from "@/contexts/AuthContext";
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
  LogOut,
  Loader2,
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
    gradient: "from-primary to-accent",
    iconBg: "bg-gradient-to-br from-primary to-accent",
    url: "https://rede.deputadasarelli.com.br/",
  },
  {
    id: "contas-pagar",
    title: "Contas a Pagar",
    desc: "Lançamento de contas do escritório",
    badge: "Finanças",
    Icon: ReceiptText,
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    url: "https://contas.deputadasarelli.com.br",
  },
  {
    id: "visitas",
    title: "Visitas",
    desc: "Registros de visitas ao escritório",
    badge: "Escritório",
    Icon: ClipboardCheck,
    gradient: "from-rose-400 to-primary",
    iconBg: "bg-gradient-to-br from-rose-400 to-primary",
    url: "https://visitas.deputadasarelli.com.br/",
  },
  {
    id: "pagamentos",
    title: "Pagamentos",
    desc: "Gestão de pagamentos e cadastros",
    badge: "Financeiro",
    Icon: UserRoundPlus,
    gradient: "from-pink-400 to-fuchsia-600",
    iconBg: "bg-gradient-to-br from-pink-400 to-fuchsia-600",
    url: "https://pagamentos.deputadasarelli.com.br/",
  },
  {
    id: "computadores",
    title: "Computadores",
    desc: "Gestão e acesso remoto de TI",
    badge: "TI",
    Icon: Laptop,
    gradient: "from-indigo-400 to-blue-600",
    iconBg: "bg-gradient-to-br from-indigo-400 to-blue-600",
    url: "https://computadores.deputadasarelli.com.br/",
  },
  {
    id: "dados",
    title: "Dados do Site",
    desc: "Análises e inteligência digital",
    badge: "Analytics",
    Icon: BarChart3,
    gradient: "from-teal-400 to-cyan-600",
    iconBg: "bg-gradient-to-br from-teal-400 to-cyan-600",
    url: "https://paineldedados.deputadasarelli.com.br/",
  },
  {
    id: "sindspag",
    title: "SINDSPAG",
    desc: "Gestão sindical e associados",
    badge: "Sindicato",
    Icon: Building2,
    gradient: "from-amber-400 to-orange-600",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-600",
    url: "https://sindspag.deputadasarelli.com.br/",
  },
  {
    id: "site",
    title: "Site Oficial",
    desc: "Portal institucional da campanha",
    badge: "Presença",
    Icon: Globe,
    gradient: "from-primary/80 to-primary",
    iconBg: "bg-gradient-to-br from-primary/80 to-primary",
    url: "https://www.deputadasarelli.com.br",
  },
] as const;

type App = (typeof apps)[number];

/* ─── Card ─── */
function AppCard({ app, index, onOpen }: { app: App; index: number; onOpen: (app: App) => void }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen(app);
  };

  return (
    <motion.a
      href={app.url}
      onClick={handleClick}
      aria-label={`Abrir ${app.title} — ${app.desc}`}
      className="group relative block cursor-pointer min-h-[72px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: 0.03 * index + 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/15 group-hover:border-primary/30">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none bg-gradient-to-br from-secondary/40 via-transparent to-secondary/20" />

        <div className="relative p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${app.iconBg} shadow-md`}
            >
              <app.Icon size={20} strokeWidth={1.8} className="text-primary-foreground" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-primary/70 bg-secondary border border-border px-2 py-0.5 rounded-full">
              {app.badge}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-card-foreground mb-1 flex items-center gap-1.5">
            {app.title}
            <ArrowUpRight
              size={14}
              className="text-primary/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {app.desc}
          </p>
        </div>

        <div
          className={`h-[3px] w-full bg-gradient-to-r ${app.gradient} transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100`}
        />
      </div>
    </motion.a>
  );
}

/* ─── Greeting ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/* ─── Home ─── */
export default function Home() {
  const { user, usuario, loading: authLoading, signIn, signOut } = useAuth();
  const [autoLogging, setAutoLogging] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [openApp, setOpenApp] = useState<App | null>(null);
  const autoLoginAttempted = useRef(false);

  // Splash screen timer — minimum 1.5s then wait for auth
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authLoading && !autoLogging) {
        setShowSplash(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [authLoading, autoLogging]);

  // Also dismiss splash when auth finishes after the minimum time
  useEffect(() => {
    if (!authLoading && !autoLogging) {
      const timer = setTimeout(() => setShowSplash(false), 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading, autoLogging]);

  // Auto-login if saved credentials exist
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
    setOpenApp(app);
  }, []);

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* App WebView */}
      <AnimatePresence>
        {openApp && (
          <AppWebView
            key={openApp.id}
            url={openApp.url}
            title={openApp.title}
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
                  className="w-full bg-card/80 backdrop-blur-xl border-b border-border/50"
                >
                  <div className="max-w-2xl mx-auto px-5 sm:px-6 py-2.5 flex items-center justify-between">
                    {autoLogging ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Entrando automaticamente...</span>
                      </div>
                    ) : user && usuario ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-[11px] font-bold text-primary-foreground">
                              {usuario.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground leading-tight">{usuario.nome}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{usuario.tipo}</p>
                          </div>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-destructive transition-colors px-2.5 py-1.5 rounded-lg hover:bg-destructive/10"
                        >
                          <LogOut size={13} />
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-8 pb-4 sm:pt-12 sm:pb-6">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="relative mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "conic-gradient(from 0deg, hsl(340,82%,55%), hsl(350,70%,70%), hsl(330,60%,65%), hsl(340,82%,55%))",
                          padding: "3px",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-full h-full rounded-full bg-background" />
                      </motion.div>
                      <div className="absolute inset-[5px] rounded-full overflow-hidden shadow-lg">
                        <img
                          src={PHOTO_URL}
                          alt="Dra. Fernanda Sarelli"
                          className="w-full h-full object-cover"
                          width={112}
                          height={112}
                          loading="eager"
                          fetchPriority="high"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                  >
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-1">
                      Doutora Fernanda
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                      SARELLI
                    </h1>
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-primary/50 mt-0.5">
                      Chama a Doutora
                    </p>
                  </motion.div>

                  <motion.div
                    className="w-48 sm:w-64 mt-4 mb-3"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  </motion.div>

                  <motion.p
                    className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-primary/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Central de Operações
                  </motion.p>

                  <motion.p
                    className="text-xs sm:text-sm text-muted-foreground capitalize mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                  >
                    {getGreeting()} — {dateStr}
                  </motion.p>
                </div>
              </div>
            </motion.header>

            {/* ── APPS GRID ── */}
            <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:sm:col-span-1"
                role="navigation"
                aria-label="Sistemas do ecossistema"
              >
                {apps.map((app, i) => (
                  <AppCard key={app.id} app={app} index={i} onOpen={handleOpenApp} />
                ))}
              </div>
            </main>
          </div>
        </PullToRefresh>
      </div>
    </>
  );
}
