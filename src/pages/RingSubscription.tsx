import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, CheckCircle, Zap, Star, Crown, Fingerprint, Nfc,
  Heart, Activity, Brain, Moon, Battery, Wifi, Lock,
  ArrowRight, Sparkles
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { AIChat } from "@/components/AIChat";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "basic",
    name: "Basic Ring",
    price: 9.99,
    period: "month",
    icon: Shield,
    color: "cyan",
    gradient: "from-cyan-500 to-blue-600",
    glow: "shadow-neon",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    popular: false,
    features: [
      { label: "Heart Rate Monitoring", included: true },
      { label: "SpO2 Tracking", included: true },
      { label: "Sleep Tracking", included: true },
      { label: "Activity Tracking", included: true },
      { label: "Fingerprint ID", included: false },
      { label: "NFC Actions", included: false },
      { label: "ECG Analysis", included: false },
      { label: "HRV Monitoring", included: false },
      { label: "AI Health Insights", included: false },
      { label: "Doctor Alert Integration", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium Ring",
    price: 24.99,
    period: "month",
    icon: Crown,
    color: "purple",
    gradient: "from-purple-500 to-pink-600",
    glow: "shadow-neon-purple",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    popular: true,
    features: [
      { label: "Heart Rate Monitoring", included: true },
      { label: "SpO2 Tracking", included: true },
      { label: "Sleep Tracking", included: true },
      { label: "Activity Tracking", included: true },
      { label: "Fingerprint ID", included: true },
      { label: "NFC Actions", included: true },
      { label: "ECG Analysis", included: true },
      { label: "HRV Monitoring", included: true },
      { label: "AI Health Insights", included: true },
      { label: "Doctor Alert Integration", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49.99,
    period: "month",
    icon: Sparkles,
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    popular: false,
    features: [
      { label: "Everything in Premium", included: true },
      { label: "Multi-device Management", included: true },
      { label: "Custom Alert Rules", included: true },
      { label: "White-label Reports", included: true },
      { label: "Priority Support", included: true },
      { label: "API Access", included: true },
      { label: "Clinical Dashboard", included: true },
      { label: "Team Management", included: true },
      { label: "Compliance Reports", included: true },
      { label: "Dedicated Account Manager", included: true },
    ],
  },
];

const ringFeatures = [
  { icon: Fingerprint, label: "Biometric Identity", desc: "Your fingerprint becomes your medical ID", color: "text-purple-400" },
  { icon: Nfc, label: "NFC Integration", desc: "Tap to share health data instantly", color: "text-blue-400" },
  { icon: Heart, label: "24/7 Heart Rate", desc: "Continuous photoplethysmography sensor", color: "text-red-400" },
  { icon: Brain, label: "Stress Detection", desc: "HRV-based stress and recovery analysis", color: "text-cyan-400" },
  { icon: Moon, label: "Sleep Analysis", desc: "Advanced sleep stage detection", color: "text-indigo-400" },
  { icon: Lock, label: "Data Encryption", desc: "Military-grade health data protection", color: "text-green-400" },
];

export default function RingSubscription() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const getPrice = (basePrice: number) =>
    billingCycle === "annual" ? (basePrice * 0.8).toFixed(2) : basePrice.toFixed(2);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 shadow-neon-purple"
          >
            <Shield className="h-8 w-8 text-purple-400" />
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-4">
            MediConnect{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Smart Ring
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your health, identity, and care in one elegant ring. Choose a plan that fits your lifestyle.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
            {(["monthly", "annual"] as const).map(cycle => (
              <motion.button
                key={cycle}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setBillingCycle(cycle)}
                className={cn(
                  "px-5 py-2 rounded-xl text-sm font-medium transition-all",
                  billingCycle === cycle
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                {cycle === "annual" && (
                  <span className="ml-2 text-xs text-green-400 font-semibold">-20%</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: plan.popular ? 1.02 : 1.01, y: -4 }}
                className={cn(
                  "relative backdrop-blur-xl bg-white/5 border rounded-3xl overflow-hidden transition-all duration-300",
                  plan.popular ? `${plan.border} ${plan.glow}` : "border-white/10 hover:border-white/20"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                )}

                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300"
                    >
                      <Star className="h-3 w-3 fill-current" />
                      Most Popular
                    </motion.div>
                  </div>
                )}

                <div className="p-6">
                  {/* Plan icon & name */}
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br", plan.gradient, "bg-opacity-20 shadow-lg")}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold text-white">${getPrice(plan.price)}</span>
                    <span className="text-muted-foreground text-sm">/{billingCycle === "annual" ? "mo, billed annually" : "month"}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + j * 0.03 }}
                        className="flex items-center gap-2.5"
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                          feature.included ? "bg-green-500/20" : "bg-white/5"
                        )}>
                          {feature.included
                            ? <CheckCircle className="h-3 w-3 text-green-400" />
                            : <div className="w-1.5 h-0.5 rounded-full bg-muted-foreground/30" />
                          }
                        </div>
                        <span className={cn("text-sm", feature.included ? "text-white" : "text-muted-foreground/50")}>
                          {feature.label}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing && selectedPlan === plan.id}
                    className={cn(
                      "w-full py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                      plan.popular
                        ? `bg-gradient-to-r ${plan.gradient} text-white ${plan.glow} hover:opacity-90`
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        Get {plan.name}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Every Ring Includes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ringFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-5 backdrop-blur-xl bg-white/4 border border-white/8 rounded-2xl hover:bg-white/7 hover:border-white/15 transition-all"
              >
                <feature.icon className={cn("h-6 w-6 mb-3", feature.color)} />
                <h3 className="text-sm font-semibold text-white mb-1">{feature.label}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Success modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-2xl bg-gray-950/90 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-glass-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                className="w-16 h-16 rounded-3xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">Subscription Activated!</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your {plans.find(p => p.id === selectedPlan)?.name} has been activated. Your Smart Ring will be shipped within 2-3 business days.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowSuccess(false)}
                className="w-full py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-all"
              >
                Continue to Dashboard
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIChat />
    </div>
  );
}
