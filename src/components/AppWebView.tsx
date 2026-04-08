import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, RefreshCw, X } from "lucide-react";
import { useState } from "react";

interface Props {
  url: string;
  title: string;
  onClose: () => void;
}

export default function AppWebView({ url, title, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] bg-background flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border safe-top shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-medium text-primary px-2 py-1.5 rounded-lg hover:bg-secondary active:scale-95 transition-all"
          >
            <ArrowLeft size={18} />
            <span className="text-xs">Central</span>
          </button>

          <div className="flex-1 text-center">
            <p className="text-xs font-bold text-foreground truncate">{title}</p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[200px] mx-auto">{url}</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => { setLoading(true); setIframeKey(k => k + 1); }}
              className="p-1.5 rounded-lg hover:bg-secondary active:scale-95 transition-all text-muted-foreground"
            >
              <RefreshCw size={15} />
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-secondary active:scale-95 transition-all text-muted-foreground"
            >
              <ExternalLink size={15} />
            </a>
          </div>
        </div>

        {/* Loading bar */}
        {loading && (
          <motion.div
            className="h-[3px] bg-gradient-to-r from-primary via-accent to-primary shrink-0"
            initial={{ width: "0%" }}
            animate={{ width: "90%" }}
            transition={{ duration: 8, ease: "easeOut" }}
          />
        )}

        {/* Iframe */}
        <iframe
          key={iframeKey}
          src={url}
          title={title}
          className="flex-1 w-full border-none bg-background"
          onLoad={() => setLoading(false)}
          allow="geolocation; camera; microphone; clipboard-write; clipboard-read"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
        />
      </motion.div>
    </AnimatePresence>
  );
}
