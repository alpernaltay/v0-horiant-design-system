-- 1. Ensure username is unique
ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);

-- 2. Add parent_id to reviews for threaded replies
ALTER TABLE reviews ADD COLUMN parent_id UUID REFERENCES reviews(id) ON DELETE CASCADE;

-- 3. Universal Review System: Allow profile_id and make watch_id nullable
ALTER TABLE reviews ALTER COLUMN watch_id DROP NOT NULL;
ALTER TABLE reviews ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
