"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Combine your Button's variants + motion props safely
type AnimatedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  HTMLMotionProps<"button"> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean;
  };

// ✅ Motion-enhanced button — type-safe, performant, and visually consistent
export const AnimatedButton = React.memo(
  React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    (
      { children, className, variant = "default", size = "default", ...props },
      ref
    ) => {
      return (
        <motion.button
          ref={ref}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </motion.button>
      );
    }
  )
);

AnimatedButton.displayName = "AnimatedButton";
