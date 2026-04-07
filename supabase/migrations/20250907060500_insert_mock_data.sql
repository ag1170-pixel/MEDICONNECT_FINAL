-- Insert specialties data
INSERT INTO public.specialties (id, name, icon, description) VALUES
(1, 'Cardiology', 'heart', 'Heart and cardiovascular care'),
(2, 'Dermatology', 'user', 'Skin, hair and nail care'),
(3, 'Orthopedics', 'bone', 'Bone and joint care'),
(4, 'Pediatrics', 'baby', 'Children''s healthcare'),
(5, 'Neurology', 'brain', 'Brain and nervous system'),
(6, 'Gynecology', 'user-check', 'Women''s health'),
(7, 'General Medicine', 'stethoscope', 'General health consultation'),
(8, 'Dentistry', 'smile', 'Dental and oral care');

-- Insert doctors data
INSERT INTO public.doctors (id, name, specialty, specialty_id, years_experience, clinic_name, city, fees, rating, reviews_count, bio, available_today, available_tomorrow) VALUES
('1', 'Rajesh Kumar', 'Cardiology', 1, 15, 'Heart Care Center', 'Mumbai', 800, 4.8, 324, 'Dr. Rajesh Kumar is a renowned cardiologist with over 15 years of experience in treating heart conditions. He specializes in interventional cardiology and has performed over 2000 successful procedures.', true, true),
('2', 'Priya Sharma', 'Dermatology', 2, 12, 'Skin Plus Clinic', 'Delhi', 600, 4.9, 256, 'Dr. Priya Sharma is a leading dermatologist specializing in cosmetic dermatology and skin cancer treatment. She has trained internationally and uses the latest technology for skin treatments.', false, true),
('3', 'Amit Singh', 'Orthopedics', 3, 18, 'Bone & Joint Hospital', 'Bangalore', 900, 4.7, 412, 'Dr. Amit Singh is an experienced orthopedic surgeon specializing in joint replacement and sports medicine. He has helped thousands of patients regain mobility and live pain-free lives.', true, false),
('4', 'Sneha Patel', 'Pediatrics', 4, 10, 'Children''s Care Clinic', 'Pune', 500, 4.9, 189, 'Dr. Sneha Patel is a dedicated pediatrician who provides comprehensive care for children from newborns to adolescents. She is known for her gentle approach and excellent communication with both children and parents.', true, true),
('5', 'Vikram Malhotra', 'Neurology', 5, 20, 'Neuro Care Center', 'Chennai', 1000, 4.8, 298, 'Dr. Vikram Malhotra is a distinguished neurologist with expertise in treating complex neurological disorders. He has published numerous research papers and is a pioneer in minimally invasive neurological procedures.', false, true),
('6', 'Kavya Reddy', 'Gynecology', 6, 14, 'Women''s Health Clinic', 'Hyderabad', 700, 4.9, 367, 'Dr. Kavya Reddy is a compassionate gynecologist and obstetrician who provides comprehensive women''s healthcare. She specializes in high-risk pregnancies and minimally invasive gynecological surgeries.', true, true);
