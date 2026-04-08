import type { Appointment } from "@/types";

const STORAGE_KEY = "mediConnectAppointments";

function safeParse(json: string | null): Appointment[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Appointment[];
  } catch {
    return [];
  }
}

export function loadAppointments(): Appointment[] {
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function saveAppointments(appointments: Appointment[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export function addAppointment(appointment: Appointment): void {
  const current = loadAppointments();
  // Avoid duplicate IDs (e.g., accidental double-click).
  const exists = current.some((a) => a.id === appointment.id);
  const next = exists ? current : [appointment, ...current];
  saveAppointments(next);
}

export function cancelAppointment(appointmentId: string): void {
  const current = loadAppointments();
  const next = current.map((a) =>
    a.id === appointmentId ? { ...a, status: "cancelled" as const } : a
  );
  saveAppointments(next);
}

