-- ============================================================
-- ANTYO Focus — Supabase Migration
-- Migration: 001_create_focus_sessions
-- Description: Create focus_sessions table with optimized schema
-- Run via: supabase db push / supabase migration up
-- ============================================================

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id              SERIAL PRIMARY KEY,
  task            TEXT        NOT NULL,
  mode            TEXT        NOT NULL DEFAULT 'stopwatch',
  focus_time      INTEGER     NOT NULL,
  distracted_time INTEGER     NOT NULL,
  total_time      INTEGER     NOT NULL,
  started_at      TIMESTAMPTZ NOT NULL,
  ended_at        TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_mode CHECK (mode IN ('timer', 'stopwatch')),
  CONSTRAINT chk_focus_time_positive CHECK (focus_time >= 0),
  CONSTRAINT chk_distracted_time_positive CHECK (distracted_time >= 0),
  CONSTRAINT chk_total_time_positive CHECK (total_time >= 0),
  CONSTRAINT chk_task_not_empty CHECK (LENGTH(TRIM(task)) > 0),
  CONSTRAINT chk_ended_after_started CHECK (ended_at >= started_at)
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_focus_sessions_created_at ON focus_sessions (created_at);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started_at ON focus_sessions (started_at);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_task ON focus_sessions (task);

-- ============================================================
-- Auto-update updated_at on row modification
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_focus_sessions_updated_at
  BEFORE UPDATE ON focus_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security — allow anon access for frontend client
-- ============================================================
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert" ON focus_sessions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon select" ON focus_sessions
  FOR SELECT TO anon
  USING (true);

-- ============================================================
-- Row Level Security (RLS) — siap untuk auth nanti
-- ============================================================
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: allow all operations for now (no auth yet)
-- Ganti policy ini saat menambah Supabase Auth
CREATE POLICY "Allow all access (no auth)" ON focus_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Comments for documentation
-- ============================================================
COMMENT ON TABLE focus_sessions IS 'Stores each focus session with duration tracking and distraction detection data';
COMMENT ON COLUMN focus_sessions.id IS 'Auto-increment primary key';
COMMENT ON COLUMN focus_sessions.task IS 'Label/nama task yang dikerjakan user';
COMMENT ON COLUMN focus_sessions.mode IS 'Mode sesi: timer atau stopwatch';
COMMENT ON COLUMN focus_sessions.focus_time IS 'Durasi waktu fokus dalam detik';
COMMENT ON COLUMN focus_sessions.distracted_time IS 'Durasi waktu distraksi dalam detik';
COMMENT ON COLUMN focus_sessions.total_time IS 'Total durasi sesi dalam detik (focus + distracted)';
COMMENT ON COLUMN focus_sessions.started_at IS 'Timestamp kapan sesi dimulai';
COMMENT ON COLUMN focus_sessions.ended_at IS 'Timestamp kapan sesi diakhiri';
COMMENT ON COLUMN focus_sessions.created_at IS 'Timestamp kapan record dibuat di database';
COMMENT ON COLUMN focus_sessions.updated_at IS 'Timestamp terakhir record diupdate';
