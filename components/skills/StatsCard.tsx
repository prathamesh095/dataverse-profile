// components/skills/StatsCard.tsx
"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  premium?: boolean;
};

export const StatsCard = memo(function StatsCard({ label, value, icon: Icon, premium = false }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 320, damping: 26 }} className="group relative">
      <Card className="relative overflow-hidden glassmorphism rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl border border-border/40">
        <div className="relative flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">{label}</p>
            <motion.p className={cn("text-4xl font-bold tracking-tight text-foreground", premium && "bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary")} whileHover={{ scale: 1.06 }} transition={{ duration: 0.25 }}>
              {value}
            </motion.p>
          </div>

          <motion.div className="relative p-4 rounded-full bg-surface-level-1/70 backdrop-blur-md shadow-2xl shadow-black/20 ring-2 ring-primary/40 dark:ring-primary/30 group-hover:ring-secondary/60 transition duration-300" whileHover={{ scale: 1.12, rotate: 12 }}>
            <Icon className="w-7 h-7 text-primary relative z-10" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
});
StatsCard.displayName = "StatsCard";
