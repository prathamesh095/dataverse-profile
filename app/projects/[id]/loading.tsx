"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingProjectDetails() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-background via-background/80 to-background text-center px-6">
      {/* === Animated Loader Icon === */}
      <motion.div
        className="relative flex flex-col items-center justify-center mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 border-4 border-primary/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border-t-4 border-primary rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </motion.div>

      {/* === Animated Text === */}
      <motion.h2
        className="text-2xl font-semibold text-foreground mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      >
        Loading Project Details
      </motion.h2>
      <motion.p
        className="text-muted-foreground text-sm max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        Please wait a moment while we prepare your project dashboard and content.
      </motion.p>

      {/* === Skeleton Preview Section === */}
      <motion.div
        className="w-full max-w-4xl mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-32 bg-muted/40 rounded-xl border border-border/30 shadow-inner"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
