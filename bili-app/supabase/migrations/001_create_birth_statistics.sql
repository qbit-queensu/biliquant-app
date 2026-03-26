-- Create birth_statistics table to store live birth counter data
-- This table persists the birth count so it never resets

CREATE TABLE IF NOT EXISTS birth_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  birth_count INTEGER NOT NULL DEFAULT 24809,
  last_incremented TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for security
ALTER TABLE birth_statistics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to birth statistics
CREATE POLICY "Allow public read access to birth statistics" 
ON birth_statistics FOR SELECT 
USING (true);

-- Allow authenticated users to update birth statistics
CREATE POLICY "Allow authenticated users to update birth statistics" 
ON birth_statistics FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert birth statistics
CREATE POLICY "Allow authenticated users to insert birth statistics" 
ON birth_statistics FOR INSERT 
USING (auth.role() = 'authenticated');

-- Insert initial record if table is empty
INSERT INTO birth_statistics (birth_count, last_incremented)
SELECT 24809, NOW()
WHERE NOT EXISTS (SELECT 1 FROM birth_statistics);
