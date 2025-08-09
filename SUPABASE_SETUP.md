# Supabase Setup for Jobilla Resume Converter

This document explains how to set up Supabase for the portfolio feature.

## Prerequisites

1. [Supabase](https://supabase.com) account
2. A new Supabase project

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be fully initialized

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### 3. Set Environment Variables

Create a `.env.local` file in your project root and add:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration (existing)
OPENAI_API_KEY=your-openai-key-here
```

### 4. Run Database Migrations

There are two ways to set up the database:

#### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

4. Link your project:
   ```bash
   supabase link --project-ref your-project-id
   ```

5. Push the migration:
   ```bash
   supabase db push
   ```

#### Option B: Manual SQL Execution

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the sidebar
3. Copy the contents of `supabase/migrations/001_create_portfolio_profiles.sql`
4. Paste and run the SQL

### 5. Verify Setup

1. In your Supabase dashboard, go to **Table Editor**
2. You should see a `portfolio_profiles` table with the following columns:
   - `id` (bigint, primary key)
   - `username` (text, unique)
   - `converted_resume` (jsonb)
   - `portfolio_data` (jsonb)
   - `role_key` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

### 6. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Upload a resume and complete the conversion process
3. Check your Supabase dashboard to see if the data was saved

## Features Enabled

With Supabase configured, the following features will work:

- **Portfolio Storage**: Converted resumes are saved to the database
- **Public Portfolio URLs**: Each user gets a unique URL like `/username`
- **Portfolio Persistence**: Portfolios are available even after browser refresh
- **Download from Portfolio**: PDFs can be downloaded directly from portfolio pages

## Fallback Behavior

If Supabase is not configured (missing environment variables), the application will:

- Fall back to in-memory storage for the current session
- Still allow resume conversion and PDF download
- Show portfolios only during the current session
- Not persist data between sessions

## Database Schema

```sql
CREATE TABLE portfolio_profiles (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    converted_resume JSONB NOT NULL,
    portfolio_data JSONB,
    role_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security

- Row Level Security (RLS) is enabled
- Public read/write access is allowed for demo purposes
- In production, consider implementing user authentication and more restrictive policies

## Troubleshooting

### Common Issues

1. **"Supabase not configured" error**:
   - Check your environment variables
   - Ensure `.env.local` is in the project root
   - Restart your development server

2. **"Database table not found" error**:
   - Run the database migration
   - Check if the table exists in Supabase dashboard

3. **Connection errors**:
   - Verify your Supabase project is active
   - Check your internet connection
   - Confirm the project URL and API key are correct

4. **Environment variables not loading**:
   - Make sure the file is named `.env.local` exactly
   - Restart your Next.js development server
   - Check that variables start with `NEXT_PUBLIC_` for client-side access

### Development Tips

- Use the Supabase dashboard to monitor database activity
- Check the browser console for detailed error messages
- Use `isSupabaseConfigured()` function to check configuration status
- The app gracefully falls back to memory storage if Supabase is unavailable

## Production Deployment

For production deployment:

1. Add the environment variables to your hosting platform
2. Consider implementing proper authentication
3. Review and tighten Row Level Security policies
4. Set up database backups
5. Monitor database usage and performance
