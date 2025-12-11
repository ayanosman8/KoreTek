-- Add first_name and last_name columns to form_submissions table
ALTER TABLE form_submissions
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Remove the old name column since we now have first_name and last_name
ALTER TABLE form_submissions DROP COLUMN name;
