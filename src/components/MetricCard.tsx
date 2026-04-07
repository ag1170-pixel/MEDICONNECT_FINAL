import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "normal" | "warning" | "critical" | "good";
  color?: "cyan" | "purple" | "green" | "red" | "amber" | "blue";
  animated?: boolean;
  subtitle?: string;
}

const colorMap = {
  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "hover:shadow-neon",
    value: "text-cyan-300",
    dot: "bg-cyan-400",
  },
  purple: {
    icon: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "hover:shadow-neon-purple",
    value: "text-purple-300",
    dot: "bg-purple-400",
  },
  green: {
    icon: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    glow: "hover:shadow-neon-green",
    value: "text-green-300",
    dot: "bg-green-400",
  },
  red: {
    icon: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "hover:shadow-neon-red",
    value: "text-red-300",
    dot: "bg-red-400",
  },
  amber: {
    icon: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    value: "text-amber-300",
    dot: "bg-amber-400",
  },
  blue: {
    icon: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]",
    value: "text-blue-300",
    dot: "bg-blue-400",
  },
};

const statusBadge = {
  normal: { text: "Normal", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  good: { text: "Good", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  warning: { text: "Warning", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  critical: { text: "Critical", color: "text-red-400 bg-red-500/10 border-red-500/20" },
};

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  status,
  color = "cyan",
  animated = true,
  subtitle,
}: MetricCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "backdrop-blur-xl bg-white/5 border rounded-2xl p-4 transition-all duration-300 cursor-default",
        colors.border,
        colors.glow
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-xl", colors.bg, "border", colors.border)}>
          <Icon className={cn("h-4 w-4", colors.icon)} />
        </div>
        {status && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", statusBadge[status].color)}>
            {statusBadge[status].text}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-1">
          {animated ? (
            <motion.span
              key={String(value)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("text-2xl font-bold", colors.value)}
            >
              {value}
            </motion.span>
          ) : (
            <span className={cn("text-2xl font-bold", colors.value)}>{value}</span>
          )}
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && trendValue && (
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-xs font-medium",
              trend === "up" ? "text-red-400" : trend === "down" ? "text-green-400" : "text-muted-foreground"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          </div>
        )}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 mt-3">
        <motion.div
          className={cn("w-1.5 h-1.5 rounded-full", colors.dot)}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs text-muted-foreground">Live</span>
      </div>
    </motion.div>
  );
}
