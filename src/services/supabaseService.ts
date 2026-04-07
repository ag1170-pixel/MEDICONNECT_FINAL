import { supabase } from '@/integrations/supabase/client';
import type { Doctor, Specialty } from '@/types';

export const fetchSpecialties = async (): Promise<Specialty[]> => {
  try {
    const { data, error } = await supabase
      .from('specialties' as any)
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching specialties:', error);
      return [];
    }

    return (data as unknown as Specialty[]) || [];
  } catch (error) {
    console.error('Error in fetchSpecialties:', error);
    return [];
  }
};

export const fetchDoctors = async (filters?: {
  city?: string;
  specialty_id?: number;
  search?: string;
}): Promise<Doctor[]> => {
  try {
    let query = supabase
      .from('doctors' as any)
      .select('*');

    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    if (filters?.specialty_id) {
      query = query.eq('specialty_id', filters.specialty_id);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,specialty.ilike.%${filters.search}%,clinic_name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }

    return (data as unknown as Doctor[]) || [];
  } catch (error) {
    console.error('Error in fetchDoctors:', error);
    return [];
  }
};

export const fetchDoctorById = async (id: string): Promise<Doctor | null> => {
  try {
    const { data, error } = await supabase
      .from('doctors' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching doctor:', error);
      return null;
    }

    return data as unknown as Doctor;
  } catch (error) {
    console.error('Error in fetchDoctorById:', error);
    return null;
  }
};

export const fetchSpecialtyById = async (id: number): Promise<Specialty | null> => {
  try {
    const { data, error } = await supabase
      .from('specialties' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching specialty:', error);
      return null;
    }

    return data as unknown as Specialty;
  } catch (error) {
    console.error('Error in fetchSpecialtyById:', error);
    return null;
  }
};
