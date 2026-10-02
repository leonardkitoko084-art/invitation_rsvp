CREATE TABLE IF NOT EXISTS wedding_tables (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE,
  created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  table_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_guests_table_id ON guests(table_id);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY,
  invitation_id TEXT UNIQUE,
  public_key TEXT UNIQUE,
  full_name TEXT NOT NULL,
  table_name_snapshot TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  attending TEXT NOT NULL CHECK(attending IN ('yes', 'no')),
  additional_guests INTEGER NOT NULL DEFAULT 0,
  guest_names TEXT NOT NULL DEFAULT '',
  drink_preference TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_rsvps_updated_at ON rsvps(updated_at);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  last_submit_at INTEGER NOT NULL
);
