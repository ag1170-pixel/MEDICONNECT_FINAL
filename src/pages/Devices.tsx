import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Watch, Shield, Wifi, Battery, Heart, Activity, Thermometer,
  Droplets, Fingerprint, Nfc, Zap, CheckCircle, RefreshCw,
  Cpu, Signal, BatteryCharging
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/GlassCard";
import { MetricCard } from "@/components/MetricCard";
import { AIChat } from "@/components/AIChat";
import { useSimulatedData } from "@/hooks/useSimulatedData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="backdrop-blur-xl bg-gray-900/90 border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function Devices() {
  const { metrics, history, deviceStatus } = useSimulatedData(2000);
  const [activeDevice, setActiveDevice] = useState<"band" | "ring">("band");
  const [fingerprintScan, setFingerprintScan] = useState(false);
  const [nfcTap, setNfcTap] = useState(false);
  const [syncingBand, setSyncingBand] = useState(false);
  const [syncingRing, setSyncingRing] = useState(false);

  const handleFingerprint = () => {
    setFingerprintScan(true);
    setTimeout(() => setFingerprintScan(false), 2500);
  };

  const handleNfc = () => {
    setNfcTap(true);
    setTimeout(() => setNfcTap(false), 2000);
  };

  const handleSync = (device: "band" | "ring") => {
    if (device === "band") {
      setSyncingBand(true);
      setTimeout(() => setSyncingBand(false), 2000);
    } else {
      setSyncingRing(true);
      setTimeout(() => setSyncingRing(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">Connected Devices</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            MediConnect{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Devices</span>
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and manage your health wearables</p>
        </motion.div>

        {/* Device selector */}
        <div className="flex gap-3 mb-6">
          {(["band", "ring"] as const).map(device => (
            <motion.button
              key={device}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveDevice(device)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all",
                activeDevice === device
                  ? device === "band"
                    ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shadow-neon"
                    : "bg-purple-500/20 border-purple-500/30 text-purple-400 shadow-neon-purple"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 border-white/10"
              )}
            >
              {device === "band" ? <Watch className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              MediConnect {device === "band" ? "Band" : "Ring"}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeDevice === "band" && (
            <motion.div key="band" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Band visual */}
                <GlassCard glow="cyan" className="flex flex-col items-center justify-center py-10">
                  <motion.div
                    className="relative mb-6"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* Band illustration */}
                    <div className="w-20 h-36 rounded-3xl bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/30 flex items-center justify-center shadow-neon relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
                      <div className="relative z-10 text-center">
                        <Watch className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                        <motion.div className="text-xs font-bold text-cyan-400" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          {metrics.heartRate} BPM
                        </motion.div>
                      </div>
                      {/* Scan line */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        animate={{ top: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    {/* Pulse rings */}
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-3xl border border-cyan-400/30"
                        animate={{ scale: [1, 1.3 + i * 0.1], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      />
                    ))}
                  </motion.div>

                  <h2 className="text-lg font-bold text-white mb-1">MediConnect Band</h2>
                  <p className="text-xs text-muted-foreground mb-4">Health Monitoring Band</p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      <span className="text-xs text-green-400 font-medium">Connected</span>
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><Battery className="h-3 w-3" /> Battery</span>
                      <span className="text-white font-medium">{deviceStatus.band.battery}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${deviceStatus.band.battery}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleSync("band")}
                    className="mt-4 w-full py-2 rounded-xl text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <motion.div animate={syncingBand ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: syncingBand ? Infinity : 0, ease: "linear" }}>
                      <RefreshCw className="h-3.5 w-3.5" />
                    </motion.div>
                    {syncingBand ? "Syncing..." : "Sync Now"}
                  </motion.button>
                </GlassCard>

                {/* Live metrics */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard label="Heart Rate" value={metrics.heartRate} unit="BPM" icon={Heart} color="red" status={metrics.heartRate > 100 ? "critical" : "normal"} />
                    <MetricCard label="SpO2" value={metrics.spo2} unit="%" icon={Droplets} color="blue" status={metrics.spo2 < 94 ? "critical" : "good"} />
                    <MetricCard label="Temperature" value={metrics.temperature} unit="°F" icon={Thermometer} color="amber" />
                    <MetricCard label="Activity" value={metrics.steps.toLocaleString()} icon={Activity} color="green" subtitle="steps" />
                  </div>

                  <GlassCard className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Live Data Stream</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <AreaChart data={history.slice(-25)} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#00bcd4" strokeWidth={2} fill="url(#bandGrad)" dot={false} animationDuration={300} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </GlassCard>
                </div>
              </div>

              {/* Band features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Heart, label: "24/7 HR Monitor", desc: "Continuous heart rate tracking", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                  { icon: Droplets, label: "SpO2 Sensor", desc: "Blood oxygen monitoring", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                  { icon: Signal, label: "ECG", desc: "Electrocardiogram readings", color: "text-green-400 bg-green-500/10 border-green-500/20" },
                  { icon: Zap, label: "Sleep Tracking", desc: "Advanced sleep analysis", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                ].map((feature, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className={cn("p-4 rounded-2xl border backdrop-blur-xl bg-white/3", feature.color.split(" ").slice(1).join(" "))}
                  >
                    <feature.icon className={cn("h-5 w-5 mb-2", feature.color.split(" ")[0])} />
                    <p className="text-sm font-semibold text-white">{feature.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeDevice === "ring" && (
            <motion.div key="ring" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ring visual */}
                <GlassCard glow="purple" className="flex flex-col items-center justify-center py-10">
                  <motion.div
                    className="relative mb-6"
                    animate={{ rotateY: [0, 15, 0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* Ring illustration */}
                    <div className="w-24 h-24 rounded-full border-4 border-purple-500/50 flex items-center justify-center relative shadow-neon-purple">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/30 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-purple-400" />
                      </div>
                      {/* Orbiting dot */}
                      <motion.div
                        className="absolute w-2.5 h-2.5 rounded-full bg-purple-400 shadow-neon-purple"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: "50% 50%", top: -5, left: "50%", marginLeft: -5 }}
                      />
                    </div>
                    {[1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-purple-400/20"
                        animate={{ scale: [1, 1.4 + i * 0.2], opacity: [0.4, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                      />
                    ))}
                  </motion.div>

                  <h2 className="text-lg font-bold text-white mb-1">Smart Ring</h2>
                  <p className="text-xs text-muted-foreground mb-4">Identity & Health Ring</p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      <span className="text-xs text-green-400 font-medium">Connected</span>
                    </div>
                  </div>

                  <div className="w-full space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><Battery className="h-3 w-3" /> Battery</span>
                      <span className="text-white font-medium">{deviceStatus.ring.battery}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${deviceStatus.ring.battery}%` }} transition={{ duration: 1.5, ease: "easeOut" }} />
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleSync("ring")}
                    className="w-full py-2 rounded-xl text-sm font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <motion.div animate={syncingRing ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: syncingRing ? Infinity : 0, ease: "linear" }}>
                      <RefreshCw className="h-3.5 w-3.5" />
                    </motion.div>
                    {syncingRing ? "Syncing..." : "Sync Now"}
                  </motion.button>
                </GlassCard>

                {/* Ring features panel */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Fingerprint */}
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white">Fingerprint Identity</h3>
                        <p className="text-xs text-muted-foreground">Biometric authentication</p>
                      </div>
                      <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-full">Active</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                      onClick={handleFingerprint}
                      className={cn(
                        "w-full py-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3",
                        fingerprintScan
                          ? "bg-purple-500/20 border-purple-400 shadow-neon-purple"
                          : "bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-400"
                      )}
                    >
                      <motion.div animate={fingerprintScan ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.5, repeat: fingerprintScan ? Infinity : 0 }}>
                        <Fingerprint className={cn("h-10 w-10", fingerprintScan ? "text-purple-300" : "text-purple-400")} />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-white">
                          {fingerprintScan ? "Scanning..." : "Tap to Authenticate"}
                        </p>
                        <p className="text-xs text-muted-foreground">Place finger on ring sensor</p>
                      </div>
                      {fingerprintScan && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1 text-xs text-green-400"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Identity verified
                        </motion.div>
                      )}
                    </motion.button>
                  </GlassCard>

                  {/* NFC */}
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white">NFC Actions</h3>
                        <p className="text-xs text-muted-foreground">Contactless health data sharing</p>
                      </div>
                      <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">Enabled</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Share Health Record", desc: "Tap to share with doctor" },
                        { label: "Emergency ID", desc: "Medical ID via NFC" },
                        { label: "Appointment Check-in", desc: "Tap at clinic reception" },
                        { label: "Medication Reminder", desc: "NFC pharmacy integration" },
                      ].map((action, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={handleNfc}
                          className={cn(
                            "p-3 rounded-xl border transition-all text-left",
                            nfcTap ? "bg-blue-500/15 border-blue-400/40" : "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10"
                          )}
                        >
                          <Nfc className="h-4 w-4 text-blue-400 mb-1.5" />
                          <p className="text-xs font-medium text-white">{action.label}</p>
                          <p className="text-xs text-muted-foreground">{action.desc}</p>
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {nfcTap && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                        >
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <p className="text-sm text-green-400">NFC action completed successfully</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </div>
              </div>

              {/* Ring health metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Heart, label: "PPG Sensor", desc: "Photoplethysmography monitoring", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                  { icon: Droplets, label: "SpO2", desc: "Blood oxygen saturation", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                  { icon: Thermometer, label: "Skin Temp", desc: "Continuous skin temperature", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                  { icon: Activity, label: "HRV", desc: "Heart rate variability", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                ].map((feature, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className={cn("p-4 rounded-2xl border backdrop-blur-xl bg-white/3", feature.color.split(" ").slice(1).join(" "))}
                  >
                    <feature.icon className={cn("h-5 w-5 mb-2", feature.color.split(" ")[0])} />
                    <p className="text-sm font-semibold text-white">{feature.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <AIChat />
    </div>
  );
}
