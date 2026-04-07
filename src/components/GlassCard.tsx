import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "purple" | "red" | "green" | "none";
  noPadding?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = "none",
  noPadding = false,
  ...props
}: GlassCardProps) {
  const glowMap = {
    cyan: "shadow-neon hover:shadow-neon",
    purple: "shadow-neon-purple hover:shadow-neon-purple",
    red: "shadow-neon-red",
    green: "shadow-neon-green hover:shadow-neon-green",
    none: "",
  };

  return (
    <motion.div
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-glass",
        !noPadding && "p-6",
        hover && "transition-all duration-300 hover:bg-white/8 hover:border-white/20",
        glowMap[glow],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GlassCardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function GlassCardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-semibold text-white", className)}>
      {children}
    </h3>
  );
}
