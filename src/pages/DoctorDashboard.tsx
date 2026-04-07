import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Activity, Thermometer, Droplets, Brain,
  Search, User, FileText, CheckCircle, ChevronRight,
  Stethoscope, Clock, TrendingUp, AlertTriangle, Plus, Send
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/GlassCard";
import { MetricCard } from "@/components/MetricCard";
import { AlertsPanel, Alert } from "@/components/AlertCard";
import { AIChat } from "@/components/AIChat";
import { useSimulatedData } from "@/hooks/useSimulatedData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: "stable" | "warning" | "critical";
  lastVisit: string;
  avatar: string;
}

const MOCK_PATIENTS: Patient[] = [
  { id: "1", name: "Sarah Johnson", age: 34, condition: "Hypertension", status: "warning", lastVisit: "2 hrs ago", avatar: "SJ" },
  { id: "2", name: "Michael Chen", age: 52, condition: "Type 2 Diabetes", status: "stable", lastVisit: "Yesterday", avatar: "MC" },
  { id: "3", name: "Emma Williams", age: 28, condition: "Asthma", status: "critical", lastVisit: "30 min ago", avatar: "EW" },
  { id: "4", name: "Robert Davis", age: 61, condition: "Heart Disease", status: "warning", lastVisit: "3 hrs ago", avatar: "RD" },
  { id: "5", name: "Lisa Anderson", age: 45, condition: "Migraine", status: "stable", lastVisit: "2 days ago", avatar: "LA" },
  { id: "6", name: "James Wilson", age: 38, condition: "Anxiety Disorder", status: "stable", lastVisit: "1 week ago", avatar: "JW" },
];

const statusColors = {
  stable: "text-green-400 bg-green-500/10 border-green-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  critical: "text-red-400 bg-red-500/10 border-red-500/20",
};

const statusDot = {
  stable: "bg-green-400",
  warning: "bg-amber-400",
  critical: "bg-red-400",
};

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

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(MOCK_PATIENTS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteText, setNoteText] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState<Array<{ id: string; patient: string; content: string; diagnosis: string; prescription: string; time: string }>>([]);
  const [activeTab, setActiveTab] = useState<"metrics" | "notes" | "history">("metrics");

  const { metrics, history, alerts, resolveAlert } = useSimulatedData(3000);

  const filteredPatients = MOCK_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalCount = MOCK_PATIENTS.filter(p => p.status === "critical").length;
  const warningCount = MOCK_PATIENTS.filter(p => p.status === "warning").length;

  const handleSaveNote = () => {
    if (!noteText.trim() && !diagnosis.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      patient: selectedPatient.name,
      content: noteText,
      diagnosis,
      prescription,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setNotes(prev => [newNote, ...prev]);
    setNoteText("");
    setDiagnosis("");
    setPrescription("");
  };

  const handleSendToUser = (patient: Patient) => {
    // Create a summary of patient data to send
    const patientData = {
      patient: {
        name: patient.name,
        age: patient.age,
        condition: patient.condition,
        status: patient.status
      },
      currentMetrics: {
        heartRate: metrics.heartRate,
        spo2: metrics.spo2,
        temperature: metrics.temperature,
        systolic: metrics.systolic,
        diastolic: metrics.diastolic,
        stress: metrics.stress,
        steps: metrics.steps
      },
      recentNotes: notes.filter(n => n.patient === patient.name).slice(0, 3),
      timestamp: new Date().toISOString()
    };

    // In a real app, this would send via email, SMS, or push notification
    // For now, we'll show a success message and log the data
    console.log('Sending patient data to user:', patientData);
    
    // You could integrate with EmailJS, Supabase, or other services here
    // For demonstration, we'll show an alert
    alert(`Health report sent to ${patient.name}! (Check console for data)`);
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">Doctor Panel</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Patient <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Monitor</span></h1>
            <p className="text-muted-foreground mt-1">Real-time patient monitoring and clinical management</p>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-xl font-bold text-red-400">{criticalCount}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-xl font-bold text-amber-400">{warningCount}</p>
              <p className="text-xs text-muted-foreground">Warning</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-xl font-bold text-green-400">{MOCK_PATIENTS.length - criticalCount - warningCount}</p>
              <p className="text-xs text-muted-foreground">Stable</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Patient List */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <GlassCard noPadding className="overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h2 className="font-semibold text-white mb-3">Patients</h2>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-cyan-500/40 transition-colors">
                  <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-xs text-white placeholder-muted-foreground outline-none flex-1"
                  />
                </div>
              </div>
              <div className="overflow-y-auto custom-scroll" style={{ maxHeight: "calc(100vh - 280px)" }}>
                {filteredPatients.map((patient, i) => (
                  <motion.button
                    key={patient.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedPatient(patient)}
                    className={cn(
                      "w-full p-4 text-left border-b border-white/5 transition-all duration-200 flex items-center gap-3",
                      selectedPatient.id === patient.id
                        ? "bg-cyan-500/10 border-l-2 border-l-cyan-500"
                        : "hover:bg-white/5"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0",
                      patient.status === "critical" ? "bg-red-500/20" : patient.status === "warning" ? "bg-amber-500/20" : "bg-cyan-500/20"
                    )}>
                      {patient.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white truncate">{patient.name}</p>
                        <motion.div className={cn("w-2 h-2 rounded-full flex-shrink-0 ml-1", statusDot[patient.status])}
                          animate={patient.status === "critical" ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{patient.condition}</p>
                      <p className="text-xs text-muted-foreground/60">{patient.lastVisit}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* CENTER: Patient Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-6 space-y-4">
            {/* Patient header */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white",
                    selectedPatient.status === "critical" ? "bg-red-500/20 border border-red-500/30" : selectedPatient.status === "warning" ? "bg-amber-500/20 border border-amber-500/30" : "bg-cyan-500/20 border border-cyan-500/30"
                  )}>
                    {selectedPatient.avatar}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedPatient.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Age {selectedPatient.age}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-xs text-muted-foreground">{selectedPatient.condition}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-xs text-muted-foreground">Last seen {selectedPatient.lastVisit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendToUser(selectedPatient)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 hover:border-green-500/50 transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                    <span className="text-sm font-medium">Send to User</span>
                  </motion.button>
                  <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border", statusColors[selectedPatient.status])}>
                    {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex gap-2">
              {(["metrics", "notes", "history"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                  activeTab === tab ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" : "text-muted-foreground hover:text-white hover:bg-white/5 border-transparent"
                )}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "metrics" && (
                <motion.div key="metrics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard label="Heart Rate" value={metrics.heartRate} unit="BPM" icon={Heart} color="red" status={metrics.heartRate > 100 ? "critical" : "normal"} />
                    <MetricCard label="SpO2" value={metrics.spo2} unit="%" icon={Droplets} color="blue" status={metrics.spo2 < 94 ? "critical" : "good"} />
                    <MetricCard label="Temp" value={metrics.temperature} unit="°F" icon={Thermometer} color="amber" status={metrics.temperature > 100.4 ? "critical" : "normal"} />
                    <MetricCard label="BP" value={`${metrics.systolic}/${metrics.diastolic}`} icon={Activity} color="purple" status={metrics.systolic > 140 ? "critical" : "normal"} />
                  </div>
                  <GlassCard className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Heart Rate History</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={history.slice(-20)} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} interval={3} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#f87171" strokeWidth={2} fill="url(#hrGrad)" dot={false} animationDuration={300} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </GlassCard>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard label="Stress" value={metrics.stress} unit="/10" icon={Brain} color="purple" status={metrics.stress >= 8 ? "critical" : "normal"} />
                    <MetricCard label="Steps" value={metrics.steps.toLocaleString()} icon={TrendingUp} color="green" />
                  </div>
                </motion.div>
              )}

              {activeTab === "notes" && (
                <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <GlassCard className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-4">Add Clinical Note</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Diagnosis</label>
                        <input
                          type="text"
                          placeholder="Primary diagnosis..."
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-cyan-500/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Prescription</label>
                        <input
                          type="text"
                          placeholder="Medications & dosage..."
                          value={prescription}
                          onChange={(e) => setPrescription(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-cyan-500/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                        <textarea
                          placeholder="Clinical observations..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-cyan-500/40 transition-colors resize-none"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleSaveNote}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-neon transition-all flex items-center justify-center gap-2"
                      >
                        <FileText className="h-4 w-4" /> Save Note
                      </motion.button>
                    </div>
                  </GlassCard>

                  {notes.filter(n => n.patient === selectedPatient.name).length > 0 && (
                    <div className="space-y-3">
                      {notes.filter(n => n.patient === selectedPatient.name).map(note => (
                        <GlassCard key={note.id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-cyan-400 font-medium">Clinical Note</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{note.time}</span>
                          </div>
                          {note.diagnosis && <p className="text-sm text-white mb-1"><span className="text-muted-foreground">Dx:</span> {note.diagnosis}</p>}
                          {note.prescription && <p className="text-sm text-white mb-1"><span className="text-muted-foreground">Rx:</span> {note.prescription}</p>}
                          {note.content && <p className="text-sm text-muted-foreground">{note.content}</p>}
                        </GlassCard>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <GlassCard className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-4">Patient History</h3>
                    <div className="space-y-3">
                      {[
                        { date: "Apr 5, 2026", type: "Checkup", note: "Routine checkup. BP slightly elevated.", doctor: "Dr. Smith" },
                        { date: "Mar 20, 2026", type: "Emergency", note: "Acute hypertensive episode. Managed in ER.", doctor: "Dr. Patel" },
                        { date: "Mar 1, 2026", type: "Follow-up", note: "Medication adjusted. Monitoring required.", doctor: "Dr. Smith" },
                        { date: "Feb 10, 2026", type: "Diagnosis", note: `Diagnosed with ${selectedPatient.condition}.`, doctor: "Dr. Lee" },
                      ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                          <div className="flex-shrink-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-cyan-400">{item.type}</span>
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            </div>
                            <p className="text-sm text-white">{item.note}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.doctor}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT: Alerts */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 space-y-4">
            <GlassCard>
              <AlertsPanel
                alerts={alerts.map(a => ({ ...a, patientName: selectedPatient.name }))}
                onResolve={resolveAlert}
                title="Live Alerts"
                maxHeight="350px"
              />
            </GlassCard>

            {/* All patients quick view */}
            <GlassCard>
              <h3 className="font-semibold text-white mb-3 text-sm">Patient Status Overview</h3>
              <div className="space-y-2">
                {MOCK_PATIENTS.slice(0, 4).map(p => (
                  <motion.button key={p.id} whileHover={{ x: 2 }} onClick={() => setSelectedPatient(p)} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left">
                    <motion.div className={cn("w-2 h-2 rounded-full flex-shrink-0", statusDot[p.status])}
                      animate={p.status === "critical" ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.condition}</p>
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <AIChat />
    </div>
  );
}
