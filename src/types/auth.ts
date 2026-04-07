import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  full_name?: string;
  phone?: string;
}

export interface AuthError {
  message: string;
}
