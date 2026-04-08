-- MediConnect Healthcare Production Schema
-- Created: 2026-04-08
-- Description: Complete healthcare management system schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age INTEGER CHECK (age >= 0 AND age <= 150),
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    phone TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Metrics table for real-time monitoring
CREATE TABLE IF NOT EXISTS public.health_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    heart_rate INTEGER CHECK (heart_rate >= 30 AND heart_rate <= 250),
    blood_oxygen NUMERIC CHECK (blood_oxygen >= 0 AND blood_oxygen <= 100),
    body_temperature NUMERIC CHECK (body_temperature >= 35.0 AND body_temperature <= 42.0),
    blood_pressure_systolic INTEGER CHECK (blood_pressure_systolic >= 70 AND blood_pressure_systolic <= 250),
    blood_pressure_diastolic INTEGER CHECK (blood_pressure_diastolic >= 40 AND blood_pressure_diastolic <= 150),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    sleep_hours NUMERIC CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    steps INTEGER DEFAULT 0 CHECK (steps >= 0),
    weight NUMERIC CHECK (weight >= 0),
    height NUMERIC CHECK (height >= 0),
    device_type TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table for health notifications
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    metric_type TEXT,
    threshold_value NUMERIC,
    actual_value NUMERIC,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items table for e-commerce functionality
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('medicine', 'lab test', 'consultation', 'device')),
    price NUMERIC NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    category TEXT,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    qualification TEXT,
    experience_years INTEGER CHECK (experience_years >= 0),
    consultation_fee NUMERIC CHECK (consultation_fee >= 0),
    clinic_name TEXT,
    clinic_address TEXT,
    city TEXT,
    phone TEXT,
    email TEXT,
    rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    available_today BOOLEAN DEFAULT FALSE,
    available_tomorrow BOOLEAN DEFAULT FALSE,
    profile_image TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
    consultation_type TEXT DEFAULT 'in-person' CHECK (consultation_type IN ('in-person', 'video', 'phone')),
    notes TEXT,
    fee NUMERIC CHECK (fee >= 0),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Records table
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    diagnosis TEXT,
    symptoms TEXT,
    prescription TEXT,
    notes TEXT,
    attachments TEXT[], -- Array of file URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab Tests table
CREATE TABLE IF NOT EXISTS public.lab_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    discounted_price NUMERIC CHECK (discounted_price >= 0),
    sample_type TEXT,
    report_time TEXT,
    preparation_required BOOLEAN DEFAULT FALSE,
    preparation_instructions TEXT[],
    home_collection BOOLEAN DEFAULT FALSE,
    rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab Orders table
CREATE TABLE IF NOT EXISTS public.lab_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    lab_test_id UUID REFERENCES public.lab_tests(id) ON DELETE CASCADE,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    sample_collected BOOLEAN DEFAULT FALSE,
    sample_collected_at TIMESTAMP WITH TIME ZONE,
    report_ready BOOLEAN DEFAULT FALSE,
    report_ready_at TIMESTAMP WITH TIME ZONE,
    report_url TEXT,
    home_collection BOOLEAN DEFAULT FALSE,
    collection_address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sample_collected', 'processing', 'ready', 'delivered', 'cancelled')),
    total_amount NUMERIC CHECK (total_amount >= 0),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_patient_id ON public.health_metrics(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_recorded_at ON public.health_metrics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_patient_id ON public.alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON public.alerts(severity);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_rating ON public.doctors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_category ON public.lab_tests(category);
CREATE INDEX IF NOT EXISTS idx_lab_tests_popular ON public.lab_tests(popular DESC);
CREATE INDEX IF NOT EXISTS idx_lab_orders_patient_id ON public.lab_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_status ON public.lab_orders(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Patients can only see their own data
CREATE POLICY "Patients can view own data" ON public.patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Patients can update own data" ON public.patients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Patients can insert own data" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Health metrics - patients can only see their own data
CREATE POLICY "Patients can view own health metrics" ON public.health_metrics
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id));

CREATE POLICY "Patients can insert own health metrics" ON public.health_metrics
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id));

-- Alerts - patients can only see their own alerts
CREATE POLICY "Patients can view own alerts" ON public.alerts
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id));

-- Cart items - users can only see their own cart
CREATE POLICY "Users can view own cart items" ON public.cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart items" ON public.cart_items
    FOR ALL USING (auth.uid() = user_id);

-- Doctors - public read access, doctors can update their own profile
CREATE POLICY "Everyone can view doctors" ON public.doctors
    FOR SELECT USING (true);

CREATE POLICY "Doctors can update own profile" ON public.doctors
    FOR UPDATE USING (auth.uid() = user_id);

-- Appointments - patients and doctors can see relevant appointments
CREATE POLICY "Patients can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id));

CREATE POLICY "Doctors can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.doctors WHERE id = doctor_id));

CREATE POLICY "Patients can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id));

-- Medical records - patients and doctors can see relevant records
CREATE POLICY "Patients can view own medical records" ON public.medical_records
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id));

CREATE POLICY "Doctors can view medical records they created" ON public.medical_records
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can create medical records" ON public.medical_records
    FOR INSERT WITH CHECK (auth.uid() = doctor_id);

-- Lab tests - public read access
CREATE POLICY "Everyone can view lab tests" ON public.lab_tests
    FOR SELECT USING (true);

-- Lab orders - patients can only see their own orders
CREATE POLICY "Patients can view own lab orders" ON public.lab_orders
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id));

CREATE POLICY "Patients can create lab orders" ON public.lab_orders
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id));

-- Enable Realtime for health_metrics table
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_metrics;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_alerts_updated_at
    BEFORE UPDATE ON public.alerts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_doctors_updated_at
    BEFORE UPDATE ON public.doctors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_medical_records_updated_at
    BEFORE UPDATE ON public.medical_records
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_lab_tests_updated_at
    BEFORE UPDATE ON public.lab_tests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_lab_orders_updated_at
    BEFORE UPDATE ON public.lab_orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create user profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, 'patient');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
