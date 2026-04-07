import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Heart, Thermometer, Droplets, Brain, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertType = "heart_rate" | "fever" | "low_spo2" | "stress" | "info" | "critical";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: Date;
  resolved?: boolean;
  patientName?: string;
}

const alertConfig = {
  heart_rate: {
    icon: Heart,
    color: "text-red-400",
    bg: "bg-gray-800/90",
    border: "border-gray-600/50",
    glow: "shadow-[0_0_20px_rgba(75,85,99,0.3)]",
    label: "Heart Rate Alert",
  },
  fever: {
    icon: Thermometer,
    color: "text-orange-400",
    bg: "bg-gray-800/90",
    border: "border-gray-600/50",
    glow: "shadow-[0_0_20px_rgba(75,85,99,0.3)]",
    label: "Fever Alert",
  },
  low_spo2: {
    icon: Droplets,
    color: "text-blue-400",
    bg: "bg-gray-800/90",
    border: "border-gray-600/50",
    glow: "shadow-[0_0_20px_rgba(75,85,99,0.3)]",
    label: "Low SpO2",
  },
  stress: {
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-gray-800/90",
    border: "border-gray-600/50",
    glow: "shadow-[0_0_20px_rgba(75,85,99,0.3)]",
    label: "Stress Spike",
  },
  info: {
    icon: AlertTriangle,
    color: "text-cyan-400",
    bg: "bg-gray-800/90",
    border: "border-gray-600/50",
    glow: "shadow-[0_0_20px_rgba(75,85,99,0.3)]",
    label: "Information",
  },
  critical: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-gray-800/90",
    border: "border-gray-600/50",
    glow: "shadow-[0_0_20px_rgba(75,85,99,0.3)]",
    label: "Critical Alert",
  },
};

interface AlertCardProps {
  alert: Alert;
  onResolve?: (id: string) => void;
  compact?: boolean;
}

export function AlertCard({ alert, onResolve, compact = false }: AlertCardProps) {
  const config = alertConfig[alert.type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {!alert.resolved && (
        <motion.div
          layout
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className={cn(
            "backdrop-blur-xl border rounded-2xl relative overflow-hidden",
            config.bg,
            config.border,
            config.glow,
            compact ? "p-3" : "p-4"
          )}
        >
          {/* Pulse animation for critical/active alerts */}
          <div className="absolute inset-0 rounded-2xl">
            <motion.div
              className={cn("absolute inset-0 rounded-2xl border", config.border)}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative flex items-start gap-3">
            {/* Icon with pulse ring */}
            <div className="relative flex-shrink-0">
              <div className={cn("p-2 rounded-xl", config.bg, "border", config.border)}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              {!alert.resolved && (
                <motion.div
                  className={cn("absolute inset-0 rounded-xl border", config.border)}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className={cn("text-xs font-semibold uppercase tracking-wider", config.color)}>
                    {config.label}
                  </span>
                  {alert.patientName && (
                    <span className="text-xs text-muted-foreground ml-2">— {alert.patientName}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className={cn("font-semibold text-white", compact ? "text-sm mt-0.5" : "text-sm mt-1")}>
                {alert.title}
              </p>
              {!compact && (
                <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
              )}
            </div>

            {/* Resolve button */}
            {onResolve && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onResolve(alert.id)}
                className="flex-shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 transition-colors group"
                title="Resolve alert"
              >
                <CheckCircle className="h-4 w-4 text-muted-foreground group-hover:text-green-400 transition-colors" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AlertsPanelProps {
  alerts: Alert[];
  onResolve?: (id: string) => void;
  title?: string;
  maxHeight?: string;
}

export function AlertsPanel({ alerts, onResolve, title = "Live Alerts", maxHeight = "400px" }: AlertsPanelProps) {
  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-400">{title}</h3>
          {activeAlerts.length > 0 && (
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full"
            >
              {activeAlerts.length}
            </motion.span>
          )}
        </div>
        {activeAlerts.length === 0 && (
          <span className="text-xs text-green-400 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            All clear
          </span>
        )}
      </div>

      <div
        className="space-y-2 overflow-y-auto custom-scroll"
        style={{ maxHeight }}
      >
        <AnimatePresence mode="popLayout">
          {activeAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500/50" />
              <p className="text-sm">No active alerts</p>
            </motion.div>
          ) : (
            activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onResolve={onResolve} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
