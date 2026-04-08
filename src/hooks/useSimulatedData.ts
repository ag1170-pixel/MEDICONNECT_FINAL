import { useState, useEffect, useCallback, useRef } from "react";
import { Alert, AlertType } from "@/components/AlertCard";
import { RawSensorSample, runEdgeInference, VitalsPacket } from "@/services/edgeInference";

export interface HealthMetrics {
  heartRate: number;
  spo2: number;
  temperature: number;
  systolic: number;
  diastolic: number;
  stress: number;
  steps: number;
  calories: number;
  sleepHours: number;
}

export interface DeviceStatus {
  band: {
    connected: boolean;
    battery: number;
    lastSync: Date;
    charging: boolean;
  };
  ring: {
    connected: boolean;
    battery: number;
    lastSync: Date;
    nfcEnabled: boolean;
    fingerprintLocked: boolean;
  };
}

export interface EdgeInferenceStats {
  windowsProcessed: number;
  packetsTransmitted: number;
  rejectedWindows: number;
  rejectionRate: number;
  lastQuality: "good" | "degraded" | "rejected";
  lastPacket: VitalsPacket | null;
}

const ALERT_TEMPLATES: Array<{
  type: AlertType;
  title: string;
  getMessage: (val: number) => string;
}> = [
  {
    type: "heart_rate",
    title: "High Heart Rate Detected",
    getMessage: (v) => `Heart rate elevated to ${v} BPM. Normal range is 60-100 BPM. Please rest and monitor.`,
  },
  {
    type: "fever",
    title: "Elevated Body Temperature",
    getMessage: (v) => `Body temperature at ${v}°F. Possible fever detected. Stay hydrated.`,
  },
  {
    type: "low_spo2",
    title: "Low Blood Oxygen Level",
    getMessage: (v) => `SpO2 dropped to ${v}%. Normal range is 95-100%. Consult a doctor if persistent.`,
  },
  {
    type: "stress",
    title: "Stress Level Spike",
    getMessage: (v) => `Stress index reached ${v}/10. Consider taking a break and practicing deep breathing.`,
  },
];

type SeededRandom = () => number;

function hashStringToUint32(input: string): number {
  // Simple deterministic hash for stable patient-specific simulation.
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): SeededRandom {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMetrics(prev: HealthMetrics | undefined, rand: SeededRandom): HealthMetrics {
  const vary = (base: number, range: number) =>
    Math.max(0, base + (rand() - 0.5) * range * 2);

  return {
    heartRate: Math.round(vary(prev?.heartRate || 72, 5)),
    spo2: Math.round(Math.max(90, vary(prev?.spo2 || 98, 1.5))),
    temperature: Math.round(vary(prev?.temperature || 98.4, 0.3) * 10) / 10,
    systolic: Math.round(vary(prev?.systolic || 120, 5)),
    diastolic: Math.round(vary(prev?.diastolic || 80, 3)),
    stress: Math.round(Math.min(10, Math.max(1, vary(prev?.stress || 4, 1)))),
    steps: Math.round((prev?.steps || 3200) + rand() * 20),
    calories: Math.round((prev?.calories || 1240) + rand() * 5),
    sleepHours: prev?.sleepHours || 7.5,
  };
}

function checkForAlerts(metrics: HealthMetrics): Omit<Alert, "id" | "timestamp"> | null {
  if (metrics.heartRate > 105) {
    return {
      type: "heart_rate",
      title: ALERT_TEMPLATES[0].title,
      message: ALERT_TEMPLATES[0].getMessage(metrics.heartRate),
    };
  }
  if (metrics.temperature > 100.2) {
    return {
      type: "fever",
      title: ALERT_TEMPLATES[1].title,
      message: ALERT_TEMPLATES[1].getMessage(metrics.temperature),
    };
  }
  if (metrics.spo2 < 94) {
    return {
      type: "low_spo2",
      title: ALERT_TEMPLATES[2].title,
      message: ALERT_TEMPLATES[2].getMessage(metrics.spo2),
    };
  }
  if (metrics.stress >= 9) {
    return {
      type: "stress",
      title: ALERT_TEMPLATES[3].title,
      message: ALERT_TEMPLATES[3].getMessage(metrics.stress),
    };
  }
  return null;
}

function generateRawWindow(prev: HealthMetrics | undefined, rand: SeededRandom, count = 24): RawSensorSample[] {
  const now = Date.now();
  const baseHr = prev?.heartRate || 72;
  const baseTemp = prev?.temperature || 98.4;

  return Array.from({ length: count }, (_, i) => {
    const motionSpike = rand() < 0.12 ? 0.5 + rand() * 0.5 : 0;
    const accel = Math.max(0, rand() * 0.6 + motionSpike);

    return {
      ppg: baseHr + (rand() - 0.5) * 16 - accel * 6,
      accel,
      skinTempF: baseTemp + (rand() - 0.5) * 0.4,
      ts: now - (count - i) * 80,
    };
  });
}

export function useSimulatedData(patientIdOrInterval: string | number | undefined = undefined, intervalMs = 3000) {
  const patientId = typeof patientIdOrInterval === "string" ? patientIdOrInterval : "default";
  const resolvedIntervalMs = typeof patientIdOrInterval === "number" ? patientIdOrInterval : intervalMs;

  const randSeed = hashStringToUint32(patientId);
  const [metrics, setMetrics] = useState<HealthMetrics>(() => generateMetrics(undefined, mulberry32(randSeed)));
  const [history, setHistory] = useState<Array<HealthMetrics & { time: string }>>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [deviceStatus] = useState<DeviceStatus>({
    band: { connected: true, battery: 78, lastSync: new Date(), charging: false },
    ring: { connected: true, battery: 91, lastSync: new Date(), nfcEnabled: true, fingerprintLocked: false },
  });
  const [edgeStats, setEdgeStats] = useState<EdgeInferenceStats>({
    windowsProcessed: 0,
    packetsTransmitted: 0,
    rejectedWindows: 0,
    rejectionRate: 0,
    lastQuality: "good",
    lastPacket: null,
  });
  const metricsRef = useRef(metrics);
  const randRef = useRef<SeededRandom>(mulberry32(randSeed));

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    // Reset seed + initial series when switching patients.
    randRef.current = mulberry32(randSeed);

    const initialMetrics = generateMetrics(undefined, randRef.current);
    metricsRef.current = initialMetrics;
    setMetrics(initialMetrics);

    const demoAlerts: Alert[] = [
      {
        id: `demo-1-${patientId}`,
        type: "heart_rate",
        title: "Elevated Heart Rate",
        message: "Heart rate alert for this patient. Please monitor closely.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
    ];
    setAlerts(demoAlerts);

    // Build initial history (patient-specific curve).
    const initialHistory: Array<HealthMetrics & { time: string }> = [];
    let prev = initialMetrics;
    for (let i = 0; i < 20; i++) {
      const next = generateMetrics(prev, randRef.current);
      prev = next;
      initialHistory.push({
        ...next,
        time: new Date(Date.now() - (20 - i) * resolvedIntervalMs).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    }
    setHistory(initialHistory);
    setEdgeStats({
      windowsProcessed: 0,
      packetsTransmitted: 0,
      rejectedWindows: 0,
      rejectionRate: 0,
      lastQuality: "good",
      lastPacket: null,
    });
  }, [patientIdOrInterval, patientId, randSeed, resolvedIntervalMs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rawWindow = generateRawWindow(metricsRef.current, randRef.current);
      const inference = runEdgeInference(rawWindow, metricsRef.current.heartRate);
      const edgePacket = inference.packet;

      // If packet was rejected due to motion artifact, keep previous vitals.
      // This simulates ring-side filtering and avoids transmitting noisy values.
      const newMetrics = inference.accepted && edgePacket
        ? {
            ...generateMetrics(metricsRef.current, randRef.current),
            heartRate: edgePacket.heartRate,
            spo2: edgePacket.spo2,
            temperature: edgePacket.temperature,
          }
        : metricsRef.current;

      setMetrics(newMetrics);

      const timeLabel = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setHistory(prev => [...prev.slice(-49), { ...newMetrics, time: timeLabel }]);

      setEdgeStats((prev) => {
        const windowsProcessed = prev.windowsProcessed + 1;
        const packetsTransmitted = prev.packetsTransmitted + (inference.accepted ? 1 : 0);
        const rejectedWindows = prev.rejectedWindows + (inference.accepted ? 0 : 1);
        return {
          windowsProcessed,
          packetsTransmitted,
          rejectedWindows,
          rejectionRate: windowsProcessed ? rejectedWindows / windowsProcessed : 0,
          lastQuality: edgePacket?.quality || "rejected",
          lastPacket: edgePacket || null,
        };
      });

      // Check for alerts (with some randomness to avoid flooding)
      if (inference.accepted && randRef.current() < 0.15) {
        const alert = checkForAlerts(newMetrics);
        if (alert) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            timestamp: new Date(),
            ...alert,
          };
          setAlerts(prev => [newAlert, ...prev].slice(0, 10));
        }
      }
    }, resolvedIntervalMs);

    return () => clearInterval(interval);
  }, [resolvedIntervalMs, patientIdOrInterval]);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  }, []);

  const triggerAlert = useCallback((type: AlertType) => {
    const template = ALERT_TEMPLATES.find(t => t.type === type) || ALERT_TEMPLATES[0];
    const newAlert: Alert = {
      id: `manual-${Date.now()}`,
      type,
      title: template.title,
      message: template.getMessage(type === "heart_rate" ? 115 : type === "fever" ? 101.5 : type === "low_spo2" ? 91 : 9),
      timestamp: new Date(),
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 10));
  }, []);

  return { metrics, history, alerts, deviceStatus, edgeStats, resolveAlert, triggerAlert };
}
