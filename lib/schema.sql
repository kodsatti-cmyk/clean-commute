-- Commute entries table
-- Stores all logged commute data with zero PII
CREATE TABLE IF NOT EXISTS commute_entries (
  id SERIAL PRIMARY KEY,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  office_location VARCHAR(50) NOT NULL,
  travel_mode VARCHAR(30) NOT NULL,
  kilometers DECIMAL(5,2) NOT NULL
);

-- Index for faster queries by date and location
CREATE INDEX IF NOT EXISTS idx_logged_at ON commute_entries(logged_at);
CREATE INDEX IF NOT EXISTS idx_office_location ON commute_entries(office_location);
