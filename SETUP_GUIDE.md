# MediConnect Supabase Setup Guide

## 🚨 IMPORTANT: Follow these steps to get data working on your Vercel deployment

### Step 1: Run the SQL Setup in Supabase Dashboard

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `adghzpohumdywcrnzxum`
3. Go to **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the entire content from `supabase-setup.sql` file
6. Click **Run** to execute the SQL

This will create:
- `specialties` table with 8 medical specialties
- `doctors` table with 6 sample doctors
- Proper RLS policies for public access
- All necessary data

### Step 2: Verify Environment Variables

Make sure these are in your Vercel environment variables:

```
VITE_SUPABASE_URL=https://adghzpohumdywcrnzxum.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZ2h6cG9odW1keXdjcm56eHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNzI0ODMsImV4cCI6MjA3Mjc0ODQ4M30.uR6A3tNiFZ83auAsfsBB2RBXeFfjhvmnIA6wv9oqnrE
```

### Step 3: Check Authentication Setup

Your Supabase auth should already be configured with:
- Email/password authentication enabled
- User profiles table created
- Automatic profile creation on signup

### Step 4: Test the Application

1. Run locally first: `npm run dev`
2. Check if doctors and specialties appear on the home page
3. Test search functionality
4. Test signup/login flow

### Step 5: Deploy to Vercel

1. Push changes to GitHub
2. Vercel will auto-deploy
3. Test the live site

## 🔧 What We've Fixed

1. **Created missing Supabase tables**: `doctors` and `specialties`
2. **Added Supabase data service**: `src/services/supabaseService.ts`
3. **Updated Home component**: Now fetches data from Supabase instead of mock data
4. **Fixed TypeScript issues**: Added proper type casting for Supabase queries
5. **Created SQL setup script**: `supabase-setup.sql` for easy deployment

## 📊 Database Schema

### Specialties Table
- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `icon` (TEXT)
- `description` (TEXT)

### Doctors Table
- `id` (TEXT, Primary Key)
- `name` (TEXT)
- `specialty` (TEXT)
- `specialty_id` (INTEGER, Foreign Key)
- `years_experience` (INTEGER)
- `clinic_name` (TEXT)
- `city` (TEXT)
- `fees` (INTEGER)
- `rating` (DECIMAL)
- `reviews_count` (INTEGER)
- `bio` (TEXT)
- `available_today` (BOOLEAN)
- `available_tomorrow` (BOOLEAN)

## 🚨 Troubleshooting

### If no data appears on the site:
1. Check browser console for errors
2. Verify Supabase URL and keys are correct
3. Ensure SQL script was run successfully
4. Check RLS policies in Supabase

### If authentication doesn't work:
1. Verify email auth is enabled in Supabase
2. Check redirect URLs in Supabase auth settings
3. Ensure environment variables are set correctly

## 📝 Next Steps

After setup, consider:
1. Adding more doctors and specialties
2. Implementing doctor availability management
3. Adding appointment booking system
4. Setting up payment integration
