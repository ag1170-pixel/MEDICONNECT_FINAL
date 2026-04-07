-- Create specialties table
CREATE TABLE public.specialties (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  specialty_id INTEGER NOT NULL REFERENCES public.specialties(id),
  years_experience INTEGER,
  clinic_name TEXT,
  city TEXT,
  fees INTEGER,
  rating DECIMAL(3,1),
  reviews_count INTEGER,
  bio TEXT,
  available_today BOOLEAN DEFAULT false,
  available_tomorrow BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for specialties table (read-only for public)
CREATE POLICY "Anyone can view specialties" 
ON public.specialties 
FOR SELECT 
USING (true);

-- Create policies for doctors table (read-only for public)
CREATE POLICY "Anyone can view doctors" 
ON public.doctors 
FOR SELECT 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_specialties_updated_at
BEFORE UPDATE ON public.specialties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
