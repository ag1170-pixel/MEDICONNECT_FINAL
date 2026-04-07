import { useState, useEffect, useCallback, useRef } from "react";
import { Alert, AlertType } from "@/components/AlertCard";

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

function generateMetrics(prev?: HealthMetrics): HealthMetrics {
  const vary = (base: number, range: number) =>
    Math.max(0, base + (Math.random() - 0.5) * range * 2);

  return {
    heartRate: Math.round(vary(prev?.heartRate || 72, 5)),
    spo2: Math.round(Math.max(90, vary(prev?.spo2 || 98, 1.5))),
    temperature: Math.round(vary(prev?.temperature || 98.4, 0.3) * 10) / 10,
    systolic: Math.round(vary(prev?.systolic || 120, 5)),
    diastolic: Math.round(vary(prev?.diastolic || 80, 3)),
    stress: Math.round(Math.min(10, Math.max(1, vary(prev?.stress || 4, 1)))),
    steps: Math.round((prev?.steps || 3200) + Math.random() * 20),
    calories: Math.round((prev?.calories || 1240) + Math.random() * 5),
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

export function useSimulatedData(intervalMs = 3000) {
  const [metrics, setMetrics] = useState<HealthMetrics>(generateMetrics());
  const [history, setHistory] = useState<Array<HealthMetrics & { time: string }>>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [deviceStatus] = useState<DeviceStatus>({
    band: { connected: true, battery: 78, lastSync: new Date(), charging: false },
    ring: { connected: true, battery: 91, lastSync: new Date(), nfcEnabled: true, fingerprintLocked: false },
  });
  const metricsRef = useRef(metrics);

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    // Add initial demo alerts
    const demoAlerts: Alert[] = [
      {
        id: "demo-1",
        type: "heart_rate",
        title: "Elevated Heart Rate",
        message: "Heart rate at 108 BPM during rest. Please monitor closely.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
    ];
    setAlerts(demoAlerts);

    // Build initial history
    const initialHistory = Array.from({ length: 20 }, (_, i) => {
      const m = generateMetrics();
      return {
        ...m,
        time: new Date(Date.now() - (20 - i) * intervalMs).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
    });
    setHistory(initialHistory);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = generateMetrics(metricsRef.current);
      setMetrics(newMetrics);

      const timeLabel = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setHistory(prev => [...prev.slice(-49), { ...newMetrics, time: timeLabel }]);

      // Check for alerts (with some randomness to avoid flooding)
      if (Math.random() < 0.15) {
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
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

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

  return { metrics, history, alerts, deviceStatus, resolveAlert, triggerAlert };
}
