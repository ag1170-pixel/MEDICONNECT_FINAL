import { Doctor } from "@/types";
import doctorsCsvRaw from "@/data/doctors.csv?raw";

function parseBoolean(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}

function parseNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

// Minimal CSV parser that supports:
// - comma separated fields
// - quoted fields with escaped quotes ("")
// - \r\n or \n newlines
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    // Avoid pushing a trailing empty row from final newline
    if (row.length === 1 && row[0] === "" && rows.length === 0) return;
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      pushField();
      continue;
    }

    if (ch === "\n") {
      pushField();
      pushRow();
      continue;
    }

    if (ch === "\r") {
      // Handle CRLF
      const next = text[i + 1];
      if (next === "\n") i++;
      pushField();
      pushRow();
      continue;
    }

    field += ch;
  }

  // Final field/row
  pushField();
  if (row.length > 1 || row.some((c) => c.trim() !== "")) {
    pushRow();
  }

  return rows;
}

export function loadDoctorsFromCsv(csvText: string = doctorsCsvRaw): Doctor[] {
  const rows = parseCsv(csvText).filter((r) => r.some((c) => c.trim() !== ""));
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  const idx = (name: string) => header.indexOf(name);
  const get = (r: string[], name: string) => {
    const i = idx(name);
    return i >= 0 ? (r[i] ?? "") : "";
  };

  return dataRows
    .map((r): Doctor => {
      const id = get(r, "id").trim();
      return {
        id,
        name: get(r, "name").trim(),
        specialty: get(r, "specialty").trim(),
        specialty_id: parseInt(get(r, "specialty_id"), 10) || 0,
        years_experience: parseInt(get(r, "years_experience"), 10) || 0,
        clinic_name: get(r, "clinic_name").trim(),
        city: get(r, "city").trim(),
        state: get(r, "state").trim() || undefined,
        fees: parseNumber(get(r, "fees")),
        rating: parseNumber(get(r, "rating")),
        reviews_count: parseInt(get(r, "reviews_count"), 10) || 0,
        bio: get(r, "bio").trim(),
        profile_image: get(r, "profile_image").trim() || undefined,
        available_today: parseBoolean(get(r, "available_today")),
        available_tomorrow: parseBoolean(get(r, "available_tomorrow")),
      };
    })
    .filter((d) => d.id && d.name);
}

export function getUniqueStates(doctors: Doctor[]): string[] {
  return Array.from(
    new Set(
      doctors
        .map((d) => d.state)
        .filter((s): s is string => Boolean(s && s.trim()))
        .map((s) => s.trim())
    )
  ).sort((a, b) => a.localeCompare(b));
}

export function getUniqueCities(doctors: Doctor[]): string[] {
  return Array.from(
    new Set(
      doctors
        .map((d) => d.city)
        .filter((s): s is string => Boolean(s && s.trim()))
        .map((s) => s.trim())
    )
  ).sort((a, b) => a.localeCompare(b));
}

