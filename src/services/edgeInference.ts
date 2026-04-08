export interface RawSensorSample {
  ppg: number;
  accel: number;
  skinTempF: number;
  ts: number;
}

export interface VitalsPacket {
  heartRate: number;
  spo2: number;
  temperature: number;
  quality: "good" | "degraded" | "rejected";
  motionArtifactScore: number;
  ts: number;
}

export interface InferenceWindowResult {
  packet: VitalsPacket | null;
  accepted: boolean;
}

function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = avg(values);
  const variance = avg(values.map((v) => (v - mean) ** 2));
  return Math.sqrt(variance);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// Simulates ring-side edge inference:
// 1) estimates motion artifact score from accelerometer + signal variance
// 2) rejects low quality windows
// 3) emits compact final packet only
export function runEdgeInference(samples: RawSensorSample[], prevHr = 72): InferenceWindowResult {
  if (!samples.length) return { packet: null, accepted: false };

  const ppgValues = samples.map((s) => s.ppg);
  const accelValues = samples.map((s) => s.accel);
  const tempValues = samples.map((s) => s.skinTempF);

  const accelMean = avg(accelValues);
  const ppgNoise = stdDev(ppgValues);
  const motionArtifactScore = clamp(accelMean * 0.7 + (ppgNoise / 6) * 0.3, 0, 1);

  if (motionArtifactScore > 0.8) {
    return {
      packet: {
        heartRate: prevHr,
        spo2: 96,
        temperature: Math.round(avg(tempValues) * 10) / 10,
        quality: "rejected",
        motionArtifactScore: Math.round(motionArtifactScore * 100) / 100,
        ts: samples[samples.length - 1].ts,
      },
      accepted: false,
    };
  }

  const ppgMean = avg(ppgValues);
  const heartRate = clamp(Math.round(55 + ppgMean * 0.7), 50, 145);
  const spo2 = clamp(Math.round(99 - motionArtifactScore * 6 - ppgNoise * 0.03), 88, 100);
  const temperature = Math.round(avg(tempValues) * 10) / 10;
  const quality = motionArtifactScore > 0.5 ? "degraded" : "good";

  return {
    packet: {
      heartRate,
      spo2,
      temperature,
      quality,
      motionArtifactScore: Math.round(motionArtifactScore * 100) / 100,
      ts: samples[samples.length - 1].ts,
    },
    accepted: true,
  };
}

