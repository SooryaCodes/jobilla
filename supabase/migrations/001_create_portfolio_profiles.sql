-- Create portfolio_profiles table
CREATE TABLE IF NOT EXISTS portfolio_profiles (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    converted_resume JSONB NOT NULL,
    portfolio_data JSONB,
    role_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_profiles_username ON portfolio_profiles(username);
CREATE INDEX IF NOT EXISTS idx_portfolio_profiles_role_key ON portfolio_profiles(role_key);
CREATE INDEX IF NOT EXISTS idx_portfolio_profiles_created_at ON portfolio_profiles(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a demo/fun app)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow public read access" ON portfolio_profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON portfolio_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON portfolio_profiles
    FOR UPDATE USING (true);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_profiles_updated_at
    BEFORE UPDATE ON portfolio_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some comments for documentation
COMMENT ON TABLE portfolio_profiles IS 'Stores user portfolio data for the Jobilla resume converter';
COMMENT ON COLUMN portfolio_profiles.username IS 'Unique username for the portfolio URL';
COMMENT ON COLUMN portfolio_profiles.converted_resume IS 'The AI-converted resume data in JSON format';
COMMENT ON COLUMN portfolio_profiles.portfolio_data IS 'Additional portfolio data like testimonials, sections, etc.';
COMMENT ON COLUMN portfolio_profiles.role_key IS 'The job role key used for the conversion (e.g., coconut-climber)';

-- Insert some example data for testing (optional)
-- INSERT INTO portfolio_profiles (username, converted_resume, role_key) VALUES 
-- ('johndoe', '{"roleTitle": "Test", "contact": {"name": "John Doe"}}', 'coconut-climber')
-- ON CONFLICT (username) DO NOTHING;
