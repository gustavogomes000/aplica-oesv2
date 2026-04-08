import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  url: string;
  title: string;
  accentColor: string;
  gradient: string;
  Icon: LucideIcon;
  onClose: () => void;
}

/* ─── Branded Loading Screen ─── */
function AppLoadingScreen({
  title,
  accentColor,
  gradient,
  Icon,
}: {
  title: string;
  accentColor: string;
  gradient: string;
  Icon: LucideIcon;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Pulsing rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: `${accentColor}20` }}
          initial={{ width: 80, height: 80, opacity: 0 }}
          animate={{
            width: [80, 160 + i * 60],
            height: [80, 160 + i * 60],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Icon */}
      <motion.div
        className={`relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${gradient} shadow-2xl mb-6`}
        style={{ boxShadow: `0 12px 40px ${accentColor}50` }}
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Icon size={32} strokeWidth={1.5} className="text-white" />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-lg font-bold text-foreground mb-1">{title}</p>
        <p className="text-xs text-muted-foreground">Carregando aplicativo...</p>
      </motion.div>

      {/* Progress dots */}
      <motion.div
        className="flex gap-2 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accentColor }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function AppWebView({ url, title, accentColor, gradient, Icon, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-background flex flex-col"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-border/40 shrink-0 backdrop-blur-xl"
        style={{ background: "hsl(340 40% 97% / 0.85)" }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-sm font-semibold text-primary px-2.5 py-1.5 rounded-xl hover:bg-secondary active:scale-95 transition-all"
        >
          <ArrowLeft size={16} />
          <span className="text-xs">Central</span>
        </button>

        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <div
            className={`w-5 h-5 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Icon size={11} className="text-white" />
          </div>
          <p className="text-xs font-bold text-foreground truncate">{title}</p>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => { setLoading(true); setIframeKey((k) => k + 1); }}
            className="p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all text-muted-foreground"
          >
            <RefreshCw size={14} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all text-muted-foreground"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Loading progress bar */}
      {loading && (
        <motion.div
          className="h-[2px] shrink-0"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80, ${accentColor})` }}
          initial={{ width: "0%" }}
          animate={{ width: "85%" }}
          transition={{ duration: 10, ease: "easeOut" }}
        />
      )}

      {/* Content area */}
      <div className="relative flex-1">
        {/* Branded loading screen */}
        <AnimatePresence>
          {loading && (
            <AppLoadingScreen
              title={title}
              accentColor={accentColor}
              gradient={gradient}
              Icon={Icon}
            />
          )}
        </AnimatePresence>

        {/* Iframe */}
        <iframe
          key={iframeKey}
          src={url}
          title={title}
          className="w-full h-full border-none bg-background"
          onLoad={() => setLoading(false)}
          allow="geolocation; camera; microphone; clipboard-write; clipboard-read"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
        />
      </div>
    </motion.div>
  );
}
