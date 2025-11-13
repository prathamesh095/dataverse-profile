"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, CheckCircle } from "lucide-react";
import { slideInX } from "@/lib/motion";
import { Project } from "@/lib/types";

function FeaturesSection({ project }: { project: Project }) {
  if (!project.features?.length) return null;

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Zap className="w-7 h-7 text-primary" /> Key Features
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {project.features.map((f, i) => (
            <motion.div
              key={i}
              variants={slideInX(-20, i * 0.08)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.25 }}
              className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-primary/10"
            >
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{f}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(FeaturesSection);
