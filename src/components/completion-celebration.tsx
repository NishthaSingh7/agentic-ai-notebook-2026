"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface CelebrationState {
  quote: string;
  moduleTitle: string;
}

interface CompletionCelebrationProps {
  celebration: CelebrationState | null;
  onDismiss: () => void;
}

const DISPLAY_MS = 5500;

export function CompletionCelebration({ celebration, onDismiss }: CompletionCelebrationProps) {
  useEffect(() => {
    if (!celebration) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(onDismiss, DISPLAY_MS);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [celebration, onDismiss]);

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          key={celebration.quote}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onDismiss}
          role="dialog"
          aria-live="polite"
          aria-label="Module completed"
        >
          {/* Rising light wash */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-accent/50 via-royal/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-background/60 to-background/95" />
          </motion.div>

          {/* Soft glow core */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="absolute left-1/2 top-1/2 h-[min(80vh,600px)] w-[min(90vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[min(50vh,400px)] w-[min(70vw,500px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/10 blur-2xl" />
          </motion.div>

          {/* Quote */}
          <motion.div
            className="relative z-10 mx-auto max-w-xl px-6 text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ delay: 0.55, duration: 0.65, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Module complete
            </div>
            <p className="text-xs font-medium text-text-muted mb-2">{celebration.moduleTitle}</p>
            <blockquote className="text-xl sm:text-2xl font-semibold leading-snug text-text-primary">
              &ldquo;{celebration.quote}&rdquo;
            </blockquote>
            <p className="mt-6 text-xs text-text-muted">Tap anywhere to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
