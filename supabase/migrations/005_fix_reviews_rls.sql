-- Enable RLS on the reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all reviews
CREATE POLICY "Public reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Authenticated users can insert reviews" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update reviews (for likes incrementing)
-- Ideally this would be an RPC or constrained to only the likes column, 
-- but for MVP simplicity we allow auth updates.
CREATE POLICY "Authenticated users can update reviews" ON reviews
    FOR UPDATE USING (auth.role() = 'authenticated');
