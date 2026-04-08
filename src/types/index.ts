// MediConnect Type Definitions

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialty_id: number;
  years_experience: number;
  clinic_name: string;
  city: string;
  state?: string;
  fees: number;
  rating: number;
  reviews_count: number;
  bio: string;
  profile_image?: string;
  available_today: boolean;
  available_tomorrow: boolean;
}

export interface Specialty {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  date: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  doctor: Doctor;
  patient_name: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  fees: number;
  booking_date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SearchFilters {
  city?: string;
  specialty_id?: number;
  min_fee?: number;
  max_fee?: number;
  min_rating?: number;
  availability?: 'today' | 'tomorrow' | 'any';
  sort_by?: 'rating' | 'fees' | 'experience';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}