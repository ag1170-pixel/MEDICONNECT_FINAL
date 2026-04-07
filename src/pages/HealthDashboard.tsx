import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart, Activity, Thermometer, Droplets, Brain, Moon,
  Zap, Shield, Watch, Wifi, Battery, AlertTriangle, TrendingUp
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/GlassCard";
import { MetricCard } from "@/components/MetricCard";
import { AlertsPanel } from "@/components/AlertCard";
import { AIChat } from "@/components/AIChat";
import { useSimulatedData } from "@/hooks/useSimulatedData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import { cn } from "@/lib/utils";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="backdrop-blur-xl bg-gray-900/90 border border-white/10 rounded-xl p-3 shadow-glass">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function HealthDashboard() {
  const { metrics, history, alerts, deviceStatus, resolveAlert, triggerAlert } = useSimulatedData(3000);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [activeChart, setActiveChart] = useState<"heartRate" | "spo2" | "stress">("heartRate");

  const chartConfig = {
    heartRate: { key: "heartRate", name: "Heart Rate", color: "#f87171", unit: "BPM" },
    spo2: { key: "spo2", name: "SpO2", color: "#60a5fa", unit: "%" },
    stress: { key: "stress", name: "Stress Level", color: "#a78bfa", unit: "/10" },
  };

  const activeChartData = chartConfig[activeChart];

  const handleEmergency = () => {
    setEmergencyActive(true);
    triggerAlert("heart_rate");
    setTimeout(() => setEmergencyActive(false), 5000);
  };

  const getHeartStatus = (): "normal" | "warning" | "critical" | "good" => {
    if (metrics.heartRate > 100) return "critical";
    if (metrics.heartRate > 90) return "warning";
    return "normal";
  };

  const getSpo2Status = (): "normal" | "warning" | "critical" | "good" => {
    if (metrics.spo2 < 94) return "critical";
    if (metrics.spo2 < 96) return "warning";
    return "good";
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <motion.div className="w-2 h-2 rounded-full bg-green-400" animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-xs font-medium text-green-400 uppercase tracking-widest">Live Monitoring</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Health <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Dashboard</span></h1>
            <p className="text-muted-foreground mt-1">Real-time vitals from your MediConnect devices</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleEmergency} className={cn("relative px-6 py-3 rounded-2xl font-bold text-white text-sm transition-all duration-300 border-2 flex items-center gap-2", emergencyActive ? "bg-red-500/30 border-red-400 shadow-neon-red animate-pulse" : "bg-red-500/15 border-red-500/50 hover:bg-red-500/25 hover:border-red-400 hover:shadow-neon-red")}>
            <motion.div className="absolute inset-0 rounded-2xl border-2 border-red-500" animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <AlertTriangle className="h-4 w-4" />
            {emergencyActive ? "ALERT SENT" : "EMERGENCY"}
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left column */}
          <div className="xl:col-span-3 space-y-6">
            <motion.div variants={pageVariants} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div variants={cardVariants}><MetricCard label="Heart Rate" value={metrics.heartRate} unit="BPM" icon={Heart} status={getHeartStatus()} color="red" /></motion.div>
              <motion.div variants={cardVariants}><MetricCard label="SpO2" value={metrics.spo2} unit="%" icon={Droplets} status={getSpo2Status()} color="blue" /></motion.div>
              <motion.div variants={cardVariants}><MetricCard label="Temperature" value={metrics.temperature} unit="°F" icon={Thermometer} status={metrics.temperature > 100.4 ? "critical" : metrics.temperature > 99.5 ? "warning" : "normal"} color="amber" /></motion.div>
              <motion.div variants={cardVariants}><MetricCard label="Blood Pressure" value={`${metrics.systolic}/${metrics.diastolic}`} unit="mmHg" icon={Activity} status={metrics.systolic > 140 ? "critical" : metrics.systolic > 130 ? "warning" : "normal"} color="purple" /></motion.div>
              <motion.div variants={cardVariants}><MetricCard label="Stress Level" value={metrics.stress} unit="/10" icon={Brain} status={metrics.stress >= 8 ? "critical" : metrics.stress >= 6 ? "warning" : "good"} color="purple" /></motion.div>
              <motion.div variants={cardVariants}><MetricCard label="Steps Today" value={metrics.steps.toLocaleString()} icon={TrendingUp} status="good" color="green" subtitle="Goal: 10,000" /></motion.div>
              <motion.div variants={cardVariants}><MetricCard label="Calories" value={metrics.calories} unit="kcal" icon={Zap} color="amber" subtitle="Active: 342 kcal" /></motion.div>
              <motion.div variants={cardVariants}><MetricCard label="Sleep" value={metrics.sleepHours} unit="hrs" icon={Moon} status="good" color="cyan" subtitle="Quality: 8/10" /></motion.div>
            </motion.div>

            {/* Live Chart */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Live Vitals Chart</h2>
                  <p className="text-xs text-muted-foreground">Real-time data stream from devices</p>
                </div>
                <div className="flex gap-2">
                  {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(key => (
                    <button key={key} onClick={() => setActiveChart(key)} className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-all border", activeChart === key ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" : "text-muted-foreground hover:text-white hover:bg-white/5 border-transparent")}>
                      {chartConfig[key].name}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={history.slice(-30)} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeChartData.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={activeChartData.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey={activeChartData.key} name={activeChartData.name} stroke={activeChartData.color} strokeWidth={2} fill="url(#colorMetric)" dot={false} activeDot={{ r: 4, fill: activeChartData.color, stroke: "transparent" }} animationDuration={300} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* BP Chart */}
            <GlassCard>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Blood Pressure Trend</h2>
                <p className="text-xs text-muted-foreground">Systolic / Diastolic history</p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={history.slice(-30)} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#a78bfa" strokeWidth={2} dot={false} animationDuration={300} />
                  <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#60a5fa" strokeWidth={2} dot={false} animationDuration={300} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <GlassCard><AlertsPanel alerts={alerts} onResolve={resolveAlert} maxHeight="320px" /></GlassCard>

            {/* Device Status */}
            <GlassCard>
              <h3 className="font-semibold text-white mb-4">Connected Devices</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2"><Watch className="h-4 w-4 text-cyan-400" /><span className="text-sm font-medium text-white">MediConnect Band</span></div>
                    <motion.div className="flex items-center gap-1" animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }}><Wifi className="h-3 w-3 text-green-400" /><span className="text-xs text-green-400">Live</span></motion.div>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Battery className="h-3 w-3 text-muted-foreground" />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${deviceStatus.band.battery}%` }} transition={{ duration: 1 }} /></div>
                    <span className="text-xs text-muted-foreground">{deviceStatus.band.battery}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Synced {deviceStatus.band.lastSync.toLocaleTimeString()}</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-purple-400" /><span className="text-sm font-medium text-white">Smart Ring</span></div>
                    <motion.div className="flex items-center gap-1" animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}><Wifi className="h-3 w-3 text-green-400" /><span className="text-xs text-green-400">Live</span></motion.div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Battery className="h-3 w-3 text-muted-foreground" />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${deviceStatus.ring.battery}%` }} transition={{ duration: 1, delay: 0.2 }} /></div>
                    <span className="text-xs text-muted-foreground">{deviceStatus.ring.battery}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">NFC On</span>
                    <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">Fingerprint ID</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Simulate alerts */}
            <GlassCard>
              <h3 className="font-semibold text-white mb-1 text-sm">Simulate Alert</h3>
              <p className="text-xs text-muted-foreground mb-3">Trigger a demo health alert</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: "heart_rate" as const, label: "Heart Rate", color: "text-red-400 border-red-500/30 hover:bg-red-500/10" },
                  { type: "fever" as const, label: "Fever", color: "text-orange-400 border-orange-500/30 hover:bg-orange-500/10" },
                  { type: "low_spo2" as const, label: "Low SpO2", color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10" },
                  { type: "stress" as const, label: "Stress", color: "text-purple-400 border-purple-500/30 hover:bg-purple-500/10" },
                ].map(({ type, label, color }) => (
                  <motion.button key={type} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => triggerAlert(type)} className={cn("p-2 rounded-xl text-xs font-medium border bg-white/5 transition-colors", color)}>{label}</motion.button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
      <AIChat />
    </div>
  );
}
