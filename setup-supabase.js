const { createClient } = require('@supabase/supabase-js');

// Use your actual Supabase URL from client.ts
const SUPABASE_URL = 'https://adghzpohumdywcrnzxum.supabase.co';
const SUPABASE_SERVICE_KEY = 'your-service-role-key-here'; // You need to get this from Supabase dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  try {
    console.log('Setting up specialties table...');
    
    // Create specialties table
    const { error: specialtiesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.specialties (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          icon TEXT,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Anyone can view specialties" ON public.specialties;
        CREATE POLICY "Anyone can view specialties" 
        ON public.specialties 
        FOR SELECT 
        USING (true);
      `
    });

    if (specialtiesError) {
      console.error('Error creating specialties table:', specialtiesError);
    } else {
      console.log('Specialties table created successfully');
    }

    // Create doctors table
    console.log('Setting up doctors table...');
    const { error: doctorsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.doctors (
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
        
        ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;
        CREATE POLICY "Anyone can view doctors" 
        ON public.doctors 
        FOR SELECT 
        USING (true);
      `
    });

    if (doctorsError) {
      console.error('Error creating doctors table:', doctorsError);
    } else {
      console.log('Doctors table created successfully');
    }

    // Insert data
    console.log('Inserting mock data...');
    
    // Insert specialties
    const specialties = [
      { id: 1, name: "Cardiology", icon: "heart", description: "Heart and cardiovascular care" },
      { id: 2, name: "Dermatology", icon: "user", description: "Skin, hair and nail care" },
      { id: 3, name: "Orthopedics", icon: "bone", description: "Bone and joint care" },
      { id: 4, name: "Pediatrics", icon: "baby", description: "Children's healthcare" },
      { id: 5, name: "Neurology", icon: "brain", description: "Brain and nervous system" },
      { id: 6, name: "Gynecology", icon: "user-check", description: "Women's health" },
      { id: 7, name: "General Medicine", icon: "stethoscope", description: "General health consultation" },
      { id: 8, name: "Dentistry", icon: "smile", description: "Dental and oral care" }
    ];

    for (const specialty of specialties) {
      const { error } = await supabase
        .from('specialties')
        .upsert(specialty, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting specialty ${specialty.name}:`, error);
      }
    }

    // Insert doctors
    const doctors = [
      {
        id: "1",
        name: "Rajesh Kumar",
        specialty: "Cardiology",
        specialty_id: 1,
        years_experience: 15,
        clinic_name: "Heart Care Center",
        city: "Mumbai",
        fees: 800,
        rating: 4.8,
        reviews_count: 324,
        bio: "Dr. Rajesh Kumar is a renowned cardiologist with over 15 years of experience in treating heart conditions. He specializes in interventional cardiology and has performed over 2000 successful procedures.",
        available_today: true,
        available_tomorrow: true
      },
      {
        id: "2",
        name: "Priya Sharma",
        specialty: "Dermatology",
        specialty_id: 2,
        years_experience: 12,
        clinic_name: "Skin Plus Clinic",
        city: "Delhi",
        fees: 600,
        rating: 4.9,
        reviews_count: 256,
        bio: "Dr. Priya Sharma is a leading dermatologist specializing in cosmetic dermatology and skin cancer treatment. She has trained internationally and uses the latest technology for skin treatments.",
        available_today: false,
        available_tomorrow: true
      },
      {
        id: "3",
        name: "Amit Singh",
        specialty: "Orthopedics",
        specialty_id: 3,
        years_experience: 18,
        clinic_name: "Bone & Joint Hospital",
        city: "Bangalore",
        fees: 900,
        rating: 4.7,
        reviews_count: 412,
        bio: "Dr. Amit Singh is an experienced orthopedic surgeon specializing in joint replacement and sports medicine. He has helped thousands of patients regain mobility and live pain-free lives.",
        available_today: true,
        available_tomorrow: false
      },
      {
        id: "4",
        name: "Sneha Patel",
        specialty: "Pediatrics",
        specialty_id: 4,
        years_experience: 10,
        clinic_name: "Children's Care Clinic",
        city: "Pune",
        fees: 500,
        rating: 4.9,
        reviews_count: 189,
        bio: "Dr. Sneha Patel is a dedicated pediatrician who provides comprehensive care for children from newborns to adolescents. She is known for her gentle approach and excellent communication with both children and parents.",
        available_today: true,
        available_tomorrow: true
      },
      {
        id: "5",
        name: "Vikram Malhotra",
        specialty: "Neurology",
        specialty_id: 5,
        years_experience: 20,
        clinic_name: "Neuro Care Center",
        city: "Chennai",
        fees: 1000,
        rating: 4.8,
        reviews_count: 298,
        bio: "Dr. Vikram Malhotra is a distinguished neurologist with expertise in treating complex neurological disorders. He has published numerous research papers and is a pioneer in minimally invasive neurological procedures.",
        available_today: false,
        available_tomorrow: true
      },
      {
        id: "6",
        name: "Kavya Reddy",
        specialty: "Gynecology",
        specialty_id: 6,
        years_experience: 14,
        clinic_name: "Women's Health Clinic",
        city: "Hyderabad",
        fees: 700,
        rating: 4.9,
        reviews_count: 367,
        bio: "Dr. Kavya Reddy is a compassionate gynecologist and obstetrician who provides comprehensive women's healthcare. She specializes in high-risk pregnancies and minimally invasive gynecological surgeries.",
        available_today: true,
        available_tomorrow: true
      }
    ];

    for (const doctor of doctors) {
      const { error } = await supabase
        .from('doctors')
        .upsert(doctor, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting doctor ${doctor.name}:`, error);
      }
    }

    console.log('Setup completed successfully!');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();
