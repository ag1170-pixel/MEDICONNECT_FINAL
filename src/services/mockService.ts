import type { Doctor, Specialty } from '@/types';
import { mockDoctors, mockSpecialties } from '@/data/mockData';

export const fetchSpecialties = async (): Promise<Specialty[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSpecialties;
};

export const fetchDoctors = async (filters?: {
  city?: string;
  specialty_id?: number;
  search?: string;
}): Promise<Doctor[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredDoctors = [...mockDoctors];
  
  if (filters?.city) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }
  
  if (filters?.specialty_id) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.specialty_id === filters.specialty_id
    );
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchLower) ||
      doctor.specialty.toLowerCase().includes(searchLower) ||
      doctor.clinic_name.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredDoctors;
};

export const fetchDoctorById = async (id: string): Promise<Doctor | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDoctors.find(doctor => doctor.id === id) || null;
};

export const fetchSpecialtyById = async (id: number): Promise<Specialty | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockSpecialties.find(specialty => specialty.id === id) || null;
};
